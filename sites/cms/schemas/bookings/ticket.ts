import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'ticket',
  type: 'document',
  title: 'Tickets',
  fields: [
    defineField({
      name: 'booking',
      type: 'reference',
      to: [{ type: 'booking' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'show',
      type: 'reference',
      to: [{ type: 'show' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'seat',
      type: 'reference',
      to: [{ type: 'seat' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'valid',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'scanned',
      type: 'boolean',
      initialValue: false,
    }),

    // defineField({
    //   name: 'qrData',
    //   title: 'QR code data',
    //   type: 'string',
    // }),
  ],
})
