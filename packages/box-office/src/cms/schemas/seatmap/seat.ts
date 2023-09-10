import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'seat',
  type: 'document',
  title: 'Seat',
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'row',
      type: 'reference',
      to: [{ type: 'row' }],
      readOnly: true,
    }),
    defineField({
      name: 'number',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'locks',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'lock',
          fields: [
            { name: 'show', type: 'string' },
            { name: 'lockTime', type: 'datetime' },
          ],
        },
      ],
      readOnly: true,
    }),
  ],
})
