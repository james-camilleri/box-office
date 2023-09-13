import type { Colour, ConfigurationFull, Discount, Seat, WebConfigurationRaw } from '$shared/types'
import type { RequestHandler } from './$types.js'

import { json } from '@sveltejs/kit'
import Stripe from 'stripe'

import { STRIPE_LIVE_SECRET_KEY, STRIPE_TEST_SECRET_KEY } from '$env/static/private'
import { PUBLIC_USE_STRIPE_TEST, PUBLIC_STRIPE_CONNECT_ID } from '$env/static/public'
import { WEBSITE_CONFIGURATION } from '$shared/queries'
import { getSeatPrice, getTotals } from '$shared/utils'

import { sanity } from '../api/sanity.js'

interface Payload {
  seats: Seat[]
  show: string
  discountCode?: string
  campaigns?: string[]
}

const API_KEY =
  import.meta.env.PROD && PUBLIC_USE_STRIPE_TEST !== 'true'
    ? STRIPE_LIVE_SECRET_KEY
    : STRIPE_TEST_SECRET_KEY
const stripe = new Stripe(API_KEY)

export const POST: RequestHandler = async (event) => {
  const { request, fetch } = event
  const { seats, show, discountCode, campaigns } = (await request.json()) as Payload

  const requests = [(await fetch('/api/config')).json()]
  discountCode &&
    requests.push((await fetch(`/api/config/discount/${show}/${discountCode}`)).json())
  const [configuration, discount] = (await Promise.all(requests)) as [
    ConfigurationFull,
    Discount | undefined,
  ]

  const prices = seats.map(
    (seat) =>
      getSeatPrice(seat, show, configuration.priceTiers, configuration.priceConfiguration) ?? 0,
  )
  const { total, applicationFee } = getTotals(prices, discount)

  const paymentIntent = await stripe.paymentIntents.create(
    {
      amount: Math.floor(total * 100),
      currency: 'eur',
      metadata: {
        show,
        seatIds: JSON.stringify(seats.map((seat) => seat._id)),
        discount: JSON.stringify(discount),
        campaigns: JSON.stringify(campaigns),
      },
      application_fee_amount: Math.floor((applicationFee ?? 0) * 100),
    },
    {
      stripeAccount: PUBLIC_STRIPE_CONNECT_ID,
    },
  )

  return json({
    clientSecret: paymentIntent.client_secret,
  })
}

function colourToString({ r, g, b, a }: Colour) {
  return `rgb(${r} ${g} ${b} / ${a * 100}%)`
}

export const GET: RequestHandler = async () => {
  const webConfig = (await sanity.fetch(WEBSITE_CONFIGURATION)) as WebConfigurationRaw

  return json({
    ...webConfig,
    primaryColour: colourToString(webConfig.primaryColour),
    secondaryColour: colourToString(webConfig.secondaryColour),
  })
}
