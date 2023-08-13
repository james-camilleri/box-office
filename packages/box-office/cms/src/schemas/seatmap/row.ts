import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'row',
  type: 'document',
  title: 'Row',
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'section',
      type: 'reference',
      to: [{ type: 'section' }],
      readOnly: true,
    }),
    defineField({
      name: 'seats',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'seat' }] }],
      readOnly: true,
    }),
  ],
})
