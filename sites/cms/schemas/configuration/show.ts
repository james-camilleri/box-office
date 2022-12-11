import { defineField, defineType } from 'sanity'

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
      title: 'date',
    },
    prepare({ title }) {
      const date = new Date(title)
      return {
        title: `${date.toLocaleDateString()} ${date
          .toLocaleTimeString()
          .split(':')
          .slice(0, 2)
          .join(':')}`,
      }
    },
  },
})
