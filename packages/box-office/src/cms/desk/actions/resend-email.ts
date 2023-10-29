import type { BookingDocument } from '$shared/types'

import { EnvelopeIcon } from '@sanity/icons'
import { useToast } from '@sanity/ui'
import { DocumentActionDescription, DocumentActionProps } from 'sanity'

const EMAIL_API_URL = import.meta.env.PROD
  ? '/.netlify/functions/resend-email'
  : 'http://localhost:5173/api/booking/email'

export function ResendEmail({
  published,
  onComplete,
}: DocumentActionProps): DocumentActionDescription {
  const toast = useToast()

  return {
    disabled: !published || !published.valid,
    label: 'Resend ticket email',
    icon: EnvelopeIcon,
    onHandle: async () => {
      const { _id } = published as BookingDocument

      const response = await fetch(EMAIL_API_URL, {
        method: 'POST',
        body: JSON.stringify({ bookingId: _id }),
      })

      toast.push({
        title: response.ok ? 'Email sent (again)' : 'Something has gone terribly wrong',
        status: response.ok ? 'success' : 'error',
      })

      onComplete()
    },
  }
}
