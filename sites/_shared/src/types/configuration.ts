import type { Reference } from '@sanity/types'

export interface Configuration {
  showName: string
  showLocation: string
  mapUrl: string
  shows: Reference[]
  priceTiers: Reference[]
  defaultPrice: Reference
  priceConfiguration: Array<{
    priceTier: Reference
    applyTo: Reference[]
    applyToAllShows: boolean
    shows: Reference[]
  }>
  compositePriceConfiguration: string
}

export interface ConfigurationFull {
  showName: string
  showLocation: string
  vatPermitNumber: string
  mapUrl: string
  shows: Show[]
  priceTiers: PriceTier[]
  defaultPriceTier: string
  priceConfiguration: PriceConfiguration
}

export interface Show {
  _id: string
  date: string
}

export interface PriceTier {
  _id: string
  name: string
  description: string
  colour: string
  price: number
}

export interface PriceConfiguration {
  default: Record<string, string>
  [key: string]: Record<string, string>
}

export type PriceMap = Map<string, string>
