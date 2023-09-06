import { ValidationContext, defineField, defineType } from 'sanity'

import { API_VERSION } from '$shared/constants'
import { CUSTOMER_EXISTS } from '$shared/queries'

export default defineType({
  name: 'customer',
  type: 'document',
  title: 'Customer',
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'email',
      type: 'string',
      validation: (Rule) =>
        Rule.required()
          .email()
          .custom(async (email, context: ValidationContext) => {
            if (!email) {
              return true
            }

            // Don't show the error on published documents.
            if (!context.document?._id.includes('drafts')) {
              return true
            }

            const client = context.getClient({ apiVersion: API_VERSION })
            const customerExists = await client.fetch(CUSTOMER_EXISTS, { email })

            return !customerExists || 'A customer with this email address already exists'
          }),
    }),
    defineField({
      name: 'phone',
      description: 'Phone number',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'bookings',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'booking' }] }],
      readOnly: true,
    }),
  ],
})
