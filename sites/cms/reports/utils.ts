import { isWithinInterval } from 'date-fns'
import { Booking, PriceConfiguration, PriceTier, Seat } from 'shared/types'
import { getSeatPriceTier, getTotals } from 'shared/utils'

import { Filters } from './FilterBar.jsx'

export interface BookingWithPrices extends Booking {
  seats: SeatWithPrice[]
  subtotal?: number
  reduction?: number
  vat?: number
  bookingFee?: number
  total?: number
}

interface SeatWithPrice extends Seat {
  priceTier?: PriceTier
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

    const { subtotal, total, vat, bookingFee, reduction } = getTotals(
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
    }
  })
}

export function filterBookings(bookings: BookingWithPrices[], filters: Filters) {
  return bookings.filter(
    (booking) =>
      isWithinInterval(new Date(booking._createdAt), {
        start: filters.dates[0],
        end: filters.dates[1],
      }) &&
      booking.seats &&
      (!filters?.seatTier ||
        booking.seats.some(
          (seat) => seat.priceTier && filters.seatTier?.has(seat.priceTier?._id),
        )) &&
      (!filters?.show || (booking.show && filters?.show.has(booking.show._id))) &&
      (!filters?.discount || (booking.discount && filters?.discount.has(booking.discount?._id))) &&
      (!filters?.source || filters?.source.has(booking.source)) &&
      (!filters?.campaign || (booking.campaign && filters?.campaign.has(booking.campaign))),
  )
}
