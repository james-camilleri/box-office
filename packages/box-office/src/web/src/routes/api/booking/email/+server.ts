import type { Booking, ConfigurationFull } from '$shared/types'
import type { PortableTextBlock } from 'sanity'

import { BOOKING, EMAIL_TEXT } from '$shared/queries'

import { sanity } from '../../sanity.js'

import { sendEmail } from './email.js'

interface BookingPayload {
  bookingId: string
}

export async function POST({ request, fetch }) {
  try {
    const { bookingId } = (await request.json()) as BookingPayload

    const [config, booking, emailText] = await Promise.all([
      fetch('/api/config').then((payload) => payload.json()) as Promise<ConfigurationFull>,
      sanity.fetch(BOOKING, { bookingId }) as Promise<Booking>,
      sanity.fetch(EMAIL_TEXT) as Promise<PortableTextBlock[]>,
    ])

    await sendEmail({
      bookingDetails: {
        name: booking.customer.name,
        email: booking.customer.email,
        show: booking.show._id,
        date: booking.show.date,
        discount: booking.discount,
      },
      config,
      seats: booking.seats,
      emailText,
      orderConfirmation: booking.orderConfirmation,
      receiptNumber: booking.receiptNumber,
      receiptTime: booking.receiptTime,
      tickets: booking.tickets,
      calculateBookingFee: booking.source === 'website',
    })
  } catch (e) {
    console.error(e)
    return new Response(e as string, {
      status: 500,
    })
  }

  return new Response()
}
