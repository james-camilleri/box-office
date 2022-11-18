import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'priceTier',
  type: 'document',
  title: 'Price Tiers',
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      type: 'string',
    }),
    defineField({
      name: 'colour',
      description:
        'This is currently just a CSS colour string unfortunately, but will eventually be upgraded to a smarter selector.',
      type: 'string',
    }),
    defineField({
      name: 'price',
      type: 'number',
      validation: (Rule) => Rule.required(),
    }),
  ],
})
