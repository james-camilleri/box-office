import { Reference, defineField, defineType } from 'sanity'
import { BOOKED_SEATS } from 'shared/queries'

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
    }),
    defineField({
      name: 'show',
      type: 'reference',
      to: [{ type: 'show' }],
      options: {
        disableNew: true,
      },
      validation: (Rule) => Rule.required(),
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
                filter: `!(_id in ${BOOKED_SEATS})`,
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
    }),
    defineField({
      name: 'discount',
      type: 'reference',
      to: [{ type: 'discount' }],
      options: {
        disableNew: true,
      },
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
      name: 'source',
      description: 'Where the booking was made from (mostly used for filtering)',
      type: 'string',
      options: {
        list: ['pre-booking', 'box-office', 'website'],
      },
    }),
  ],
  preview: {
    select: {
      name: 'customer.name',
      show: 'show.date',
      seats: 'seats',
    },
    prepare({ name, show, seats }) {
      const date = new Date(show)

      return {
        title: name,
        subtitle: `${date.toLocaleDateString()} ${date.toLocaleTimeString().replace(/:00$/, '')} x${
          seats?.length ?? ''
        }`,
      }
    },
  },
})
