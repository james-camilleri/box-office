import type { BookingDocument } from '$shared/types'

import { EnvelopeIcon } from '@sanity/icons'
import { useToast } from '@sanity/ui'
import { DocumentActionDescription, DocumentActionProps, useClient } from 'sanity'

import { API_VERSION } from '$shared/constants'
import { TICKET_DETAILS } from '$shared/queries'

const EMAIL_API_URL = import.meta.env.PROD
  ? '/.netlify/functions/resend-email'
  : 'http://localhost:5173/api/booking/email'

export function ResendEmail({
  published,
  onComplete,
}: DocumentActionProps): DocumentActionDescription {
  const toast = useToast()
  const client = useClient({ apiVersion: API_VERSION })

  return {
    disabled: !published || !published.valid,
    label: 'Resend ticket email',
    icon: EnvelopeIcon,
    onHandle: async () => {
      const { _id, source, orderConfirmation, tickets: ticketRefs } = published as BookingDocument
      const tickets = await client.fetch(TICKET_DETAILS, {
        tickets: ticketRefs.map(({ _ref }) => _ref),
      })

      const response = await fetch(EMAIL_API_URL, {
        method: 'POST',
        body: JSON.stringify({
          calculateBookingFee: source == 'website',
          bookingId: _id,
          orderConfirmation,
          tickets,
        }),
      })

      toast.push({
        title: response.ok ? 'Email sent (again)' : 'Something has gone terribly wrong',
        status: response.ok ? 'success' : 'error',
      })

      onComplete()
    },
  }
}
