/**
 * Booked seats for a particular show.
 * @show the `_id` of the show
 */
export const BOOKED_SEATS = '*[_type == "booking" && show._ref == $show][0].seats[]._ref'

/**
 * Unbooked seats for a particular show.
 * @show the `_id` of the show
 */
export const UNBOOKED_SEATS =
  '*[_type == "seat" && !(_id in *[_type == "booking" && show._ref == $show][0].seats[]._ref)][]._id'

/**
 * Check if a customer for the given email already exists.
 * @email the email to test for
 */
export const CUSTOMER_EXISTS = 'defined(*[_type == "customer" && email == $email][0]._id)'
