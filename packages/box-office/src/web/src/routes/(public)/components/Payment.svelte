<script lang="ts">
  import type { Discount, Seat } from '$shared/types'
  import type { Stripe, StripeElements } from '@stripe/stripe-js'

  import { loadStripe } from '@stripe/stripe-js'
  import { Alert, Button, Loader } from '@svelteuidev/core'
  import { createEventDispatcher, onMount } from 'svelte'
  import { Elements, PaymentElement } from 'svelte-stripe'

  import { page } from '$app/stores'
  import {
    PUBLIC_STRIPE_LIVE_API_KEY,
    PUBLIC_STRIPE_TEST_API_KEY,
    PUBLIC_STRIPE_CONNECT_ID,
    PUBLIC_USE_STRIPE_TEST,
  } from '$env/static/public'
  import Grid from '$lib/components/layout/Grid.svelte'

  import AdditionalFields from './AdditionalFields.svelte'

  const API_KEY =
    import.meta.env.PROD && PUBLIC_USE_STRIPE_TEST !== 'true'
      ? PUBLIC_STRIPE_LIVE_API_KEY
      : PUBLIC_STRIPE_TEST_API_KEY

  const ERROR_STRINGS = {
    'already-locked':
      'Looks like someone has already checked out these seats.\nPlease refresh and try again.',
    'failed-to-lock': 'Failed to reserve seats.\nPlease refresh and try again.',
    'failed-to-retrieve-locked-seats':
      'Could not retrieve seat info.\nPlease refresh and try again.',
  }

  export let show: string
  export let seats: Seat[]
  export let discount: Discount | undefined
  export let paymentRequired: boolean

  let stripe: Stripe | null = null
  let clientSecret: string | undefined = undefined
  let campaigns: string[] | undefined = undefined
  let error: { type?: string; message: string } | undefined = undefined
  let elements: StripeElements | undefined
  let processing = false
  let name: string
  let email: string
  let phone: string
  let submitted = false

  let time = 60 * 5
  let interval: number

  onMount(async () => {
    stripe = await loadStripe(API_KEY, { stripeAccount: PUBLIC_STRIPE_CONNECT_ID })
    campaigns =
      $page.url.searchParams.get('campaign')?.split(',') ||
      $page.url.searchParams.get('campaigns')?.split(',') ||
      undefined

    blockSeats()

    if (paymentRequired) {
      clientSecret = await createPaymentIntent()
    }
  })

  const dispatch = createEventDispatcher()

  function startTimer() {
    interval = window.setInterval(() => {
      time--
      if (time === 0) {
        clearInterval(interval)
        dispatch('timeout')
      }
    }, 1000)
  }

  function pad(number: number) {
    const string = number.toString()
    return string.length === 1 ? `0${string}` : string
  }

  async function blockSeats() {
    const response = await fetch('/api/seats/lock', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        show,
        seats: seats.map((seat) => seat._id),
      }),
    })

    if (!response.ok) {
      const payload = (await response.json()) as { message: string }
      error = { type: payload.message, message: ERROR_STRINGS[payload.message] ?? '' }

      return
    }

    startTimer()
  }

  async function createPaymentIntent() {
    const response = await fetch('/', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        show,
        seats,
        discountCode: discount?.code,
        campaigns,
      }),
    })

    const { clientSecret } = await response.json()
    return clientSecret
  }

  async function createBooking() {
    const response = await fetch('api/booking', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        name,
        email: email.trim(),
        phone,
        show,
        seatIds: seats.map((seat) => seat._id),
        discount,
        campaigns,
      }),
    })

    if (!response.ok) {
      error = { message: 'Error placing booking' }
      processing = false
    } else {
      dispatch('payment-success')
    }
  }

  async function confirmPayment() {
    const result = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
      confirmParams: {
        payment_method_data: {
          billing_details: {
            name,
            email: email.trim(),
            phone,
          },
        },
      },
    })

    if (result.error) {
      error = result.error
      processing = false
    } else {
      clientSecret = undefined

      dispatch('payment-success')
    }
  }

  function onSubmit() {
    if ((paymentRequired && (!stripe || !elements)) || processing) {
      return
    }

    submitted = true

    if (!name || !email || !phone) {
      return
    }

    processing = true
    error = undefined

    if (paymentRequired) {
      confirmPayment()
    } else {
      createBooking()
    }
  }
</script>

{#if error}
  <div class="alert-wrapper">
    <Alert
      title={paymentRequired ? 'Problem submitting payment!' : 'Problem processing checkout!'}
      color="yellow"
    >
      {error.message}
    </Alert>
  </div>
{/if}
{#if error?.type !== 'already-locked'}
  <div class="alert-wrapper">
    <Alert
      title="Your tickets will be held for {pad(Math.floor(time / 60))}:{pad(time % 60)}"
      color="dark"
    />
  </div>
{/if}

{#if paymentRequired && stripe && clientSecret && !error}
  <form on:submit|preventDefault={onSubmit}>
    <Grid gap="var(--xxs)">
      <Elements
        {stripe}
        {clientSecret}
        rules={{ '.Input': { border: 'solid 1px #0002' } }}
        bind:elements
      >
        <AdditionalFields bind:name bind:email bind:phone {submitted} />
        <PaymentElement />
        <div class="confirm-button">
          <Button fullSize disabled={processing} color="red" size="lg">Pay</Button>
        </div>
      </Elements>
    </Grid>
  </form>
{:else if !paymentRequired && !error}
  <form on:submit|preventDefault={onSubmit}>
    <Grid gap="var(--xxs)">
      <AdditionalFields bind:name bind:email bind:phone {submitted} />
      <div class="confirm-button">
        <Button fullSize disabled={processing} color="var(--primary)" size="lg">Confirm</Button>
      </div>
    </Grid>
  </form>
{:else}
  <div class="loader">
    <Loader color="gray" size="lg" />
  </div>
{/if}

<style>
  .loader {
    width: 4rem;
    height: 4rem;
    margin: var(--md) auto;
  }

  .alert-wrapper {
    margin-bottom: var(--md);
  }

  .confirm-button {
    margin-top: var(--lg);
  }
</style>
