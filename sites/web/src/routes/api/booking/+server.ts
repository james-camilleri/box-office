import { error } from '@sveltejs/kit'
import {
  STRIPE_LIVE_SECRET_KEY,
  STRIPE_TEST_SECRET_KEY,
  STRIPE_WEBHOOK_SECRET,
} from '$env/static/private'
import { PUBLIC_USE_STRIPE_TEST } from '$env/static/public'
import { CUSTOMER_ID } from 'shared/queries'
import type { Discount, Seat, Ticket } from 'shared/types'
import {
  createReference,
  createTicketsForBooking,
  generateArrayKey,
  generateOrderConfirmationId,
} from 'shared/utils'
import { log } from 'shared/utils'
import Stripe from 'stripe'

import { sanity } from '../sanity.js'
import type { RequestHandler } from './$types.js'

const API_KEY =
  import.meta.env.PROD && !PUBLIC_USE_STRIPE_TEST ? STRIPE_LIVE_SECRET_KEY : STRIPE_TEST_SECRET_KEY

const stripe = new Stripe(API_KEY)

export const POST: RequestHandler = async ({ request, fetch }) => {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature') ?? ''

  let event

  try {
    event = stripe.webhooks.constructEvent(body, signature, STRIPE_WEBHOOK_SECRET)
  } catch (err: any) {
    log.warn('Webhook signature verification failed:')
    log.warn(err.message)

    throw error(400)
  }

  if (event.type === 'charge.succeeded') {
    const charge = event.data.object
    const {
      id,
      billing_details: { name, email },
      metadata,
    } = charge

    const seats = JSON.parse(metadata.seats) as Seat[]
    const discount = (metadata.discount && JSON.parse(metadata.discount)) as Discount | undefined
    const bookingData = {
      name,
      email,
      show: metadata.show,
      seats,
      discount,
      stripeId: id,
    }

    log.info(
      [
        'Retrieved booking details from Stripe:',
        `name: ${name}`,
        `email: ${email}`,
        `show: ${metadata.show}`,
        `seats: ${seats.map(({ _id }) => _id).join(', ')}`,
        `discount: ${discount?.code}`,
        `stripeId: ${id}`,
      ].join('\n'),
    )

    try {
      await finalisePurchase(bookingData, fetch)
    } catch (e) {
      console.error(e)
      log.error(e)
      throw error(500)
    }
  }

  return new Response()
}

interface BookingData {
  name: string
  email: string
  show: string
  seats: Seat[]
  discount?: Discount
  stripeId: string
}

async function finalisePurchase(bookingData: BookingData, svelteFetch: typeof fetch) {
  const { name, email, show, seats, discount, stripeId } = bookingData

  const bookingId = crypto.randomUUID()
  log.debug('Created booking ID', bookingId)
  const orderConfirmation = generateOrderConfirmationId()
  log.debug('Created order confirmation', orderConfirmation)

  const [tickets, customerId] = await Promise.all([
    await createTicketsForBooking(sanity, {
      bookingId,
      showId: show,
      seats: seats.map(({ _id }) => _id),
    }),
    await getCustomerId(name, email),
  ])

  // TODO: Email.
  // await svelteFetch('/api/tickets/email', {
  //   method: 'POST',
  //   body: JSON.stringify({
  //     bookingId,
  //     orderConfirmation,
  //     tickets,
  //   }),
  // })

  // Create booking.
  log.info('Creating booking document on Sanity.io')
  await sanity.create({
    _type: 'booking',
    customer: createReference(customerId),
    show: createReference(show),
    seats: seats.map(({ _id }) => ({ ...createReference(_id), _key: generateArrayKey() })),
    discount: discount?._id && createReference(discount?._id),
    tickets: tickets.map(({ _id }) => ({ ...createReference(_id), _key: generateArrayKey() })),
    orderConfirmation,
    transactionId: stripeId,
  })

  log.success('Booking created')
}

async function getCustomerId(name: string, email: string): Promise<string> {
  log.debug('Getting customer ID for', name, email)
  const customerId = await sanity.fetch(CUSTOMER_ID, { email })

  if (customerId) {
    log.info(`Customer ID for ${email} found: ${customerId}`)
    return customerId
  }

  log.debug(`Creating customer ${name} (${email}).`)
  const response = await sanity.create({
    _type: 'customer',
    name,
    email,
  })

  log.info('Created new customer', response._id)
  return response._id
}
