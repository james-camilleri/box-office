/**
 * Booked seats for a particular show.
 * @show the `_id` of the show
 */
export const BOOKED_SEATS = '*[_type == "ticket" && valid && show._ref == $show][].seat._ref'

/**
 * Booked and locked seats for a particular show.
 * @show the `_id` of the show
 */
export const BOOKED_AND_LOCKED_SEATS = `*[
  _type == "ticket"
  && valid
  && show._ref == $show
][].seat._ref
+
*[_type == "seat"
  && $show in locks[].show
  && count(locks[dateTime(now()) - dateTime(lockTime) < 60*5]) > 0
]._id`

/**
 * All the currently locked seats for a particular show.
 * @show the `_id` of the show
 */
export const ALL_LOCKED_SEATS = `*[
  _type == "seat"
  && $show in locks[].show
  && count(locks[dateTime(now()) - dateTime(lockTime) < 60*5]) > 0
]._id`

/**
 * Seats and their locked status for a particular show.
 * @show the `_id` of the show
 * @show the IDs of the seats to check for locks
 */
export const LOCKED_SEATS = `*[
  _type == "seat"
  && _id in $seats
]{
  _id,
  _rev,
  'locked': $show in locks[].show && count(locks[dateTime(now()) - dateTime(lockTime) < 60*5]) > 0
}`

/**
 * Unbooked seats for a particular show.
 * @show the `_id` of the show
 */
export const UNBOOKED_SEATS =
  '*[_type == "seat" && !(_id in *[_type == "ticket" && valid && show._ref == $show][].seat._ref)][]._id'

/**
 * The composite configuration for reserved seats.
 */
export const RESERVED_SEATS = `*[_id == 'configure'].compositeReservedSeats`

/**
 * Check if a customer for the given email already exists.
 * @email the email to test for
 */
export const CUSTOMER_EXISTS =
  'defined(*[_type == "customer" && !(_id in path("drafts.**")) && email == $email][0]._id)'

/**
 * Get customer ID.
 * @email the email to retrieve the ID for
 */
export const CUSTOMER_ID = '*[_type == "customer" && email == $email][0]._id'

/**
 * Get full booking information for email.
 * @bookingId the booking ID to dereference
 */
export const BOOKING_DETAILS = `*[_type == "booking" && _id == $bookingId]{
    'name': customer -> name,
    'email': customer -> email,
    'show': show -> _id,
    'date': show -> date,
    'discount': {
      'name': discount -> name,
      'type': discount -> type,
      'percentage': discount -> percentage
    }
  }[0]`

/**
 * Get the email text configuration.
 */
export const EMAIL_TEXT = `*[_id == "email"][0].emailText`

/**
 * Gets the rows and sections of an array of seats.
 * @seats an array of seat IDs
 */
export const SEAT_DETAILS = `*[_id in $seats]{
  _id,
  'row': row -> _id,
  'section': row -> section -> _id
}`

/**
 * Gets the full details for a particular show.
 * @show the ID of the show to find
 */
export const SHOW_DETAILS = `*[_id == $show][0]`

/**
 * Gets the discount for a corresponding discount code.
 * @code the discount code to search for
 */
export const DISCOUNT = `*[_type == 'discount' && enabled && code.current == $code]{
  _id,
  name,
  percentage,
  type,
  'code': code.current
}[0]`

/**
 * Gets the full ticketing configuration.
 */
export const CONFIG = `*[_id == 'configure']{
  showName,
  showLocation,
  vatNumber,
  vatPermitNumber,
  mapUrl,
  shows[] -> { _id, date },
  timeZone,
  priceTiers[] -> { _id, name, colour, price },
  'defaultPrice': defaultPrice->._id,
  'priceConfiguration': compositePriceConfiguration,
}[0]`

export const BOOKING_REPORT = `*[_type == "booking" && dateTime(_createdAt) > dateTime(now()) - 60*60*24] {
  _id,
  _createdAt,
  orderConfirmation,
  'name': customer->name,
  'email': customer->email,
  show->{ _id, date},
  'seats': seats[]->{
    _id,
    'row': row -> _id,
    'section': row -> section -> _id
  },
  'tickets': tickets[]._ref,
  'discount': discount->{
    _id,
    name,
    percentage,
    type,
    'code': code.current
  },
  source
} | order(_createdAt asc)
`
