/**
 * Booked seats for a particular show.
 * @show the `_id` of the show
 */
export const BOOKED_SEATS = '*[_type == "ticket" && valid && show._ref == $show][].seat._ref'

/**
 * Unbooked seats for a particular show.
 * @show the `_id` of the show
 */
export const UNBOOKED_SEATS =
  '*[_type == "seat" && !(_id in *[_type == "ticket" && valid && show._ref == $show][].seat._ref)][]._id'

/**
 * Check if a customer for the given email already exists.
 * @email the email to test for
 */
export const CUSTOMER_EXISTS =
  'defined(*[_type == "customer" && !(_id in path("drafts.**")) && email == $email][0]._id)'

/**
 * Get full booking information for email.
 * @bookingId the booking ID to dereference
 */
export const BOOKING_DETAILS = `*[_type == "booking" && _id == $bookingId]{
    'name': customer -> name,
    'email': customer -> email,
    'date': show->date,
    'discount': {
      'name': discount -> name,
      'type': discount -> type,
      'percentage': discount -> percentage
    }
  }`
