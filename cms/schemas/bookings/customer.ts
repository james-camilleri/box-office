import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'customer',
  type: 'document',
  title: 'Customer',
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
