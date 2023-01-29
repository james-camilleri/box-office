import { json } from '@sveltejs/kit'

import { sanity } from '../sanity.js'

const PAGE_ID = 'configure'
const CONFIG_QUERY = `*[_id == '${PAGE_ID}']{
  showName,
  showLocation,
  vatNumber,
  vatPermitNumber,
  mapUrl,
  shows[] -> { _id, date },
  timeZone,
  priceTiers[] -> { _id, name, colour, price },
  'defaultPrice': defaultPrice->._id,
  'priceConfiguration': compositePriceConfiguration,
}[0]`

/** @type {import('./$types').RequestHandler} */
export async function GET() {
  const configuration = await sanity.fetch(CONFIG_QUERY)

  return json({
    ...configuration,
    priceConfiguration: JSON.parse(configuration.priceConfiguration),
  })
}
