import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'priceTier',
  type: 'document',
  title: 'Price Tiers',
  fields: [
    defineField({
      name: 'fieldName',
      title: 'Field Title',
      type: 'string',
    }),
  ],
})
