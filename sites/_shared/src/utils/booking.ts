import type { SanityClient } from '@sanity/client'

import { customAlphabet } from 'nanoid'
import qrCode from 'qrcode/build/qrcode.js'

import type { PriceConfiguration, PriceTier } from '../types/configuration.js'
import { createReference } from './sanity.js'

import { DISCOUNT_TYPE, type Discount, type Ticket } from '../types/bookings.js'

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

export function getSeatPriceTier(
  seat: string,
  show: string,
  priceTiers: PriceTier[],
  priceConfiguration: PriceConfiguration,
) {
  const tierRef =
    priceConfiguration?.[show]?.[seat] ??
    priceConfiguration?.['default']?.[seat] ??
    priceConfiguration?.['default']?.['default']
  return priceTiers.find(({ _id }) => _id === tierRef)
}

export function getSeatPrice(
  seat: string,
  show: string,
  priceTiers: PriceTier[],
  priceConfiguration: PriceConfiguration,
) {
  const priceTier = getSeatPriceTier(seat, show, priceTiers, priceConfiguration)
  return priceTier?.price
}

export function getLineItem(
  seat: string,
  show: string,
  priceTiers: PriceTier[],
  priceConfiguration: PriceConfiguration,
) {
  return {
    description: seat,
    price: getSeatPrice(seat, show, priceTiers, priceConfiguration),
  }
}

export function getTotals(prices: number[], discount?: Discount) {
  const subtotal = prices.reduce((total, price) => total + price, 0)
  let total = subtotal
  let reduction = 0

  if (discount && discount.type === DISCOUNT_TYPE.PERCENTAGE && discount.percentage) {
    total = total * ((100 - discount.percentage) / 100)
    reduction = subtotal - total
  }

  return {
    subtotal,
    reduction,
    total,
  }
}
