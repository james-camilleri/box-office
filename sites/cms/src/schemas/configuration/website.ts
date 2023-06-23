import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'pageWebsite',
  description: 'Text to show on the main ticket booking page',
  type: 'document',
  title: 'Website',
  fields: [
    defineField({
      name: 'text',
      type: 'array',
      of: [{ type: 'block' }],
      validation: (Rule) => Rule.required(),
    }),
  ],
})
