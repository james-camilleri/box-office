<script lang="ts">
  import type { Stripe, StripeElements } from '@stripe/stripe-js'
  import type { Seat } from 'shared/types'

  import { loadStripe } from '@stripe/stripe-js'
  import { createEventDispatcher, onMount } from 'svelte'
  import { Elements, PaymentElement } from 'svelte-stripe'
  import { Alert, Button, TextInput, Loader } from '@svelteuidev/core'

  import {
    PUBLIC_STRIPE_LIVE_API_KEY,
    PUBLIC_STRIPE_TEST_API_KEY,
    PUBLIC_USE_STRIPE_TEST,
  } from '$env/static/public'
  import Grid from '$lib/components/layout/Grid.svelte'

  const API_KEY =
    import.meta.env.PROD && !PUBLIC_USE_STRIPE_TEST
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
  export let discountCode: string | undefined

  let stripe: Stripe | null = null
  let clientSecret: string | undefined = undefined
  let error: { message: string } | undefined = undefined
  let elements: StripeElements | undefined
  let processing = false
  let name: string
  let email: string
  let submitted = false

  onMount(async () => {
    stripe = await loadStripe(API_KEY)
    clientSecret = await createPaymentIntent()
  })

  const dispatch = createEventDispatcher()

  async function createPaymentIntent() {
    const [stripeResponse, lockedSeatsResponse] = await Promise.all([
      await fetch('/', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          show,
          seats,
          discountCode,
        }),
      }),
      fetch('/api/seats/lock', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          show,
          seats: seats.map((seat) => seat._id),
        }),
      }),
    ])

    if (!lockedSeatsResponse.ok) {
      const payload = (await lockedSeatsResponse.json()) as { message: string }
      error = { message: ERROR_STRINGS[payload.message] ?? '' }
      console.log(payload.message)
    }

    const { clientSecret } = await stripeResponse.json()
    return clientSecret
  }

  async function submit() {
    if (!stripe || !elements || processing) {
      return
    }

    submitted = true

    if (!name || !email) {
      return
    }

    processing = true

    const result = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
      confirmParams: {
        payment_method_data: {
          billing_details: {
            name,
            email,
          },
        },
      },
    })

    if (result.error) {
      error = result.error
      processing = false
    } else {
      dispatch('payment-success')
    }
  }
</script>

{#if error}
  <Alert title="Problem submitting payment!" color="yellow">
    {error.message}
  </Alert>
{/if}

{#if stripe && clientSecret}
  <form on:submit|preventDefault={submit}>
    <Grid gap="var(--xxs)">
      <Elements
        {stripe}
        {clientSecret}
        variables={{ colorPrimary: 'var(--primary)' }}
        rules={{ '.Input': { border: 'solid 1px #0002' } }}
        bind:elements
      >
        <div class="additional-fields">
          <TextInput
            bind:value={name}
            name="name"
            label="Name"
            error={!name && submitted && 'Name is required'}
          />
          <TextInput
            bind:value={email}
            name="email"
            label="Email address"
            error={!name && submitted && 'Email is required'}
          />
        </div>
        <PaymentElement />
        <div class="pay-button">
          <Button fullSize disabled={processing || error} color="red" size="lg">Pay</Button>
        </div>
      </Elements>
    </Grid>
  </form>
{:else}
  <div class="loader">
    <Loader color="red" size="lg" />
  </div>
{/if}

<style>
  .loader {
    width: 4rem;
    height: 4rem;
    margin: var(--md) auto;
  }

  .additional-fields {
    margin-bottom: var(--xs);
  }

  .pay-button {
    margin-top: var(--lg);
  }
</style>
