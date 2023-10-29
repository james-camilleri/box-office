import type { BookingDocument } from '$shared/types'

import { EnvelopeIcon } from '@sanity/icons'
import { useToast } from '@sanity/ui'
import { DocumentActionDescription, DocumentActionProps, useClient } from 'sanity'
import { API_VERSION } from '$shared/constants'

const { FRONT_END_URL } = process.env
const INVOICE_WEBHOOK_URL = `https://tickets.arthaus.mt/api/invoice`

const bookingQuery = `*[_id == $id][0]{
  ...,
  'show': show->,
  'seats': seats[]->{
    _id,
    'row': row -> _id,
    'section': row -> section -> _id
  },
  'discount': discount->,
  'customer': customer->
}
`

export function CallInvoiceWebhook({
  published,
  onComplete,
}: DocumentActionProps): DocumentActionDescription {
  const toast = useToast()
  const client = useClient({ apiVersion: API_VERSION })

  return {
    disabled: !published || !published.valid,
    label: 'Call invoice webhook',
    icon: EnvelopeIcon,
    onHandle: async () => {
      const { _id } = published as BookingDocument
      const booking = await client.fetch(bookingQuery, { id: _id })

      const response = await fetch(INVOICE_WEBHOOK_URL, {
        method: 'POST',
        body: JSON.stringify(booking),
      })

      toast.push({
        title: response.ok ? 'Called invoice webhook' : 'Something has gone terribly wrong',
        status: response.ok ? 'success' : 'error',
      })

      onComplete()
    },
  }
}
