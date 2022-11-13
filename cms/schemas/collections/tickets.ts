import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'ticket',
  type: 'document',
  title: 'Tickets',
  fields: [
    defineField({
      name: 'fieldName',
      title: 'Field Title',
      type: 'string',
    }),
  ],
})
