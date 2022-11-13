import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'seat',
  type: 'document',
  title: 'Seats',
  fields: [
    defineField({
      name: 'fieldName',
      title: 'Field Title',
      type: 'string',
    }),
  ],
})
