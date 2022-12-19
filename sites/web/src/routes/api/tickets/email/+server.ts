import type { RequestHandler } from '@sveltejs/kit'
import CONFIG from '$lib/config.js'
import juice from 'juice'
import nodemailer from 'nodemailer'
import type { Booking, ConfigurationFull, Ticket } from 'shared/types'

import Email from './template/Email.svelte'

// import { sanity } from '../../sanity.js'

interface BookingPayload {
  booking: Booking
  tickets: Ticket[]
}

export const POST: RequestHandler = async ({ request, fetch }) => {
  const { booking, tickets } = (await request.json()) as BookingPayload
  const config = (await (await fetch('/api/config')).json()) as ConfigurationFull
  console.log(config)

  const { showName, showLocation, mapUrl } = config

  const { html: rawHtml, css } = Email.render({
    name: 'James Camilleri',
    event: {
      name: showName,
      date: '19th January, 1992',
      time: '07:00',
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
    // from: `${name} <${destination}>`,
    from: 'Arthaus <tickets@arthaus.mt>',
    replyTo: 'tickets@arthaus.mt',
    to: 'james@james.mt',
    subject,
    html,
  })

  return new Response()
}
