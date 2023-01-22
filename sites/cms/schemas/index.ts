import booking from './bookings/booking.js'
import customer from './bookings/customer.js'
import ticket from './bookings/ticket.js'
import pageConfigure from './configuration/configure.js'
import discount from './configuration/discount.js'
import priceTier from './configuration/price-tier.js'
import show from './configuration/show.js'
import row from './seatmap/row.js'
import seat from './seatmap/seat.js'
import section from './seatmap/section.js'

export const schemaTypes = [
  booking,
  customer,
  ticket,

  discount,
  pageConfigure,
  priceTier,
  show,

  row,
  seat,
  section,
]
