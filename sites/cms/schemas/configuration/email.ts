import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'pageEmail',
  type: 'document',
  title: 'Email',
  fields: [
    defineField({
      name: 'emailText',
      type: 'array',
      of: [{ type: 'block' }],
      validation: (Rule) => Rule.required(),
    }),
  ],
})
