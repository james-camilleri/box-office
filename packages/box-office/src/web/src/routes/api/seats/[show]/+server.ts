import type { RequestHandler } from './$types.js'

import crypto from 'crypto'

import { json } from '@sveltejs/kit'

import { RESERVATION_SECRET } from '$env/static/private'
import { ALL_LOCKED_SEATS, BOOKED_SEATS, RESERVED_SEATS } from '$shared/queries'

import { sanity } from '../../sanity.js'

export const GET: RequestHandler = async ({ params, url }) => {
  const [bookedSeats, reservedSeats, lockedSeats] = await Promise.all([
    ((await sanity.noCdn.fetch(BOOKED_SEATS, { show: params.show })) ?? []) as string[],
    JSON.parse(await sanity.fetch(RESERVED_SEATS)),
    (await sanity.noCdn.fetch(ALL_LOCKED_SEATS, { show: params.show })) as string[],
  ])

  const reservedAllShows = reservedSeats['default'] ?? ([] as string[])
  const reservedThisShow = reservedSeats[params.show] ?? ([] as string[])

  const unavailable = new Set([
    ...bookedSeats,
    ...reservedAllShows,
    ...reservedThisShow,
    ...lockedSeats,
  ])

  // Make the seats passed in the URL available if the hash is
  // correct and they are not currently locked or already booked.
  const seats = url.searchParams.get('seats')
  const clientHash = url.searchParams.get('hash')
  if (seats && clientHash) {
    const hash = crypto.createHash('sha512')
    hash.update([params.show, seats, RESERVATION_SECRET].join(':'))
    const serverHash = hash.digest('base64')

    if (clientHash === serverHash) {
      seats.split(',').forEach((seat) => {
        if (!bookedSeats.includes(seat) && !lockedSeats.includes(seat)) {
          unavailable.delete(seat)
        }
      })
    }
  }

  return json({
    unavailable: Array.from(unavailable),
  })
}
