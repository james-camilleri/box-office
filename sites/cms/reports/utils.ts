import { isWithinInterval } from 'date-fns'
import { BookingWithPrices, ReportConfiguration } from 'shared/types'
import { formatShowDateTime } from 'shared/utils'

import { Filters } from './FilterBar.jsx'

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
      (!filters?.campaign ||
        booking?.campaigns?.some((campaign) => filters?.campaign?.has(campaign))),
  )
}

function wrapData(data: string | number | undefined) {
  return data == null ? '' : typeof data === 'string' ? `"${data}"` : `${data.toFixed(2)}`
}

export function createCsvString(bookings: BookingWithPrices[], config?: ReportConfiguration) {
  const header = [
    'ID',
    'Order confirmation',
    'Booking time',
    'Name',
    'Email',
    'Show',
    'Booking source',
    'Number of seats',
    'Seats',
    'Subtotal',
    'Discount applied',
    'Reduction',
    'Total (including VAT)',
    'VAT',
    'Total profit (excluding VAT)',
  ]
    .map(wrapData)
    .join(',')

  const bookingStrings = bookings.map((booking) =>
    [
      booking._id,
      booking.orderConfirmation,
      formatShowDateTime(booking._createdAt, config?.timeZone),
      booking.name,
      booking.email,
      formatShowDateTime(booking.show.date, config?.timeZone),
      booking.source,
      `${booking.seats.length}`,
      booking.seats
        .map((seat) => `${seat._id} ${seat.priceTier?.name ? `(${seat.priceTier?.name})` : ''}`)
        .join(', '),
      booking.subtotal,
      booking.discount?.name
        ? `${booking.discount.name} (${booking.discount.percentage}% off)`
        : '',
      booking.reduction,
      booking.total,
      booking.vat,
      booking.profit,
    ]
      .map(wrapData)
      .join(','),
  )

  return [header, ...bookingStrings].join('\n')
}
