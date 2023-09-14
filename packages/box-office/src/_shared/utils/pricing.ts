import type { PriceConfiguration, PriceMap, PriceTier } from '../types/configuration.js'
import {
  DISCOUNT_TYPE,
  type Booking,
  type Discount,
  type Seat,
  type BookingWithPrices,
  type SeatWithPrice,
} from '../types/bookings.js'

const STRIPE_FIXED_FEE = 0.25
const STRIPE_PERCENTAGE_FEE = 0.015
const INTERNAL_PERCENTAGE_FEE = 0.03
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

function calculateApplicationFee(ticketPrice: number) {
  return Math.min(ticketPrice * INTERNAL_PERCENTAGE_FEE, MAX_BOOKING_FEE)
}

function calculateTotalBookingFee(total: number, internalBookingFee: number) {
  const amountToCharge = total + internalBookingFee
  return (amountToCharge + STRIPE_FIXED_FEE) / (1 - STRIPE_PERCENTAGE_FEE) - total
}

export function getTotals(prices: number[], discount?: Discount, shouldCalculateBookingFee = true) {
  const subtotal = prices.reduce((total, price) => total + price, 0)
  const applicationFee = shouldCalculateBookingFee
    ? prices.reduce((bookingFee, price) => bookingFee + calculateApplicationFee(price), 0)
    : undefined

  let total = subtotal
  let reduction = 0

  if (discount && discount.value) {
    reduction =
      discount.type === DISCOUNT_TYPE.PERCENTAGE ? total * (discount.value / 100) : discount.value
    total = Math.max(0, total - reduction)
  }

  const bookingFee =
    // Don't charge a booking fee for free checkouts.
    applicationFee && total !== 0 ? calculateTotalBookingFee(total, applicationFee) : undefined

  const vat = (total / 1.05 - total) * -1 // 5% VAT.

  if (bookingFee) {
    total += bookingFee
  }

  const profit = subtotal - reduction - vat

  return {
    subtotal,
    applicationFee,
    bookingFee,
    reduction,
    total,
    vat,
    profit,
  }
}

export function calculateTotal(
  seats: Seat[],
  show: string,
  priceTiers: PriceTier[],
  priceConfiguration: PriceConfiguration,
  discount?: Discount,
) {
  const prices = seats.map((seat) => getSeatPrice(seat, show, priceTiers, priceConfiguration) ?? 0)
  return getTotals(prices, discount).total
}

function getPriceMapFromConfig(priceConfiguration: PriceConfiguration, showId: string): PriceMap {
  return new Map(
    Object.entries({
      ...priceConfiguration.default,
      ...priceConfiguration[showId],
    }),
  )
}

export function addBookingPrices(
  bookings: Booking[],
  priceConfiguration: PriceConfiguration,
  priceTiers: PriceTier[] | undefined,
): BookingWithPrices[] {
  if (!bookings || !priceConfiguration || !priceTiers) {
    return bookings
  }

  return bookings.map((booking) => {
    const { seats } = booking

    if (!seats) {
      return booking
    }

    const seatsWithPrices: SeatWithPrice[] = seats.map((seat) => ({
      ...seat,
      priceTier: getSeatPriceTier(seat, booking.show._id, priceTiers, priceConfiguration),
    }))

    const { subtotal, reduction, bookingFee, vat, total, profit } = getTotals(
      seatsWithPrices.map(({ priceTier }) => priceTier?.price ?? 0),
      booking.discount,
      booking.source === 'website',
    )

    return {
      ...booking,
      seats: seatsWithPrices,
      subtotal,
      reduction,
      vat,
      bookingFee,
      total,
      profit,
    }
  })
}

function getSeatPriceTierId(seat: Seat, priceMap: PriceMap) {
  const { _id, row, section } = seat

  return priceMap.get(_id) ?? priceMap.get(row) ?? priceMap.get(section) ?? priceMap.get('default')
}
