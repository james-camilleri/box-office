import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'pageWebsite',
  description: 'Text to show on the main ticket booking page',
  type: 'document',
  title: 'Website',
  fieldsets: [{ name: 'branding' }, { name: 'content' }],
  fields: [
    defineField({
      name: 'logo',
      description: 'This is displayed on the booking page header',
      type: 'image',
      fieldset: 'branding',
    }),
    defineField({
      name: 'primaryColour',
      description: 'Used for the primary call to action buttons',
      type: 'color',
      fieldset: 'branding',
    }),
    defineField({
      name: 'secondaryColour',
      description:
        'Used for the booking page header and other smaller interactive elements or highlights',
      type: 'color',
      fieldset: 'branding',
    }),
    defineField({
      name: 'text',
      type: 'array',
      of: [{ type: 'block' }],
      validation: (Rule) => Rule.required(),
      fieldset: 'content',
    }),
  ],
})
