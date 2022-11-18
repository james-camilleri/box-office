import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'pageConfigure',
  type: 'document',
  title: 'Configure',
  fields: [
    defineField({
      name: 'shows',
      description: 'The dates and times of every show.',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'show' }] }],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'priceTiers',
      description:
        'The different pricing levels that can be assigned to tickets. Shows must have at least one pricing tier.',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'priceTier' }] }],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'defaultPrice',
      description:
        'The pricing tier that will be assigned to seats, unless overridden by the pricing configuration below.',
      type: 'reference',
      to: [{ type: 'priceTier' }],
      options: {
        disableNew: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'priceConfiguration',
      description:
        'Additional pricing configuration. Price tiers can be applied to whole sections, rows, or individual seats, and different configurations can be created for different shows. When multiple pricing configurations can apply to the same seat, configurations override according to their specificity, with row configurations overriding section configurations, and configurations for individual seats overriding row and section configurations. Show-specific pricing will override pricing for all shows. If multiple pricing configurations have the same specificity, the last item (according to the order below) will be applied.',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'priceTier',
              type: 'reference',
              to: [{ type: 'priceTier' }],
              options: {
                disableNew: true,
              },
            },
            {
              name: 'applyTo',
              type: 'array',
              of: [{ type: 'string' }],
              options: {
                initialValue: ['section', 'row', 'seat'],
              },
              validation: (Rule) => Rule.required(),
            },
            defineField({
              name: 'section',
              type: 'array',
              of: [{ type: 'reference', to: [{ type: 'section' }] }],
              validation: (Rule) => Rule.required(),
            }),
          ],
        },
      ],
    }),
  ],
})