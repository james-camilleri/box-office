import { BOOKED_SEATS } from 'shared/queries'

import { sanity } from '../../sanity.js'
import type { RequestHandler } from './$types.js'

export const GET: RequestHandler = async ({ params }) => {
  const unavailable = (await sanity.noCdn.fetch(BOOKED_SEATS, { show: params.show })) ?? []

  return new Response(JSON.stringify({ unavailable }))
}
