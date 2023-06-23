import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'discount',
  type: 'document',
  title: 'Discount',
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'type',
      type: 'string',
      initialValue: 'percentage',
      options: {
        list: [{ title: 'Percentage discount on total order', value: 'percentage' }],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'percentage',
      type: 'number',
      validation: (Rule) => Rule.min(0).max(100),
      hidden: ({ document }) => !(document?.type === 'percentage'),
    }),
    defineField({
      name: 'code',
      description: 'The discount code that should be entered on checkout to activate the discount',
      type: 'slug',
    }),
    defineField({
      name: 'enabled',
      description: 'Whether this discount should be publicly enabled',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      name: 'name',
      enabled: 'enabled',
      type: 'type',
      percentage: 'percentage',
    },
    prepare({
      name,
      enabled,
      type,
      percentage,
    }: {
      name: string
      enabled: boolean
      type: string
      percentage: number
    }) {
      return {
        title: `${name} ${enabled ? '🟢' : '⚫'}`,
        subtitle: type === 'percentage' ? `${percentage}% off` : '',
      }
    },
  },
})
