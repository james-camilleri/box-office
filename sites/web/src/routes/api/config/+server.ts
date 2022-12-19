import { sanity } from '../sanity.js'

const PAGE_ID = 'configure'
const CONFIG_QUERY = `*[_id == '${PAGE_ID}']{
  showName,
  showLocation,
  mapUrl,
  shows[] -> { _id, date },
  priceTiers[] -> { _id, name, colour, price },
  'defaultPrice': defaultPrice->._id,
  'priceConfiguration': compositePriceConfiguration,
}`

/** @type {import('./$types').RequestHandler} */
export async function GET() {
  const configuration = (await sanity.fetch(CONFIG_QUERY))[0]

  return new Response(
    JSON.stringify({
      showName: configuration.showName,
      showLocation: configuration.showLocation,
      mapUrl: configuration.mapUrl,
      shows: configuration.shows,
      priceTiers: configuration.priceTiers,
      defaultPriceTier: configuration.defaultPrice,
      priceConfiguration: JSON.parse(configuration.priceConfiguration),
    }),
  )
}
