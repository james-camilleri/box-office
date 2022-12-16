import { PublishIcon, SpinnerIcon } from '@sanity/icons'
import { useEffect, useState } from 'react'
import {
  DocumentActionDescription,
  DocumentActionProps,
  SanityDocument,
  useClient,
  useDocumentOperation,
  useValidationStatus,
} from 'sanity'
import { API_VERSION } from 'shared/constants'
import { createReference, createTicketsForBooking } from 'shared/utils'

export function CreateBooking({
  id,
  type,
  draft,
  published,
  onComplete,
}: DocumentActionProps): DocumentActionDescription {
  const client = useClient({ apiVersion: API_VERSION })
  const { patch, publish } = useDocumentOperation(id, type)
  const { validation } = useValidationStatus(id, type)
  const [isPublishing, setIsPublishing] = useState(false)
  const [ticketIds, setTicketIds] = useState([])

  useEffect(() => {
    // if the isPublishing state was set to true and the draft has changed
    // to become `null` the document has been published
    if (isPublishing && !draft && published) {
      // Update newly-created tickets to point to published booking.
      async function linkToBooking() {
        const patches = ticketIds.map((ticketId) =>
          client
            .patch(ticketId)
            .set({ booking: createReference(id) })
            .commit(),
        )

        patches.push(
          client
            .patch(published?.customer._ref)
            .setIfMissing({ bookings: [] })
            .insert('after', 'bookings[-1]', [createReference(id)])
            .commit({ autoGenerateArrayKeys: true }),
        )

        return Promise.all(patches)
      }

      linkToBooking()
        .then(() => setIsPublishing(false))
        .catch(console.error)
    }
  }, [isPublishing, draft, ticketIds, client, id, published])

  return {
    disabled: validation.length ? true : !!publish.disabled,
    label: isPublishing ? 'Creating new booking…' : 'Create booking',
    icon: PublishIcon,
    shortcut: 'ctrl+alt+p',
    onHandle: async () => {
      setIsPublishing(true)

      const bookingDetails = {
        bookingId: id,
        showId: draft.show._ref,
        seats: draft.seats.map((seat) => seat._ref),
      }

      // TODO: Fill out this functionality.
      const tickets = await createTicketsForBooking(client, bookingDetails)
      setTicketIds(tickets.map((ticket) => ticket._id))
      // await emailTickets(ticketIds)

      // Create composite pricing configuration.
      // @ts-expect-error (I think the types aren't quite right here.)

      patch.execute([
        {
          set: {
            tickets: tickets.map((ticket) => ({
              _type: 'reference',
              _ref: ticket._id,
              _key: ticket._id,
            })),
          },
        },
      ])

      publish.execute()
      // onComplete()
    },
  }
}
