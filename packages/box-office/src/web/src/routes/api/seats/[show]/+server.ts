import { json } from '@sveltejs/kit'
import { ALL_LOCKED_SEATS, BOOKED_SEATS, RESERVED_SEATS } from '$shared/queries'

import { sanity } from '../../sanity.js'
import type { RequestHandler } from './$types.js'

export const GET: RequestHandler = async ({ params }) => {
  const [bookedSeats, reservedSeats, lockedSeats] = await Promise.all([
    (await sanity.noCdn.fetch(BOOKED_SEATS, { show: params.show })) ?? [],
    JSON.parse(await sanity.fetch(RESERVED_SEATS)),
    await sanity.noCdn.fetch(ALL_LOCKED_SEATS, { show: params.show }),
  ])

  const reservedAllShows = reservedSeats['default'] ?? []
  const reservedThisShow = reservedSeats[params.show] ?? []

  return json({
    unavailable: [...bookedSeats, ...reservedAllShows, ...reservedThisShow, ...lockedSeats],
  })
}
