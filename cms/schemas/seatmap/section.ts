import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'section',
  type: 'document',
  title: 'Section',
  fields: [
    defineField({
      name: 'description',
      type: 'string',
    }),
    defineField({
      name: 'rows',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'row' }] }],
    }),
  ],
})
