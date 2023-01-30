<script lang="ts">
  import { onMount } from 'svelte'
  import { loadStripe } from '@stripe/stripe-js'
  import { Elements, PaymentElement, LinkAuthenticationElement, Address } from 'svelte-stripe'
  import { PUBLIC_STRIPE_LIVE_API_KEY, PUBLIC_STRIPE_TEST_API_KEY } from '$env/static/public'

  import Button from '$lib/components/form/Button.svelte'

  const API_KEY = import.meta.env.PROD ? PUBLIC_STRIPE_LIVE_API_KEY : PUBLIC_STRIPE_TEST_API_KEY

  export let show: string
  export let seats: Seat[]
  export let discountCode: string | undefined

  let stripe = null
  let clientSecret = null
  let error = null
  let elements
  let processing = false

  onMount(async () => {
    stripe = await loadStripe(API_KEY)
    // create payment intent server side
    clientSecret = await createPaymentIntent()
  })

  async function createPaymentIntent() {
    const response = await fetch('/', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        show,
        seats,
        discountCode,
      }),
    })
    const { clientSecret } = await response.json()
    return clientSecret
  }

  async function submit() {
    // avoid processing duplicates
    if (processing) return
    processing = true
    // confirm payment with stripe
    const result = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
    })
    // log results, for debugging
    console.log({ result })
    if (result.error) {
      // payment failed, notify user
      error = result.error
      processing = false
    } else {
      // payment succeeded, redirect to "thank you" page
      goto('/examples/payment-element/thanks')
    }
  }
</script>

{#if error}
  <p class="error">{error.message} Please try again.</p>
{/if}

{#if stripe && clientSecret}
  <Elements
    {stripe}
    {clientSecret}
    theme="flat"
    labels="floating"
    variables={{ colorPrimary: '#7c4dff' }}
    rules={{ '.Input': { border: 'solid 1px #0002' } }}
    bind:elements
  >
    <form on:submit|preventDefault={submit}>
      <LinkAuthenticationElement />
      <PaymentElement />
      <Address mode="billing" />

      <button disabled={processing}>
        {#if processing}
          Processing...
        {:else}
          Pay
        {/if}
      </button>
    </form>
  </Elements>
{:else}
  Loading...
{/if}

<style>
  .error {
    margin: 2rem 0 0;
    color: tomato;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin: 2rem 0;
  }

  button {
    padding: 1rem;
    margin: 1rem 0;
    font-size: 1.2rem;
    color: white;
    background: var(--link-color);
    border: solid 1px #ccc;
    border-radius: 5px;
  }
</style>
