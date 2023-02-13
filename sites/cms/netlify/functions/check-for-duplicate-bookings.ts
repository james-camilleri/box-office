import { Handler, schedule } from '@netlify/functions'
import sanityClient from '@sanity/client'
import nodemailer from 'nodemailer'
import { log } from 'shared/utils'

const { SANITY_API_KEY, MAILJET_API_KEY, MAILJET_SECRET_KEY, REPORT_EMAILS } = process.env
const client = sanityClient({
  projectId: '8biawkr2',
  apiVersion: '2022-11-01',
  dataset: 'production',
  token: SANITY_API_KEY,
  useCdn: false,
})

const SHOWS_QUERY = `*[_type == "show"]{ _id, date }`
const BOOKED_SEATS_QUERY = `*[_type == "booking" && show._ref == $show].seats[]._ref`

async function getDuplicateBookings() {
  const shows = (await client.fetch(SHOWS_QUERY)) as { _id: string; date: string }[]
  const bookedSeats = (await Promise.all(
    shows.map((show) => client.fetch(BOOKED_SEATS_QUERY, { show: show._id })),
  )) as string[][]
  const bookedSeatsSorted = bookedSeats.map((seats) => seats.sort())

  const duplicates = shows.reduce(
    (duplicates, show) => ({
      ...duplicates,
      [show._id]: new Set<string>(),
    }),
    {} as Record<string, Set<string>>,
  )

  let lastSeat: string | undefined = undefined
  shows.forEach((show, i) => {
    for (const seat of bookedSeatsSorted[i]) {
      if (seat === lastSeat) {
        duplicates[show._id].add(seat)
      }

      lastSeat = seat
    }
  })

  return duplicates
}

async function createReport() {
  log.info('Checking for duplicate bookings')

  const duplicates = await getDuplicateBookings()
  const noOfDuplicates = Object.values(duplicates).reduce(
    (noOfDuplicates, duplicates) => noOfDuplicates + duplicates.size,
    0,
  )

  if (noOfDuplicates === 0) {
    return
  }

  const text = `Duplicate bookings:\n\n${Object.entries(duplicates).map(
    ([show, duplicates]) => `${show}: ${Array.from(duplicates).join(', ')}\n`,
  )}`

  log.error(text)

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
  log.info('Emailing to:', emails.join(', '))
  await Promise.all(
    emails.map((email) =>
      transport.sendMail({
        from: 'Arthaus <tickets@arthaus.mt>',
        replyTo: 'tickets@arthaus.mt',
        to: email,
        subject: '⚠ DUPLICATE BOOKINGS ⚠',
        text,
      }),
    ),
  )
}

const scheduledFunction: Handler = async function (event, context) {
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

export const handler = schedule('0 0 * * *', scheduledFunction)
