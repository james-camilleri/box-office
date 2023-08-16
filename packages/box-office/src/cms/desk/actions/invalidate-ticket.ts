import { CloseIcon } from '@sanity/icons'
import { useEffect, useState } from 'react'
import { DocumentActionDescription, DocumentActionProps, useDocumentOperation } from 'sanity'

export function InvalidateTicket({
  id,
  type,
  published,
  onComplete,
}: DocumentActionProps): DocumentActionDescription {
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
    label: isInvalidating ? 'Invalidating…' : 'Invalidate ticket',
    icon: CloseIcon,
    tone: 'critical',

    onHandle: () => {
      setIsInvalidating(true)

      patch.execute([{ set: { valid: false } }])

      publish.execute()
      onComplete()
    },
  }
}
