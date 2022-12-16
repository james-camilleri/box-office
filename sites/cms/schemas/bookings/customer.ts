import { ValidationContext, defineField, defineType } from 'sanity'
import { CUSTOMER_EXISTS } from 'shared/queries'

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
            const client = context.getClient({ apiVersion: '2023-01-01' })
            const customerExists = await client.fetch(CUSTOMER_EXISTS, { email })

            return !customerExists || 'A customer with this email address already exists'
          }),
    }),
    defineField({
      name: 'bookings',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'booking' }] }],
      readOnly: true,
    }),
  ],
})
