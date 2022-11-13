import { WebImageSchema as webImage } from '@james-camilleri/sanity-web-image'

import priceTier from './collections/price-tiers'
import seat from './collections/seats'
import show from './collections/shows'
import ticket from './collections/tickets'

export const schemaTypes = [priceTier, seat, show, ticket, webImage]
