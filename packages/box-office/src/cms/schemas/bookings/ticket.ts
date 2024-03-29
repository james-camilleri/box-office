import { AccessDeniedIcon, CheckmarkCircleIcon } from '@sanity/icons'
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
      readOnly: true,
    }),
    defineField({
      name: 'show',
      type: 'reference',
      to: [{ type: 'show' }],
      validation: (Rule) => Rule.required(),
      readOnly: true,
    }),
    defineField({
      name: 'seat',
      type: 'reference',
      to: [{ type: 'seat' }],
      validation: (Rule) => Rule.required(),
      readOnly: true,
    }),
    defineField({
      name: 'qrCode',
      title: 'QR code',
      type: 'image',
      readOnly: true,
    }),
    defineField({
      name: 'valid',
      type: 'boolean',
      initialValue: false,
      readOnly: true,
    }),
    defineField({
      name: 'scannedAt',
      type: 'datetime',
      // readOnly: true,
    }),
    defineField({
      name: 'scannedBy',
      type: 'string',
      // readOnly: true,
    }),
  ],
  preview: {
    select: {
      id: '_id',
      show: 'show.date',
      seat: 'seat._ref',
      valid: 'valid',
    },
    prepare({ id, show, seat, valid }) {
      const date = new Date(show)

      return {
        title: id,
        subtitle: `${date.toLocaleDateString()} ${date
          .toLocaleTimeString()
          .replace(/:00$/, '')}, ${seat}`,
        media: valid ? CheckmarkCircleIcon : AccessDeniedIcon,
      }
    },
  },
})
