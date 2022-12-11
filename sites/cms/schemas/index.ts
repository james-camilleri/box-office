import booking from './bookings/booking'
import customer from './bookings/customer'
import ticket from './bookings/ticket'
import pageConfigure from './configuration/configure'
import priceTier from './configuration/price-tier'
import show from './configuration/show'
import row from './seatmap/row'
import seat from './seatmap/seat'
import section from './seatmap/section'

export const schemaTypes = [
  booking,
  customer,
  ticket,

  pageConfigure,
  priceTier,
  show,

  row,
  seat,
  section,
]
