import type { SanityClient } from '@sanity/client'
import { customAlphabet } from 'nanoid'
import qrCode from 'qrcode'

import type { TicketDocument } from '../types/bookings.js'
import { isBrowser } from './browser.js'
import { log } from './log.js'
import { createReference } from './sanity.js'

interface BookingData {
  bookingId: string
  showId: string
  seats: string[]
}

const TICKET_ALPHABET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const nanoIdTicket = customAlphabet(TICKET_ALPHABET, 8)
const ORDER_CONFIRMATION_ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyz'
const nanoIdOrderConfirmation = customAlphabet(ORDER_CONFIRMATION_ALPHABET, 10)

function ticketId() {
  const chars = nanoIdTicket().split('')
  return [
    chars.splice(0, 2).join(''),
    chars.splice(0, 2).join(''),
    chars.splice(0, 4).join(''),
  ].join('-')
}

export async function createTicketsForBooking(
  client: SanityClient,
  booking: BookingData,
): Promise<TicketDocument[]> {
  log.info(['Creating tickets for seats:', ...booking.seats].join('\n'))

  return Promise.all(
    booking.seats.map(async (seat) => {
      const _id = ticketId()

      let file: Blob | Buffer
      if (isBrowser) {
        const qrCodeUrl = await qrCode.toDataURL(_id, { width: 1024 })
        file = await fetch(qrCodeUrl).then((res) => res.blob())
      } else {
        file = await qrCode.toBuffer(_id, { width: 1024 })
      }

      const qrCodeAsset = await client.assets.upload('image', file, {
        filename: `${_id}.png`,
        contentType: 'image/png',
      })

      const response = await client.create({
        _id,
        _type: 'ticket',
        show: createReference(booking.showId),
        seat: createReference(seat),
        qrCode: {
          _type: 'image',
          asset: createReference(qrCodeAsset._id),
        },
        valid: true,
      })

      log.info(`Posted ticket ${_id} to Sanity.io`)
      return response
    }),
  )
}

export function generateOrderConfirmationId() {
  const chars = nanoIdOrderConfirmation().split('')
  return [chars.splice(0, 5).join(''), chars.splice(0, 5).join('')].join('-')
}
