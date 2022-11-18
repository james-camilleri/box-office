import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'seat',
  type: 'document',
  title: 'Seat',
  fields: [
    // Will we ever need this?
    // defineField({
    //   name: 'section',
    //   type: 'reference',
    //   to: [{ type: 'section' }],
    // }),
    defineField({
      name: 'row',
      type: 'reference',
      to: [{ type: 'row' }],
    }),
    defineField({
      name: 'number',
      type: 'string',
    }),
  ],
})
