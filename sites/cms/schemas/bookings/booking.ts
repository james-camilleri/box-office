import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'booking',
  type: 'document',
  title: 'Booking',
  fields: [
    defineField({
      name: 'customer',
      type: 'reference',
      to: [{ type: 'customer' }],
    }),
    defineField({
      name: 'show',
      type: 'reference',
      to: [{ type: 'show' }],
    }),
    defineField({
      name: 'seats',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'seat' }] }],
    }),
    defineField({
      name: 'tickets',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'ticket' }] }],
    }),
    defineField({
      name: 'transactionId',
      description: 'The Stripe transaction ID, for cross-referencing.',
      type: 'string',
    }),
  ],
})
