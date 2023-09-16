import type { Image, Reference, SanityDocument } from 'sanity'
import type { PriceTier, Show } from './configuration.js'
import type { Customer } from './customer.js'

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
  valid: boolean
}

export enum DISCOUNT_TYPE {
  PERCENTAGE = 'percentage',
  FIXED_AMOUNT = 'fixed-amount',
}

export interface Discount {
  _id: string
  name: string
  type: DISCOUNT_TYPE
  value?: number
  code: string
  singleUse: boolean
}

export interface Booking extends SanityDocument {
  show: Show
  seats: Seat[]
  discount?: Discount
  customer: Customer
  tickets: TicketDocument[]
  orderConfirmation: string
  transactionId: string
  receiptNumber: string
  receiptTime: string
  source: string
  campaigns?: string[]
}

export interface SeatWithPrice extends Seat {
  priceTier?: PriceTier
}
export interface BookingWithPrices extends Booking {
  seats: SeatWithPrice[]
  subtotal?: number
  reduction?: number
  vat?: number
  bookingFee?: number
  total?: number
  profit?: number
}

export enum BOOKING_STATUS {
  PENDING = 'pending',
  COMPLETE = 'complete',
}
