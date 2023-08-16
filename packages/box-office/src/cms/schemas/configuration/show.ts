import { defineField, defineType } from 'sanity'

import { formatShowDateTime } from '$shared/utils'

export default defineType({
  name: 'show',
  type: 'document',
  title: 'Shows',
  fields: [
    defineField({
      name: 'date',
      description:
        "The show date and time IN YOUR CURRENT TIME ZONE. In most cases, you don't need to worry about this, but if you're configuring a show from somewhere that isn't on the show location's same time zone, you'll need to calculate the difference and set the time as it would be in your current location. For example, if your show is at 20:00 CEST, but you are currently in London, you should set the time to 19:00.",
      type: 'datetime',
    }),
  ],
  preview: {
    select: {
      dateString: 'date',
      timeZone: 'timeZone',
    },
    prepare({ dateString, timeZone }) {
      return { title: formatShowDateTime(dateString, timeZone) }
    },
  },
})
