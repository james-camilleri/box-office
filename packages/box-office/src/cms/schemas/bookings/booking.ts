import { AccessDeniedIcon, CheckmarkCircleIcon, CircleIcon } from '@sanity/icons'
import { Reference, defineField, defineType } from 'sanity'

import { BOOKED_AND_LOCKED_SEATS } from '$shared/queries'
import { BOOKING_STATUS } from '$shared/types'

export default defineType({
  name: 'booking',
  type: 'document',
  title: 'Booking',
  fields: [
    defineField({
      name: 'customer',
      type: 'reference',
      to: [{ type: 'customer' }],
      validation: (Rule) => Rule.required(),
      readOnly: ({ document }) => !!document?.readOnly,
    }),
    defineField({
      name: 'show',
      type: 'reference',
      to: [{ type: 'show' }],
      options: {
        disableNew: true,
      },
      validation: (Rule) => Rule.required(),
      readOnly: ({ document }) => !!document?.readOnly,
    }),
    defineField({
      name: 'seats',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'seat' }],
          options: {
            filter: ({ document }) => {
              if (!document.show) {
                return
              }

              return {
                filter: `!(_id in ${BOOKED_AND_LOCKED_SEATS})`,
                params: {
                  show: (document.show as Reference)._ref,
                },
              }
            },
          },
        },
      ],
      validation: (Rule) => Rule.required().unique(),
      hidden: ({ document }) => !document?.show,
      readOnly: ({ document }) => !!document?.readOnly,
    }),
    defineField({
      name: 'discount',
      type: 'reference',
      to: [{ type: 'discount' }],
      options: {
        disableNew: true,
      },
      readOnly: ({ document }) => !!document?.readOnly,
    }),
    defineField({
      name: 'tickets',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'ticket' }] }],
      readOnly: true,
    }),
    defineField({
      name: 'orderConfirmation',
      description: 'A unique order reference',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'transactionId',
      description: 'The Stripe transaction ID, for cross-referencing',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'receiptNumber',
      description: 'The Stripe invoice number, for cross-referencing',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'source',
      description: 'Where the booking was made from (mostly used for filtering)',
      type: 'string',
      options: {
        list: ['box-office', 'website'],
      },
      readOnly: ({ document }) => !!document?.readOnly,
    }),
    defineField({
      name: 'campaigns',
      type: 'array',
      of: [{ type: 'string' }],
      readOnly: true,
    }),
    defineField({
      name: 'valid',
      type: 'boolean',
      initialValue: false,
      readOnly: true,
    }),
    defineField({
      name: 'status',
      type: 'string',
      initialValue: BOOKING_STATUS.PENDING,
      options: {
        list: Object.values(BOOKING_STATUS) as string[],
      },
      readOnly: true,
    }),
    defineField({
      name: 'readOnly',
      type: 'boolean',
      hidden: true,
    }),
  ],
  preview: {
    select: {
      name: 'customer.name',
      show: 'show.date',
      seats: 'seats',
      status: 'status',
      valid: 'valid',
    },
    prepare({ name, show, seats, status, valid }) {
      const date = new Date(show)

      return {
        title: name,
        subtitle: `${date.toLocaleDateString()} ${date.toLocaleTimeString().replace(/:00$/, '')} x${
          seats?.length ?? ''
        }`,
        media:
          status === BOOKING_STATUS.PENDING
            ? CircleIcon
            : valid
            ? CheckmarkCircleIcon
            : AccessDeniedIcon,
      }
    },
  },
})
