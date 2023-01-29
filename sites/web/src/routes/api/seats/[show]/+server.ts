import { json } from '@sveltejs/kit'
import { BOOKED_SEATS, RESERVED_SEATS } from 'shared/queries'

import { sanity } from '../../sanity.js'
import type { RequestHandler } from './$types.js'

export const GET: RequestHandler = async ({ params }) => {
  const bookedSeats = (await sanity.noCdn.fetch(BOOKED_SEATS, { show: params.show })) ?? []
  const reservedSeats = JSON.parse(await sanity.fetch(RESERVED_SEATS))
  const reservedAllShows = reservedSeats['default'] ?? []
  const reservedThisShow = reservedSeats[params.show] ?? []

  return json({ unavailable: [...bookedSeats, ...reservedAllShows, ...reservedThisShow] })
}
