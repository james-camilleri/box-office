import { PublishIcon } from '@sanity/icons'
import { useEffect, useState } from 'react'
import {
  DocumentActionDescription,
  DocumentActionProps,
  useClient,
  useDocumentOperation,
  useValidationStatus,
} from 'sanity'
import { API_VERSION } from 'shared/constants'
import type { Ticket } from 'shared/types'
import { createReference, createTicketsForBooking, generateOrderConfirmationId } from 'shared/utils'

const EMAIL_API_URL = import.meta.env.PROD
  ? 'https://tickets.arthaus.mt/api/tickets/email'
  : 'http://localhost:5173/api/tickets/email'

async function emailTickets(
  bookingId: string | undefined,
  orderConfirmation: string,
  tickets: Ticket[],
) {
  if (!bookingId) {
    console.error('No booking ID for email')
    return
  }

  await fetch(EMAIL_API_URL, {
    method: 'POST',
    body: JSON.stringify({
      bookingId,
      orderConfirmation,
      tickets,
    }),
  })
}

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
        .then(() => onComplete())
        .catch(console.error)
    }
  }, [isPublishing, draft])

  return {
    disabled: validation.length ? true : !!publish.disabled,
    label: isPublishing ? 'Creating new booking…' : 'Create booking',
    icon: PublishIcon,
    shortcut: 'ctrl+alt+p',
    onHandle: async () => {
      setIsPublishing(true)

      const orderConfirmation = generateOrderConfirmationId()

      const bookingDetails = {
        bookingId: id,
        showId: draft.show._ref,
        seats: draft.seats.map((seat) => seat._ref),
      }

      const tickets = await createTicketsForBooking(client, bookingDetails)
      setTicketIds(tickets.map((ticket) => ticket._id))
      await emailTickets(draft?._id, orderConfirmation, tickets)

      // @ts-expect-error (I think the types aren't quite right here.)
      patch.execute([
        {
          set: {
            tickets: tickets.map((ticket) => ({
              _type: 'reference',
              _ref: ticket._id,
              _key: ticket._id,
            })),
            orderConfirmation,
          },
        },
      ])

      publish.execute()
    },
  }
}
