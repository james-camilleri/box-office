import { json } from '@sveltejs/kit'
import { STRIPE_LIVE_SECRET_KEY, STRIPE_TEST_SECRET_KEY } from '$env/static/private'
import { PUBLIC_USE_STRIPE_TEST } from '$env/static/public'
import type { ConfigurationFull, Discount, Seat } from '$shared/types'
import { calculateTotal } from '$shared/utils'
import Stripe from 'stripe'

import { sanity } from '../api/sanity.js'
import type { RequestHandler } from './$types.js'

interface Payload {
  seats: Seat[]
  show: string
  discountCode?: string
}

const API_KEY =
  import.meta.env.PROD && PUBLIC_USE_STRIPE_TEST !== 'true'
    ? STRIPE_LIVE_SECRET_KEY
    : STRIPE_TEST_SECRET_KEY
const stripe = new Stripe(API_KEY)

export const POST: RequestHandler = async (event) => {
  const { request, fetch } = event
  const { seats, show, discountCode } = (await request.json()) as Payload

  const requests = [(await fetch('/api/config')).json()]
  discountCode &&
    requests.push((await fetch(`/api/config/discount/${show}/${discountCode}`)).json())
  const [configuration, discount] = (await Promise.all(requests)) as [
    ConfigurationFull,
    Discount | undefined,
  ]

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.floor(
      calculateTotal(
        seats,
        show,
        configuration.priceTiers,
        configuration.priceConfiguration,
        discount,
      ) * 100,
    ),
    currency: 'eur',
    automatic_payment_methods: {
      enabled: true,
    },
    metadata: {
      show,
      seatIds: JSON.stringify(seats.map((seat) => seat._id)),
      discount: JSON.stringify(discount),
    },
  })

  return json({
    clientSecret: paymentIntent.client_secret,
  })
}

export const GET: RequestHandler = async () => {
  const websiteText = await sanity.fetch('*[_id == "website"][0].text')
  return json(websiteText)
}
