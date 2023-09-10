import type { SanityDocument } from 'sanity'

export interface Customer extends SanityDocument {
  name: string
  email: string
  phone: string
  stripeId: string
}
