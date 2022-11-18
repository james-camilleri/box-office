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
    }),
    defineField({
      name: 'show',
      type: 'reference',
      to: [{ type: 'show' }],
    }),
    defineField({
      name: 'seat',
      type: 'reference',
      to: [{ type: 'seat' }],
    }),
    defineField({
      name: 'qrData',
      title: 'QR code data',
      type: 'string',
    }),
  ],
})
