import { defineField, defineType } from 'sanity'

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
      of: [{ type: 'reference', to: [{ type: 'seat' }] }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tickets',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'ticket' }] }],
      readOnly: true,
    }),
    defineField({
      name: 'transactionId',
      description: 'The Stripe transaction ID, for cross-referencing.',
      type: 'string',
      readOnly: true,
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
          seats.length
        }`,
      }
    },
  },
})
