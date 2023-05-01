import type { PriceConfiguration, PriceMap, PriceTier } from '../types/configuration.js'
import { DISCOUNT_TYPE, type Discount, type Seat } from '../types/bookings.js'

const BOOKING_FEE = 0.045
const MAX_BOOKING_FEE = 5

export function getSeatPriceTier(
  seat: Seat,
  show: string,
  priceTiers: PriceTier[],
  priceConfiguration: PriceConfiguration,
) {
  const tierRef = getSeatPriceTierId(seat, getPriceMapFromConfig(priceConfiguration, show))
  return priceTiers.find(({ _id }) => _id === tierRef)
}

export function getSeatPrice(
  seat: Seat,
  show: string,
  priceTiers: PriceTier[],
  priceConfiguration: PriceConfiguration,
) {
  const priceTier = getSeatPriceTier(seat, show, priceTiers, priceConfiguration)
  return priceTier?.price
}

export function getLineItem(
  seat: Seat,
  show: string,
  priceTiers: PriceTier[],
  priceConfiguration: PriceConfiguration,
) {
  return {
    description: seat._id,
    price: getSeatPrice(seat, show, priceTiers, priceConfiguration),
  }
}

export function getTotals(prices: number[], discount?: Discount, calculateBookingFee = true) {
  const subtotal = prices.reduce((total, price) => total + price, 0)
  const bookingFee = calculateBookingFee
    ? prices.reduce(
        (bookingFee, price) => bookingFee + Math.min(price * BOOKING_FEE, MAX_BOOKING_FEE),
        0,
      )
    : undefined

  let total = subtotal
  let reduction = 0

  if (discount && discount.type === DISCOUNT_TYPE.PERCENTAGE && discount.percentage) {
    total = total * ((100 - discount.percentage) / 100)
    reduction = subtotal - total
  }

  if (
    bookingFee &&
    // Only add booking fee if tickets aren't complimentary.
    reduction !== subtotal
  ) {
    total += bookingFee
  }

  const vat = total * 0.05 // 5% VAT.
  const profit = subtotal - reduction - vat

  return {
    subtotal,
    bookingFee,
    reduction,
    total,
    vat,
    profit,
  }
}

function getPriceMapFromConfig(priceConfiguration: PriceConfiguration, showId: string): PriceMap {
  return new Map(
    Object.entries({
      ...priceConfiguration.default,
      ...priceConfiguration[showId],
    }),
  )
}

function getSeatPriceTierId(seat: Seat, priceMap: PriceMap) {
  const { _id, row, section } = seat

  return priceMap.get(_id) ?? priceMap.get(row) ?? priceMap.get(section) ?? priceMap.get('default')
}
