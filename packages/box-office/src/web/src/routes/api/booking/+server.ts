import type Stripe from 'stripe'

import { error } from '@sveltejs/kit'

import { BOOKING, EMAIL_TEXT, SEAT_DETAILS, SHOW_DETAILS } from '$shared/queries'
import { BOOKING_STATUS, type Booking } from '$shared/types'
import {
  createReference,
  createTicketsForBooking,
  generateArrayKey,
  generateOrderConfirmationId,
} from '$shared/utils'
import { log } from '$shared/utils'

import { DataStore, REQUEST_KEY } from '../data-store.js'
import { sanity } from '../sanity.js'
import { getStripeEvent } from '../stripe.js'

import { sendEmail } from './email/email.js'
import {
  parseFreeCheckout,
  parseStripeChargeEvent,
  type BookingData,
  getCustomer,
} from './helpers.js'

export async function POST({ request, fetch }) {
  const body = await request.text()
  const event = await getStripeEvent(request.headers, body)

  const store = new DataStore()
  store.set(
    REQUEST_KEY.CONFIG,
    fetch('/api/config').then((response) => response.json()),
  )

  if (event?.type === 'invoice.paid') {
    const invoice = event.data.object as Stripe.Invoice
    const { created, metadata, number } = invoice

    const bookingId = metadata?.booking
    if (!bookingId || !number) {
      const message = `Missing data in invoice: ${bookingId ? 'invoice number' : 'booking id'}`
      log.error(message)
      await log.flush()
      throw error(400, message)
    }

    try {
      const time = new Date(created * 1000).toISOString()
      await finaliseBooking(bookingId, { number, time })
      await emailTickets(bookingId, { number, time }, store)
      await log.flush()

      return new Response()
    } catch (e) {
      log.error(e)
      await log.flushAll()
      throw error(500)
    }
  }

  const bookingData = await (event?.type
    ? parseStripeChargeEvent(event)
    : parseFreeCheckout(body, store, fetch))

  store.set(REQUEST_KEY.CUSTOMER, getCustomer((await bookingData).customer))
  store.set(REQUEST_KEY.SHOW_DETAILS, sanity.fetch(SHOW_DETAILS, { show: bookingData.show }))
  store.set(REQUEST_KEY.SEAT_DETAILS, sanity.fetch(SEAT_DETAILS, { seats: bookingData.seats }))

  log.setHeader(`New booking: ${bookingData.customer.name} <${bookingData.customer.email}>`)
  log.info(
    [
      `Retrieved booking details from ${event?.type ? 'Stripe' : 'front-end'}:`,
      `name: ${bookingData.customer.name}`,
      `email: ${bookingData.customer.email}`,
      `show: ${bookingData.show}`,
      `seats: ${bookingData.seats.join(', ')}`,
      `discount: ${bookingData.discount?.code ?? '-'}`,
      `campaign: ${bookingData.campaigns}`,
      ...(bookingData.stripeId ? [`stripeId: ${bookingData.stripeId}`] : []),
    ].join('\n'),
  )

  try {
    await createBooking(bookingData, store)
  } catch (e) {
    console.error(e)
    log.error(e)
    await log.flushAll()
    throw error(500)
  }

  await log.flush()
  return new Response()
}

async function createBooking(bookingData: BookingData, store: DataStore) {
  const { show, seats: seatIds, discount, campaigns, stripeId } = bookingData

  const bookingId = crypto.randomUUID()
  log.debug('Created booking ID', bookingId)
  const orderConfirmation = generateOrderConfirmationId()
  log.debug('Created order confirmation', orderConfirmation)

  const [tickets, config, customer, showDetails, seats] = await Promise.all([
    await createTicketsForBooking(sanity, {
      bookingId,
      showId: show,
      seats: seatIds,
    }),
    store.get(REQUEST_KEY.CONFIG),
    store.get(REQUEST_KEY.CUSTOMER),
    store.get(REQUEST_KEY.SHOW_DETAILS),
    store.get(REQUEST_KEY.SEAT_DETAILS),
  ])

  if (!tickets || !config || !customer || !showDetails || !seats) {
    throw error(500, 'Missing data required for checkout completion')
  }

  // Create booking.
  log.info('Creating booking document on Sanity.io')
  await sanity.create({
    _id: bookingId,
    _type: 'booking',
    customer: createReference(customer._id),
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
    status: BOOKING_STATUS.PENDING,
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
    .patch(customer._id)
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

async function finaliseBooking(
  bookingId: string,
  { number, time }: { number: string; time: string },
) {
  log.info(`Finalising booking ${bookingId}`)
  await sanity
    .patch(bookingId)
    .set({
      receiptNumber: number,
      receiptTime: time,
      status: BOOKING_STATUS.COMPLETE,
    })
    .commit()

  log.success(`Booking ${bookingId} finalised`)
}

async function emailTickets(
  bookingId: string,
  { number, time }: { number: string; time: string },
  store: DataStore,
) {
  const { customer, discount, orderConfirmation, seats, show, tickets } = (await sanity.fetch(
    BOOKING,
    { bookingId },
  )) as Booking

  store.set(REQUEST_KEY.EMAIL_TEXT, sanity.fetch(EMAIL_TEXT))
  store.set(REQUEST_KEY.SHOW_DETAILS, sanity.fetch(SHOW_DETAILS, { show: show._id }))

  log.info('Sending ticket email')

  await sendEmail({
    orderConfirmation,
    receiptNumber: number,
    receiptTime: time,
    tickets,
    bookingDetails: {
      name: customer.name,
      email: customer.email,
      show: show._id,
      date: show.date,
      discount,
    },
    config: await store.get(REQUEST_KEY.CONFIG),
    seats,
    emailText: await store.get(REQUEST_KEY.EMAIL_TEXT),
  })

  log.success(`Ticket email sent to ${customer.name} <${customer.email}>`)
}
