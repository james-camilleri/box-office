import { json } from '@sveltejs/kit'
import { STRIPE_LIVE_SECRET_KEY, STRIPE_TEST_SECRET_KEY } from '$env/static/private'
import { PUBLIC_USE_STRIPE_TEST } from '$env/static/public'
import type { ConfigurationFull, Discount, PriceConfiguration, PriceTier, Seat } from 'shared/types'
import { getSeatPrice, getTotals } from 'shared/utils'
import Stripe from 'stripe'

import type { RequestHandler } from './$types.js'

interface Payload {
  seats: Seat[]
  show: string
  discountCode?: string
}

const API_KEY =
  import.meta.env.PROD && !PUBLIC_USE_STRIPE_TEST ? STRIPE_LIVE_SECRET_KEY : STRIPE_TEST_SECRET_KEY
const stripe = new Stripe(API_KEY)

function calculateTotal(
  seats: Seat[],
  show: string,
  priceTiers: PriceTier[],
  priceConfiguration: PriceConfiguration,
  discount?: Discount,
) {
  const prices = seats.map((seat) => getSeatPrice(seat, show, priceTiers, priceConfiguration) ?? 0)
  return getTotals(prices, discount).total
}

export const POST: RequestHandler = async (event) => {
  const { request, fetch } = event
  const { seats, show, discountCode } = (await request.json()) as Payload

  const requests = [(await fetch('/api/config')).json()]
  discountCode && requests.push((await fetch(`/api/config/discount/${discountCode}`)).json())
  const [configuration, discount] = (await Promise.all(requests)) as [
    ConfigurationFull,
    Discount | undefined,
  ]

  const paymentIntent = await stripe.paymentIntents.create({
    amount:
      calculateTotal(
        seats,
        show,
        configuration.priceTiers,
        configuration.priceConfiguration,
        discount,
      ) * 100,
    currency: 'eur',
    automatic_payment_methods: {
      enabled: true,
    },
    metadata: {
      show,
      seats: JSON.stringify(seats),
      discount: JSON.stringify(discount),
    },
  })

  return json({
    clientSecret: paymentIntent.client_secret,
  })
}
