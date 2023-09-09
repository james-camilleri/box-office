import { Image, PortableTextBlock, Reference } from 'sanity'

export interface Configuration {
  showName: string
  showLocation: string
  vatPermitNumber: string
  vatNumber: string
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
  reservedSeats: Array<{
    seats: Reference[]
    applyToAllShows: boolean
    shows: Reference[]
  }>
}

export interface ConfigurationFull {
  showName: string
  showLocation: string
  vatPermitNumber: string
  vatNumber: string
  mapUrl: string
  shows: Show[]
  timeZone: string
  priceTiers: PriceTier[]
  defaultPriceTier: string
  priceConfiguration: PriceConfiguration
}

export interface ReportConfiguration {
  showName: string
  showLocation: string
  vatPermitNumber: string
  vatNumber: string
  mapUrl: string
  shows: Show[]
  timeZone: string
  priceTiers: PriceTier[]
  defaultPriceTier: string
  priceConfiguration: string
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

export interface Colour {
  r: number
  g: number
  b: number
  a: number
}

export interface WebConfigurationRaw {
  logoSrc: string
  primaryColour: Colour
  secondaryColour: Colour
  text: PortableTextBlock
}

export interface WebConfiguration {
  logoSrc: string
  primaryColour: string
  secondaryColour: string
  text: PortableTextBlock[]
}
