import { Reference } from 'sanity'

export interface Configuration {
  shows: Reference[]
  priceTiers: Reference[]
  defaultPrice: Reference
  priceConfiguration: Array<{
    priceTier: Reference
    applyTo: Reference[]
    applyToAllShows: boolean
    shows: Reference[]
  }>
  compositePriceCOnfiguration: string
}
