import { BOOKING_DETAILS, EMAIL_TEXT, SEAT_DETAILS } from 'shared/queries'
import type { BookingDetails, ConfigurationFull, Seat, Ticket } from 'shared/types'

import { getCrossOriginHeader } from '../../cors.js'
import { sanity } from '../../sanity.js'
import type { RequestHandler } from './$types.js'
import { sendEmail } from './email.js'

interface BookingPayload {
  bookingId: string
  orderConfirmation: string
  tickets: Ticket[]
  calculateBookingFee: boolean
}

export const POST: RequestHandler = async (event) => {
  const { request } = event

  try {
    const { bookingId, orderConfirmation, tickets, calculateBookingFee } =
      (await request.json()) as BookingPayload
    const seatIds = tickets.map(({ seat }) => seat._ref)

    const [config, bookingDetails, seats, emailText] = await Promise.all([
      // TODO: FIGURE OUT WHY THE HELL RELATIVE FETCH IS FAILING ON THE SERVER
      (await (await fetch(event.url.origin + '/api/config')).json()) as Promise<ConfigurationFull>,
      // (await (await fetch('/api/config')).json()) as Promise<ConfigurationFull>,
      (await sanity.fetch(BOOKING_DETAILS, { bookingId })) as BookingDetails,
      (await sanity.fetch(SEAT_DETAILS, { seats: seatIds })) as Seat[],
      await sanity.fetch(EMAIL_TEXT),
    ])

    await sendEmail({
      bookingDetails,
      config,
      seats,
      emailText,
      orderConfirmation,
      tickets,
      calculateBookingFee,
    })
  } catch (e) {
    console.error(e)
    return new Response(e as string, {
      status: 500,
      headers: getCrossOriginHeader(request.headers),
    })
  }

  return new Response(null, {
    headers: getCrossOriginHeader(request.headers),
  })
}
