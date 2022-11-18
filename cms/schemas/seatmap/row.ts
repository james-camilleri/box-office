import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'row',
  type: 'document',
  title: 'Row',
  fields: [
    defineField({
      name: 'section',
      type: 'reference',
      to: [{ type: 'section' }],
    }),
    defineField({
      name: 'seats',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'seat' }] }],
    }),
  ],
})
