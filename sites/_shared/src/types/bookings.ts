import type { Image, Reference, SanityDocument } from 'sanity'

export interface Ticket extends SanityDocument {
  show: Reference
  seat: Reference
  qrCode: Image
  valid: boolean
  scannedAt?: string
}

export interface TicketFull extends SanityDocument {
  show: {
    date: string
  }
  seat: {
    section: string
    row: string
    seat: string
  }
  qrCode: Image
  valid: boolean
  scannedAt?: string
}

export interface Booking extends SanityDocument {}

export interface BookingDetails {
  name: string
  email: string
  date: string
}