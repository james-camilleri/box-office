import { defineField, defineType } from 'sanity'
import { formatShowDateTime } from 'shared/utils'

export default defineType({
  name: 'show',
  type: 'document',
  title: 'Shows',
  fields: [
    defineField({
      name: 'date',
      type: 'datetime',
    }),
  ],
  preview: {
    select: {
      dateString: 'date',
    },
    prepare({ dateString }) {
      return { title: formatShowDateTime(dateString) }
    },
  },
})
