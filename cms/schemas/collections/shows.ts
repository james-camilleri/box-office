import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'show',
  type: 'document',
  title: 'Shows',
  fields: [
    defineField({
      name: 'fieldName',
      title: 'Field Title',
      type: 'string',
    }),
  ],
})
