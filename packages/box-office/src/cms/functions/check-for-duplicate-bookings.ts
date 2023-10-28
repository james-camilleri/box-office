import { Handler } from '@netlify/functions'
import { createClient } from '@sanity/client'
import nodemailer from 'nodemailer'

import { BOOKED_SEATS, CONFIG } from '$shared/queries'
import { ReportConfiguration, Show } from '$shared/types'
import { formatShowDateTime, log } from '$shared/utils'

const {
  EMAIL,
  MAILJET_API_KEY,
  MAILJET_SECRET_KEY,
  ORGANISATION_NAME,
  REPORT_EMAILS,
  SANITY_STUDIO_API_KEY,
  SANITY_STUDIO_API_VERSION,
  SANITY_STUDIO_DATASET,
  SANITY_STUDIO_PROJECT_ID,
} = process.env

const client = createClient({
  projectId: SANITY_STUDIO_PROJECT_ID,
  apiVersion: SANITY_STUDIO_API_VERSION,
  dataset: SANITY_STUDIO_DATASET,
  token: SANITY_STUDIO_API_KEY,
  useCdn: false,
})

async function getDuplicateBookings(shows: Show[]) {
  const bookedSeats = (await Promise.all(
    shows.map((show) => client.fetch(BOOKED_SEATS, { show: show._id })),
  )) as string[][]
  const bookedSeatsSorted = bookedSeats.map((seats) => seats.sort())

  const duplicates = shows.reduce(
    (duplicates, show) => {
      duplicates.set(show, new Set<string>())
      return duplicates
    },
    new Map<{ _id: string; date: string }, Set<string>>() as Map<
      { _id: string; date: string },
      Set<string>
    >,
  )

  let lastSeat: string | undefined = undefined
  shows.forEach((show, i) => {
    for (const seat of bookedSeatsSorted[i]) {
      if (seat === lastSeat) {
        duplicates.get(show)?.add(seat)
      }

      lastSeat = seat
    }
  })

  return duplicates
}

async function createReport() {
  log.info('Checking for duplicate bookings')

  const config: ReportConfiguration = await client.fetch(CONFIG)
  const duplicates = await getDuplicateBookings(
    config.shows.sort((showA, showB) => showA.date.localeCompare(showB.date)),
  )
  const noOfDuplicates = [...duplicates.values()].reduce(
    (noOfDuplicates, duplicates) => noOfDuplicates + duplicates.size,
    0,
  )

  if (noOfDuplicates === 0) {
    return
  }

  const text = `Duplicate bookings:\n\n${Array.from(duplicates).map(
    ([show, duplicates]) =>
      `${formatShowDateTime(show.date, config.timeZone)}: ${Array.from(duplicates).join(', ')}\n`,
  )}`

  log.error(text)

  const transport = nodemailer.createTransport({
    name: EMAIL,
    host: 'in-v3.mailjet.com',
    port: 465,
    auth: {
      user: MAILJET_API_KEY,
      pass: MAILJET_SECRET_KEY,
    },
  })

  const emails = REPORT_EMAILS?.split(',') ?? []
  log.info('Emailing to:', emails.join(', '))
  await Promise.all(
    emails.map((email) =>
      transport.sendMail({
        from: `${ORGANISATION_NAME} <${EMAIL}>`,
        replyTo: EMAIL,
        to: email,
        subject: '⚠ DUPLICATE BOOKINGS ⚠',
        text,
      }),
    ),
  )
}

export const checkForDuplicateBookings: Handler = async function (event, context) {
  console.log('Checking for duplicate seat bookings.')

  try {
    await createReport()
  } catch (e) {
    console.error(e)

    return {
      statusCode: 500,
    }
  }

  return {
    statusCode: 200,
  }
}
