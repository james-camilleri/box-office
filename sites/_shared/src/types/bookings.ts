import type { Image, Reference, SanityDocument } from '@sanity/types'

export interface Seat {
  _id: string
  row: string
  section: string
}

export interface Ticket extends SanityDocument {
  show: Reference
  seat: Reference
  qrCode: Image
  valid: boolean
  scannedAt?: string
}

export interface Booking extends SanityDocument {}

export enum DISCOUNT_TYPE {
  PERCENTAGE = 'percentage',
}

export interface Discount {
  name: string
  type: DISCOUNT_TYPE
  percentage?: number
}

export interface BookingDetails {
  name: string
  email: string
  show: string
  date: string
  discount: Discount
}
