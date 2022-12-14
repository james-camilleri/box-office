import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'customer',
  type: 'document',
  title: 'Customer',
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    // TODO: Add async validation to check that email is unique.
    defineField({
      name: 'email',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'bookings',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'booking' }] }],
      readOnly: true,
    }),
  ],
})
