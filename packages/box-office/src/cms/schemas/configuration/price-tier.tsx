import { defineField, defineType } from 'sanity'
import ColourListInput from '../../inputs/ColourListInput/index.js'

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
      description: 'A colour to show on the seating plan',
      type: 'string',
      components: {
        input: (props) => (
          <ColourListInput
            {...props}
            unique
            colours={['#D22B33', '#FF9D00', '#BDDE16', '#75DFFF', '#6626FA', '#EC108D']}
          />
        ),
      },
    }),
    defineField({
      name: 'price',
      type: 'number',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      name: 'name',
      price: 'price',
    },
    prepare({ name, price }) {
      return {
        title: `${name} (€${price})`,
      }
    },
  },
})
