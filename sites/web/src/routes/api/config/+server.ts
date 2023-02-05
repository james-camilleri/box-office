import { json } from '@sveltejs/kit'
import { CONFIG_QUERY } from 'shared/queries'

import { sanity } from '../sanity.js'

/** @type {import('./$types').RequestHandler} */
export async function GET() {
  const configuration = await sanity.fetch(CONFIG_QUERY)

  return json({
    ...configuration,
    priceConfiguration: JSON.parse(configuration.priceConfiguration),
  })
}
