import { error, type RequestHandler } from '@sveltejs/kit'
import CONFIG from '$lib/config.js'
import juice from 'juice'
import nodemailer from 'nodemailer'
import { BOOKING_DETAILS } from 'shared/queries'
import type { BookingDetails, ConfigurationFull, Ticket } from 'shared/types'

import { getCrossOriginHeader } from '../../cors.js'
import { sanity } from '../../sanity.js'
import Email from './template/Email.svelte'

interface BookingPayload {
  bookingId: string
  tickets: Ticket[]
}

export const POST: RequestHandler = async ({ request, fetch }) => {
  try {
    const { bookingId, tickets } = (await request.json()) as BookingPayload

    const [config, bookingDetails] = await Promise.all([
      fetch('/api/config').then((response) => response.json()) as Promise<ConfigurationFull>,
      ((await sanity.fetch(BOOKING_DETAILS, { bookingId })) as BookingDetails[])[0],
    ])

    const { showName, showLocation, mapUrl } = config

    // TODO: Time Zones. Again.
    const { html: rawHtml, css } = Email.render({
      name: bookingDetails.name,
      event: {
        name: showName,
        date: new Date(bookingDetails.date.split('T')[0]).toLocaleDateString(),
        time: bookingDetails.date.split('T')[1],
        location: showLocation,
        map: mapUrl,
      },
      tickets,
    })

    const html = juice(`<style>${css.code}</style>${rawHtml}`)

    const { host, port } = CONFIG.EMAIL
    const { MAILJET_API_KEY, MAILJET_SECRET_KEY } = process.env

    // if (!name || !email || !subject || !message) {
    //   throw new Error('Missing required fields')
    // }

    const subject = `Your tickets for ${showName}`

    const transport = nodemailer.createTransport({
      name: 'tickets@arthaus.mt',
      host,
      port,
      auth: {
        user: MAILJET_API_KEY,
        pass: MAILJET_SECRET_KEY,
      },
      pool: true,
      secure: true,
    })

    await transport.sendMail({
      from: 'Arthaus <tickets@arthaus.mt>',
      replyTo: 'tickets@arthaus.mt',
      to: `${bookingDetails.name} <${bookingDetails.email}>`,
      subject,
      html,
    })
  } catch (e) {
    throw error(500, e)
  }
  return new Response(null, {
    headers: getCrossOriginHeader(request.headers),
  })
}
