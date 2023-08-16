import { defineField, defineType } from 'sanity'

import { DISCOUNT_TYPE } from '$shared/types'

import { SingleUseDiscountCodesInput } from '../../inputs/SingleUseDiscountCodesInput/index.jsx'

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
    defineField({
      name: 'applyToAllShows',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'showsToApplyTo',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'show' }] }],
      options: {
        disableNew: true,
      },
      hidden: ({ parent }) => parent?.applyToAllShows,
    }),
    defineField({
      name: 'singleUse',
      description:
        'Creates a group of single-use discounts. This is especially important for fixed-value discounts, as these can be easily abused with multiple reuses. When a discount code is marked as single use, the primary code defined above cannot be used, and single-use codes need to be generated from the field below.',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'singleUseCodes',
      description:
        'Single-use discount codes. These are based on the primary discount code set above.',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'code',
              type: 'string',
              readOnly: true,
            },
            {
              name: 'used',
              type: 'boolean',
              readOnly: true,
              initialValue: false,
            },
          ],
        },
      ],
      components: {
        input: SingleUseDiscountCodesInput,
      },
      hidden: ({ document }) => !document?.singleUse,
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
