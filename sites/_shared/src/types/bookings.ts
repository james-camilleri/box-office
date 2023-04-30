import type { Image, Reference, SanityDocument } from '@sanity/types'
import type { Show } from './configuration.js'

export interface Seat {
  _id: string
  row: string
  section: string
}

export interface TicketDocument extends SanityDocument {
  show: Reference
  seat: Reference
  qrCode: Image
  valid: boolean
  scannedAt?: string
}

export interface BookingDocument extends SanityDocument {
  customer: Reference
  show: Reference
  seats: Reference[]
  discount: Reference
  tickets: Reference[]
  orderConfirmation: string
  transactionId: string
  source: string
}

export enum DISCOUNT_TYPE {
  PERCENTAGE = 'percentage',
}

export interface Discount {
  _id: string
  name: string
  type: DISCOUNT_TYPE
  percentage?: number
  code: string
}

export interface BookingDetails {
  name: string
  email: string
  show: string
  date: string
  discount: Discount
}

export interface Booking {
  _id: string
  _createdAt: string
  orderConfirmation: string
  name: string
  email: string
  show: Show
  seats: Seat[]
  tickets: string[]
  source: string
  discount?: Discount
  campaign?: string
}
