import type { SanityClient } from '@sanity/client'
import { customAlphabet } from 'nanoid'
import qrCode from 'qrcode'

import type { Ticket } from '../types/bookings.js'
import { createReference } from './sanity.js'

interface BookingData {
  bookingId: string
  showId: string
  seats: string[]
}

const ALPHABET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const nanoId = customAlphabet(ALPHABET, 8)

function id() {
  const chars = nanoId().split('')
  return [
    chars.splice(0, 2).join(''),
    chars.splice(0, 2).join(''),
    chars.splice(0, 4).join(''),
  ].join('-')
}

export async function createTicketsForBooking(
  client: SanityClient,
  booking: BookingData,
): Promise<Ticket[]> {
  return Promise.all(
    booking.seats.map(async (seat) => {
      const _id = id()

      const qrCodeUrl = await qrCode.toDataURL(_id, { width: 1024 })
      const qrBlob = await fetch(qrCodeUrl).then((res) => res.blob())
      const qrCodeAsset = await client.assets.upload('image', qrBlob, {
        filename: `${_id}.png`,
        contentType: 'image/png',
      })

      return client.create({
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
    }),
  )
}
