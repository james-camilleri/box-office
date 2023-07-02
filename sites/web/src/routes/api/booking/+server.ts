import { error } from '@sveltejs/kit'
import {
  STRIPE_LIVE_SECRET_KEY,
  STRIPE_LIVE_WEBHOOK_SECRET,
  STRIPE_TEST_SECRET_KEY,
  STRIPE_TEST_WEBHOOK_SECRET,
} from '$env/static/private'
import { PUBLIC_USE_STRIPE_TEST } from '$env/static/public'
import {
  CUSTOMER_ID,
  EMAIL_TEXT,
  SEAT_DETAILS,
  SHOW_DETAILS,
  TRANSACTION_ID_EXISTS,
} from 'shared/queries'
import type { ConfigurationFull, Discount, Seat, Show } from 'shared/types'
import {
  calculateTotal,
  createReference,
  createTicketsForBooking,
  generateArrayKey,
  generateOrderConfirmationId,
} from 'shared/utils'
import { log } from 'shared/utils'
import Stripe from 'stripe'

import { sanity } from '../sanity.js'
import type { RequestHandler } from './$types.js'
import { sendEmail } from './email/email.js'

interface QueuedRequests {
  CONFIG?: Promise<ConfigurationFull>
  CUSTOMER_ID?: Promise<string>
  EMAIL_TEXT?: Promise<unknown>
  SEAT_DETAILS?: Promise<Seat[]>
  SHOW_DETAILS?: Promise<Show>
}

const API_KEY =
  import.meta.env.PROD && PUBLIC_USE_STRIPE_TEST !== 'true'
    ? STRIPE_LIVE_SECRET_KEY
    : STRIPE_TEST_SECRET_KEY

const WEBHOOK_SECRET =
  import.meta.env.PROD && PUBLIC_USE_STRIPE_TEST !== 'true'
    ? STRIPE_LIVE_WEBHOOK_SECRET
    : STRIPE_TEST_WEBHOOK_SECRET

const stripe = new Stripe(API_KEY)

export const POST: RequestHandler = async ({ request, fetch }) => {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')
  log.debug('New booking POST', body, signature)

  // Prefetch all the additional data we'll be needing anyway.
  const queuedRequests: QueuedRequests = {
    CONFIG: fetch('/api/config').then((response) => response.json()),
    EMAIL_TEXT: sanity.fetch(EMAIL_TEXT),
  }

  let event

  if (signature) {
    try {
      event = stripe.webhooks.constructEvent(body, signature, WEBHOOK_SECRET)
    } catch (err: any) {
      log.error('Webhook signature verification failed:')
      log.error(err.message)
      await log.flushAll()

      throw error(400)
    }
  }

  let bookingData: BookingData
  if (event?.type) {
    // Don't process any stripe events besides successful payments.
    if (event.type !== 'charge.succeeded') {
      return new Response()
    }

    const charge = event.data.object
    const {
      id,
      billing_details: { name, email },
      metadata,
    } = charge

    if (await idExists(id)) {
      log.warn(`Transaction ID "${id}" already exists in Sanity database.`)
      await log.flush()
      return new Response()
    }

    const seatIds = JSON.parse(metadata.seatIds) as string[]
    const discount = (metadata.discount && JSON.parse(metadata.discount)) as Discount | undefined
    const campaigns = (metadata.campaigns && JSON.parse(metadata.campaigns)) as string[] | undefined

    queuedRequests.CUSTOMER_ID = getCustomerId(name, email)
    queuedRequests.SHOW_DETAILS = sanity.fetch(SHOW_DETAILS, { show: metadata.show })
    queuedRequests.SEAT_DETAILS = sanity.fetch(SEAT_DETAILS, { seats: seatIds })

    bookingData = {
      name,
      email,
      show: metadata.show,
      seatIds,
      discount,
      campaigns,
      stripeId: id,
    }
  } else {
    const { name, email, show, seatIds, discount, campaigns } = JSON.parse(body)

    queuedRequests.CUSTOMER_ID = getCustomerId(name, email)
    queuedRequests.SHOW_DETAILS = sanity.fetch(SHOW_DETAILS, { show })
    queuedRequests.SEAT_DETAILS = sanity.fetch(SEAT_DETAILS, { seats: seatIds })

    // Validate that booking doesn't require payment
    if (!(await validateFreeCheckout(queuedRequests, show, discount.code, fetch))) {
      throw error(500, 'Payment is required for this checkout')
    }

    bookingData = {
      name,
      email,
      show,
      seatIds,
      discount,
      campaigns,
    }
  }

  log.setHeader(`New booking: ${bookingData.name} <${bookingData.email}>`)
  log.info(
    [
      `Retrieved booking details from ${event?.type ? 'Stripe' : 'front-end'}:`,
      `name: ${bookingData.name}`,
      `email: ${bookingData.email}`,
      `show: ${bookingData.show}`,
      `seats: ${bookingData.seatIds.join(', ')}`,
      `discount: ${bookingData.discount?.code ?? '-'}`,
      `campaign: ${bookingData.campaigns}`,
      ...(bookingData.stripeId ? [`stripeId: ${bookingData.stripeId}`] : []),
    ].join('\n'),
  )

  try {
    await finalisePurchase(bookingData, queuedRequests)
  } catch (e) {
    console.error(e)
    log.error(e)
    await log.flushAll()
    throw error(500)
  }

  await log.flush()
  return new Response()
}

interface BookingData {
  name: string
  email: string
  show: string
  seatIds: string[]
  discount?: Discount
  campaigns?: string[]
  stripeId?: string
}

async function idExists(id: string) {
  return sanity.fetch(TRANSACTION_ID_EXISTS, { id })
}

async function validateFreeCheckout(
  queuedRequests: QueuedRequests,
  showId: string,
  discountCode: string,
  svelteFetch: typeof fetch,
) {
  try {
    const [config, seats, discount] = await Promise.all([
      queuedRequests.CONFIG,
      queuedRequests.SEAT_DETAILS,
      await svelteFetch(`/api/config/discount/${showId}/${discountCode}`).then((response) =>
        response.json(),
      ),
    ])

    if (!seats || !config) {
      return false
    }

    return (
      calculateTotal(seats, showId, config?.priceTiers, config?.priceConfiguration, discount) === 0
    )
  } catch (e) {
    console.error(e)
    return false
  }
}

async function finalisePurchase(bookingData: BookingData, queuedRequests: QueuedRequests) {
  const { name, email, show, seatIds, discount, campaigns, stripeId } = bookingData

  const bookingId = crypto.randomUUID()
  log.debug('Created booking ID', bookingId)
  const orderConfirmation = generateOrderConfirmationId()
  log.debug('Created order confirmation', orderConfirmation)

  const [tickets, config, emailText, customerId, showDetails, seats] = await Promise.all([
    await createTicketsForBooking(sanity, {
      bookingId,
      showId: show,
      seats: seatIds,
    }),
    queuedRequests.CONFIG,
    queuedRequests.EMAIL_TEXT,
    queuedRequests.CUSTOMER_ID,
    queuedRequests.SHOW_DETAILS,
    queuedRequests.SEAT_DETAILS,
  ])

  if (!tickets || !config || !emailText || !customerId || !showDetails || !seats) {
    throw error(500, 'Missing data required for checkout completion')
  }

  log.info('Sending ticket email')
  await sendEmail({
    orderConfirmation,
    tickets,
    bookingDetails: {
      name,
      email,
      show,
      date: showDetails.date,
      discount,
    },
    config,
    seats,
    emailText,
  })

  // Create booking.
  log.info('Creating booking document on Sanity.io')
  await sanity.create({
    _id: bookingId,
    _type: 'booking',
    customer: createReference(customerId),
    show: createReference(show),
    seats: seatIds.map((id) => ({ ...createReference(id), _key: generateArrayKey() })),
    discount: discount?._id && createReference(discount?._id),
    tickets: tickets.map(({ _id }) => ({ ...createReference(_id), _key: generateArrayKey() })),
    orderConfirmation,
    transactionId: stripeId,
    source: 'website',
    campaigns,
    readOnly: true,
    valid: true,
  })

  log.success('Booking created')

  if (discount?.singleUse) {
    log.info(`Invalidating single-use code ${discount.code}`)
    sanity
      .patch(discount._id)
      .set({
        [`singleUseCodes[_key == "${discount.code}"]`]: {
          _key: discount.code,
          code: discount.code,
          used: true,
        },
      })
      .commit()
  }

  sanity
    .patch(customerId)
    .setIfMissing({ bookings: [] })
    .insert('after', 'bookings[-1]', [createReference(bookingId)])
    .commit({
      autoGenerateArrayKeys: true,
    })

  tickets.map(({ _id }) =>
    sanity
      .patch(_id)
      .set({ booking: createReference(bookingId) })
      .commit(),
  )

  log.info('Initiated booking reference updates')
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
