import { defineField, defineType } from 'sanity'
import { DISCOUNT_TYPE } from 'shared/types'

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
        list: [
          { title: 'Percentage discount on total order', value: DISCOUNT_TYPE.PERCENTAGE },
          { title: 'Fixed value off total order', value: DISCOUNT_TYPE.FIXED_AMOUNT },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'value',
      type: 'number',
      validation: (Rule) =>
        Rule.required().custom((value, context) => {
          const type = context.document?.type
          if (value == null) {
            return true
          }

          return type === DISCOUNT_TYPE.PERCENTAGE
            ? value >= 0 && value <= 100
              ? true
              : 'Percentage must be between 0-100'
            : value > 0
            ? true
            : 'Value must be greater than 0'
        }),
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
      value: 'value',
    },
    prepare({
      name,
      enabled,
      type,
      value,
    }: {
      name: string
      enabled: boolean
      type: string
      value: number
    }) {
      const subtitle =
        !type || value == null
          ? ''
          : type === DISCOUNT_TYPE.PERCENTAGE
          ? `${value}% off`
          : `€${value} off`

      return {
        title: `${name} ${enabled ? '🟢' : '⚫'}`,
        subtitle,
      }
    },
  },
})
