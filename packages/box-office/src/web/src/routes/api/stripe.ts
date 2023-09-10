import { error } from '@sveltejs/kit'
import Stripe from 'stripe'

import {
  STRIPE_LIVE_SECRET_KEY,
  STRIPE_LIVE_WEBHOOK_SECRET,
  STRIPE_LIVE_CONNECT_WEBHOOK_SECRET,
  STRIPE_TEST_SECRET_KEY,
  STRIPE_TEST_WEBHOOK_SECRET,
  STRIPE_TEST_CONNECT_WEBHOOK_SECRET,
} from '$env/static/private'
import { PUBLIC_STRIPE_CONNECT_ID, PUBLIC_USE_STRIPE_TEST } from '$env/static/public'
import { log } from '$shared/utils'

const API_KEY =
  import.meta.env.PROD && PUBLIC_USE_STRIPE_TEST !== 'true'
    ? STRIPE_LIVE_SECRET_KEY
    : STRIPE_TEST_SECRET_KEY

const WEBHOOK_SECRET =
  import.meta.env.PROD && PUBLIC_USE_STRIPE_TEST !== 'true'
    ? STRIPE_LIVE_WEBHOOK_SECRET
    : STRIPE_TEST_WEBHOOK_SECRET

const CONNECT_WEBHOOK_SECRET =
  import.meta.env.PROD && PUBLIC_USE_STRIPE_TEST !== 'true'
    ? STRIPE_LIVE_CONNECT_WEBHOOK_SECRET
    : STRIPE_TEST_CONNECT_WEBHOOK_SECRET

export const stripe = new Stripe(API_KEY, { apiVersion: '2023-08-16' })

export function getWebhookSecret(type: 'account' | 'connect') {
  return type === 'account' ? WEBHOOK_SECRET : CONNECT_WEBHOOK_SECRET
}

export async function getStripeEvent(request: Request): Promise<Stripe.Event | undefined> {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  // Use the connect webhook secret if the payload body includes the connect account ID.
  const secret = body.includes(PUBLIC_STRIPE_CONNECT_ID) ? CONNECT_WEBHOOK_SECRET : WEBHOOK_SECRET

  if (signature) {
    try {
      return stripe.webhooks.constructEvent(body, signature, secret)
    } catch (err) {
      log.error('Webhook signature verification failed:')
      log.error(err.message)
      await log.flushAll()

      throw error(400)
    }
  }
}
