import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'section',
  type: 'document',
  title: 'Section',
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'description',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'rows',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'row' }] }],
      readOnly: true,
    }),
  ],
})
