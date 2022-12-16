import { PublishIcon, SpinnerIcon } from '@sanity/icons'
import { useEffect, useState } from 'react'
import {
  DocumentActionDescription,
  DocumentActionProps,
  SanityDocument,
  useDocumentOperation,
  useValidationStatus,
} from 'sanity'

export function CreateBooking({
  id,
  type,
  draft,
  onComplete,
}: DocumentActionProps): DocumentActionDescription {
  const { patch, publish } = useDocumentOperation(id, type)
  const { validation } = useValidationStatus(id, type)
  const [isPublishing, setIsPublishing] = useState(false)

  useEffect(() => {
    // if the isPublishing state was set to true and the draft has changed
    // to become `null` the document has been published
    if (isPublishing && !draft) {
      setIsPublishing(false)
    }
  }, [isPublishing, draft])

  return {
    disabled: validation.length ? true : !!publish.disabled,
    label: isPublishing ? 'Creating new booking…' : 'Create booking',
    icon: isPublishing ? SpinnerIcon : PublishIcon,
    shortcut: 'ctrl+alt+p',
    onHandle: async () => {
      setIsPublishing(true)

      // TODO: Fill out this functionality.
      // const ticketIds = await createTickets()
      // await emailTickets(ticketIds)

      // Create composite pricing configuration.
      // @ts-expect-error (I think the types aren't quite right here.)

      patch.execute([
        {
          set: {
            tickets: ticketIds.map((id) => ({
              _type: 'reference',
              _ref: id,
            })),
          },
        },
      ])

      publish.execute()
      onComplete()
    },
  }
}
