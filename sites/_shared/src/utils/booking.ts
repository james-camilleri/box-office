import { SanityClient } from '@sanity/client'
import { customAlphabet } from 'nanoid'
import qrCode from 'qrcode'

import { createReference } from './sanity'

interface BookingData {
  bookingId: string
  showId: string
  seats: string[]
}

const ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyz'
const nanoId = customAlphabet(ALPHABET, 8)

export async function createTicketsForBooking(client: SanityClient, booking: BookingData) {
  return Promise.all(
    booking.seats.map(async (seat) => {
      const _id = nanoId()

      const qrCodeUrl = await qrCode.toDataURL(_id, { width: 1024 })
      const qrBlob = await fetch(qrCodeUrl).then((res) => res.blob())
      const qrCodeAsset = await client.assets.upload('image', qrBlob, {
        filename: `${_id}.png`,
        contentType: 'image/png',
      })

      return client.create({
        _id,
        _type: 'ticket',
        // booking: createReference(`drafts.${booking.bookingId}`),
        show: createReference(booking.showId),
        seat: createReference(seat),
        qrCode: {
          _type: 'image',
          asset: createReference(qrCodeAsset._id),
        },
        valid: true,
        scanned: false,
      })
    }),
  )
}
