import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'ticket',
  type: 'document',
  title: 'Tickets',
  fields: [
    defineField({
      name: 'name',
      type: 'string',
    }),
    defineField({
      name: 'email',
      type: 'string',
    }),
    defineField({
      name: 'bookings',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'booking' }] }],
    }),
  ],
})
