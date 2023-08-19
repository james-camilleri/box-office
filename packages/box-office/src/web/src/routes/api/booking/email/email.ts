import CONFIG from '$lib/config.js'
import juice from 'juice'
import nodemailer from 'nodemailer'
import { parseFullName } from 'parse-full-name'
import type { ConfigurationFull, Discount, Seat, TicketDocument } from '$shared/types'

import Email from './template/Email.svelte'

interface SendEmailParams {
  orderConfirmation: string
  tickets: TicketDocument[]
  bookingDetails: {
    name: string
    email: string
    show: string
    date: string
    discount?: Discount
  }
  config: ConfigurationFull
  seats: Seat[]
  emailText: unknown
  calculateBookingFee: boolean
}

export async function sendEmail({
  bookingDetails,
  config,
  seats,
  emailText,
  tickets,
  orderConfirmation,
  calculateBookingFee = true,
}: SendEmailParams) {
  const { name, email, date, show, discount } = bookingDetails
  const {
    showName,
    showLocation,
    vatNumber,
    vatPermitNumber,
    timeZone,
    mapUrl,
    priceTiers,
    priceConfiguration,
  } = config

  const { first, middle, nick } = parseFullName(name)
  const firstName =
    middle && nick
      ? `${first} ${middle} ${nick}`
      : middle
      ? `${first} ${middle}`
      : nick
      ? `${first} ${nick}`
      : first ?? ''

  const { host, port } = CONFIG.EMAIL
  const { MAILJET_API_KEY, MAILJET_SECRET_KEY } = process.env

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

  await transport.sendMail(
    generateEmail(
      name,
      email,
      `Your tickets for ${showName}`,
      generateEmailHtml(
        Email.render({
          name: firstName,
          event: {
            name: showName,
            date,
            timeZone,
            location: showLocation,
            map: mapUrl,
            vatNumber,
            vatPermitNumber,
          },
          show,
          tickets,
          orderConfirmation,
          seats,
          priceTiers,
          priceConfiguration,
          discount,
          emailText,
          calculateBookingFee,
        }),
      ),
    ),
  )
}

function generateEmail(name: string, email: string, subject: string, html: string) {
  return {
    from: 'Arthaus <tickets@arthaus.mt>',
    replyTo: 'tickets@arthaus.mt',
    to: `${name} <${email}>`,
    subject,
    html,
  }
}

function generateEmailHtml({ html, css }: { html: string; css: { code: string } }) {
  return juice(`<style>${css.code}</style>${html}`)
}
