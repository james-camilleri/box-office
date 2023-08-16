import { defineField, defineType } from 'sanity'

import { formatShowDateTime, getAllTimeZones, getUserTimeZone } from '$shared/utils'

export default defineType({
  name: 'pageConfigure',
  type: 'document',
  title: 'Configure',
  fields: [
    defineField({
      name: 'showName',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'vatNumber',
      title: 'VAT Number',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'vatPermitNumber',
      title: 'VAT Permit Number',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'showLocation',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'mapUrl',
      type: 'url',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'shows',
      description: 'The dates and times of every show.',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'show' }] }],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'timeZone',
      description:
        'The time zone the show will be held in – important to get the dates and times to show correctly in emails and on the front-end.',
      type: 'string',
      initialValue: getUserTimeZone(),
      options: {
        list: getAllTimeZones()
          .sort((timeZoneA, timeZoneB) =>
            // Put local time zone first
            timeZoneA === getUserTimeZone() ? -1 : timeZoneB === getUserTimeZone() ? 1 : 0,
          )
          .map((timeZone) => ({ title: timeZone, value: timeZone })),
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'priceTiers',
      description:
        'The different pricing levels that can be assigned to tickets. Shows must have at least one pricing tier.',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'priceTier' }] }],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'defaultPrice',
      description:
        'The pricing tier that will be assigned to seats, unless overridden by the pricing configuration below.',
      type: 'reference',
      to: [{ type: 'priceTier' }],
      options: {
        disableNew: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'priceConfiguration',
      description:
        'Additional pricing configuration. Price tiers can be applied to whole sections, rows, or individual seats, and different configurations can be created for different shows. When multiple pricing configurations can apply to the same seat, configurations override according to their specificity, with row configurations overriding section configurations, and configurations for individual seats overriding row and section configurations. Show-specific pricing will override pricing for all shows. If multiple pricing configurations have the same specificity, the last item (according to the order below) will be applied.',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'priceTier',
              type: 'reference',
              to: [{ type: 'priceTier' }],
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'applyTo',
              type: 'array',
              of: [
                { type: 'reference', to: [{ type: 'section' }, { type: 'row' }, { type: 'seat' }] },
              ],
              validation: (Rule) => Rule.required().min(1),
              options: {
                disableNew: true,
              },
            }),
            defineField({
              name: 'applyToAllShows',
              type: 'boolean',
              initialValue: true,
            }),
            defineField({
              name: 'shows',
              type: 'array',
              of: [{ type: 'reference', to: [{ type: 'show' }] }],
              options: {
                disableNew: true,
              },
              hidden: ({ parent }) => parent?.applyToAllShows,
            }),
          ],
          options: {
            collapsible: false,
          },
          preview: {
            select: {
              priceTier: 'priceTier.name',
              price: 'priceTier.price',
              applyTo0: 'applyTo.0.name',
              applyTo1: 'applyTo.1.name',
              applyTo2: 'applyTo.2.name',
              applyTo3: 'applyTo.3.name',
              applyTo4: 'applyTo.4.name',
            },
            prepare({ priceTier, price, applyTo0, applyTo1, applyTo2, applyTo3, applyTo4 }) {
              return {
                title: priceTier ? `${priceTier} (€${price})` : '⚠ Invalid configuration ⚠',
                subtitle:
                  [applyTo0, applyTo1, applyTo2, applyTo3].filter(Boolean).join(', ') +
                  (applyTo4 ? '...' : ''),
              }
            },
          },
        },
      ],
    }),
    defineField({
      name: 'reservedSeats',
      description:
        'Seats to reserve and hide from public view. These seats can only be booked from the back-end.',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'seats',
              type: 'array',
              of: [
                { type: 'reference', to: [{ type: 'section' }, { type: 'row' }, { type: 'seat' }] },
              ],
              validation: (Rule) => Rule.required().min(1),
              options: {
                disableNew: true,
              },
            }),
            defineField({
              name: 'applyToAllShows',
              type: 'boolean',
              initialValue: true,
            }),
            defineField({
              name: 'shows',
              type: 'array',
              of: [{ type: 'reference', to: [{ type: 'show' }] }],
              options: {
                disableNew: true,
              },
              hidden: ({ parent }) => parent?.applyToAllShows,
            }),
          ],
          options: {
            collapsible: false,
          },
          preview: {
            select: {
              seats0: 'seats.0.name',
              seats1: 'seats.1.name',
              seats2: 'seats.2.name',
              seats3: 'seats.3.name',
              seats4: 'seats.4.name',
              applyToAllShows: 'applyToAllShows',
              shows0: 'shows.0.date',
              shows1: 'shows.1.date',
              shows2: 'shows.2.date',
              shows3: 'shows.3.date',
              timeZone: 'timeZone',
            },
            prepare({
              seats0,
              seats1,
              seats2,
              seats3,
              seats4,
              applyToAllShows,
              shows0,
              shows1,
              shows2,
              shows3,
              timeZone,
            }) {
              return {
                title:
                  [seats0, seats1, seats2, seats3].filter(Boolean).join(', ') +
                  (seats4 ? '...' : ''),
                subtitle: applyToAllShows
                  ? 'All shows'
                  : [shows0, shows1, shows2]
                      .filter(Boolean)
                      .map((date) => formatShowDateTime(date, timeZone))
                      .join(', ') + (shows3 ? '...' : ''),
              }
            },
          },
        },
      ],
    }),
    defineField({
      name: 'compositePriceConfiguration',
      // Store this as a JSON string, since we can't do freeform objects.
      type: 'string',
      hidden: true,
    }),
    defineField({
      name: 'compositeReservedSeats',
      // Store this as a JSON string, since we can't do freeform objects.
      type: 'string',
      hidden: true,
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Configure',
      }
    },
  },
})
