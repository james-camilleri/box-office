import { Handler, schedule } from '@netlify/functions'
import { createClient } from '@sanity/client'
import nodemailer from 'nodemailer'

import { DAILY_BOOKINGS, CONFIG } from '$shared/queries'
import { DISCOUNT_TYPE, Discount, ReportConfiguration, Seat, Show } from '$shared/types'
import { getSeatPrice, getTotals, getZonedDate, getZonedTime } from '$shared/utils'

const {
  MAILJET_API_KEY,
  MAILJET_SECRET_KEY,
  REPORT_EMAILS,
  SANITY_API_KEY,
  SANITY_API_VERSION,
  SANITY_DATASET,
  SANITY_PROJECT_ID,
} = process.env

const client = createClient({
  projectId: SANITY_PROJECT_ID,
  apiVersion: SANITY_API_VERSION,
  dataset: SANITY_DATASET,
  token: SANITY_API_KEY,
  useCdn: false,
})

interface BookingReportDetails {
  _id: string
  _createdAt: string
  orderConfirmation: string
  source: string
  name: string
  email: string
  show: Show
  seats: Seat[]
  tickets: string[]
  discount?: Discount
}

async function createReport() {
  const [config, bookings, timeZone] = await Promise.all([
    (await client.fetch(CONFIG)) as ReportConfiguration,
    (await client.fetch(DAILY_BOOKINGS)) as BookingReportDetails[],
    await client.fetch('*[_id == "configure"].timeZone'),
  ])

  const dailyTotal = {
    bookingFee: 0,
    total: 0,
    vat: 0,
  }

  let html = `<style>
    th, tr { text-align: left; }
  </style>`

  html += `<p>Bookings for ${new Date(
    new Date().getTime() - 1000 * 60,
  ).toLocaleDateString()}:</p>\n<br>\n`
  html += `<table>\n`
  html += bookings
    .map(
      ({
        _id,
        _createdAt,
        orderConfirmation,
        name,
        email,
        show,
        seats,
        tickets,
        discount,
        source,
      }) => {
        const priceConfiguration = JSON.parse(config.priceConfiguration)
        const seatPrices = seats
          .map((seat) => getSeatPrice(seat, show._id, config.priceTiers, priceConfiguration))
          .filter(Boolean) as number[]
        const { total, vat, bookingFee } = getTotals(seatPrices, discount, source === 'website')

        dailyTotal.total += total
        dailyTotal.vat += vat
        dailyTotal.bookingFee += bookingFee ?? 0

        const headerCell = `
        <tr style="padding-top: 7px;">
          <td colspan="2"><strong>${name} &lt;${email}&gt;</strong> [${orderConfirmation}]</td>
        </tr>\n`

        const cells = [
          ['Show', `${getZonedDate(show.date, timeZone)} ${getZonedTime(show.date, timeZone)}`],
          ['Seats', seats.map(({ _id }) => _id).join(', ')],
          ['Tickets', tickets.join(', ')],
        ]

        if (discount) {
          cells.push([
            'Discount',
            `${discount.name} ${
              discount.type === DISCOUNT_TYPE.PERCENTAGE
                ? `(${discount.value}%)`
                : `(€${discount.value})`
            }`,
          ])
        }

        cells.push(['Total', `€${total.toFixed(2)}`])

        return `${headerCell}${cells
          .map(
            ([label, data]: string[]) =>
              `<tr style="padding: 1px 0;"><th style="padding-right: 10px;">${label}</th><td>${data}</td></tr>\n`,
          )
          .join(
            '\n',
          )}<tr style="padding-bottom: 7px;"><td style="border-bottom: solid 1px #000"></td><td style="border-bottom: solid 1px #000"></td></tr>`
      },
    )
    .join('\n')

  html += `</table>`
  html += `
  <table>
      <tr><td colspan="2"><strong>TOTALS</string></td></tr>
      <tr><th style="padding-right: 10px;">Total</th><td>€${dailyTotal.total.toFixed(2)}</td></tr>
      <tr><th style="padding-right: 10px;">VAT</th><td>€${dailyTotal.vat.toFixed(2)}</td></tr>
      <tr><th style="padding-right: 10px;">Booking fee</th><td>€${dailyTotal.bookingFee.toFixed(
        2,
      )}</td></tr>
  </table>`

  const transport = nodemailer.createTransport({
    name: 'tickets@arthaus.mt',
    host: 'in-v3.mailjet.com',
    port: 465,
    auth: {
      user: MAILJET_API_KEY,
      pass: MAILJET_SECRET_KEY,
    },
  })

  const emails = REPORT_EMAILS?.split(',') ?? []
  console.log('Emailing to:', emails.join(', '))
  await Promise.all(
    emails.map((email) =>
      transport.sendMail({
        from: 'Arthaus <tickets@arthaus.mt>',
        replyTo: 'tickets@arthaus.mt',
        to: email,
        subject: 'Tickets sold today',
        html,
      }),
    ),
  )
}

export const generateDailyReport: Handler = async function (event, context) {
  console.log('Generating daily report.')

  try {
    await createReport()
  } catch (e) {
    console.error(e)

    return {
      statusCode: 500,
    }
  }

  console.log('Report generated and mailed.')

  return {
    statusCode: 200,
  }
}

export const handler = schedule('0 0 * * *', scheduledFunction)
