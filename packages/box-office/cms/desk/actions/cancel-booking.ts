import { CloseIcon } from '@sanity/icons'
import { useEffect, useState } from 'react'
import {
  DocumentActionDescription,
  DocumentActionProps,
  useClient,
  useDocumentOperation,
} from 'sanity'
import { API_VERSION } from 'shared/constants'
import { BookingDocument } from 'shared/types'

export function CancelBooking({
  id,
  type,
  published,
  onComplete,
}: DocumentActionProps): DocumentActionDescription {
  const client = useClient({ apiVersion: API_VERSION })
  const { patch, publish } = useDocumentOperation(id, type)
  const [isInvalidating, setIsInvalidating] = useState(false)

  useEffect(() => {
    // if the isPublishing state was set to true and the draft has changed
    // to become `null` the document has been published
    if (isInvalidating && published) {
      setIsInvalidating(false)
    }
  }, [isInvalidating, published])

  return {
    disabled: !published?.valid,
    label: isInvalidating ? 'Cancelling…' : 'Cancel booking',
    icon: CloseIcon,
    tone: 'critical',

    onHandle: async () => {
      setIsInvalidating(true)
      await Promise.all(
        (published as BookingDocument).tickets.map(({ _ref }) =>
          client.patch(_ref).set({ valid: false }).commit(),
        ),
      )

      patch.execute([{ set: { valid: false } }])

      publish.execute()
      onComplete()
    },
  }
}
