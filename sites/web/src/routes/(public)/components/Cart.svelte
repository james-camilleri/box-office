<script lang="ts">
  import { Alert, Button, Loader, TextInput } from '@svelteuidev/core'
  import { pricing, selection } from '$lib/components/seatplan/stores.js'
  import type { Discount, PriceConfiguration, PriceTier, Seat } from 'shared/types'
  import { getLineItem, getTotals } from 'shared/utils'
  import Payment from './Payment.svelte'
  import Grid from '$lib/components/layout/Grid.svelte'
  import { createEventDispatcher } from 'svelte'

  export let show: string
  export let priceTiers: PriceTier[]
  export let priceConfiguration: PriceConfiguration

  const dispatch = createEventDispatcher()

  enum CART_STATE {
    SELECTION = 'selection',
    CHECK_OUT = 'check-out',
    PAYMENT_SUCCESS = 'payment-success',
  }
  $: cartState = CART_STATE.SELECTION

  $: lineItems = [...$selection.values()].map((seat) =>
    getLineItem(seat, show, priceTiers, priceConfiguration),
  )

  $: totals = getTotals(
    lineItems.map(({ price }) => price ?? 0),
    discount,
  )

  let discount: Discount | undefined
  $: discount = undefined
  $: discountCode = ''
  $: checkingDiscount = false
  $: discountError = ''

  async function applyDiscount() {
    const discountToCheck = discountCode.trim().toUpperCase()
    checkingDiscount = true
    discountCode = ''
    discountError = ''

    const response = await fetch(`/api/config/discount/${discountToCheck}`)
    checkingDiscount = false

    if (!response.ok) {
      discountError = `${discountToCheck} is not a valid discount code`
      return
    }

    discount = await response.json()
  }

  function startCheckout() {
    if (!lineItems.length) {
      return
    }

    cartState = CART_STATE.CHECK_OUT

    dispatch('checkout-start')
  }

  function onPaymentSuccess() {
    cartState = CART_STATE.PAYMENT_SUCCESS
    dispatch('refresh')
  }

  function timeout() {
    $selection = new Map<string, Seat>()
    cartState = CART_STATE.SELECTION
    dispatch('refresh')
  }
</script>

<div class="cart">
  {#if cartState === CART_STATE.SELECTION || cartState === CART_STATE.PAYMENT_SUCCESS}
    {#if cartState === CART_STATE.PAYMENT_SUCCESS && $selection.size === 0}
      <div class="success-notice">
        <Alert title="Checkout successful" color="green">Check your inbox for your tickets</Alert>
      </div>
    {/if}

    {#if !lineItems.length}
      <Alert title="Select a seat" color="orange" />
    {/if}
    <div class="selection">
      {#each lineItems as { description, price }}
        <span class="line-item">
          <span>{description}</span>
          <span>€{price}</span>
        </span>
      {/each}
      {#if discount && totals.reduction}
        <span class="line-item subtotal">
          <span>Subtotal</span>
          <span>€{totals.subtotal.toFixed(2)}</span>
        </span>
        <span class="line-item discount">
          <span>Discount ({discount.name})</span>
          <span>-€{totals.reduction.toFixed(2)}</span>
        </span>
      {/if}
      {#if lineItems.length}
        <span class="line-item total">
          <span>Total</span>
          <span>
            €{totals.total.toFixed(2)}<br />
            {#if totals.vat > 0}
              <span class="vat">
                <span>includes €{totals.vat.toFixed(2)} VAT</span>
              </span>
            {/if}
          </span>
        </span>
      {/if}
    </div>
    <div class="controls">
      <Grid>
        <form on:submit|preventDefault={applyDiscount} class="discount-code">
          <TextInput
            aria-label="Discount code"
            placeholder="Discount code"
            error={!discountCode && discountError}
            bind:value={discountCode}
          >
            <svelte:fragment slot="rightSection">
              {#if checkingDiscount}
                <Loader color="red" size="xs" />
              {/if}
            </svelte:fragment>
          </TextInput>
          <Button disabled={!discountCode || checkingDiscount} color="red" variant="outline"
            >Apply discount</Button
          >
        </form>
        <div>
          <Button
            fullSize
            disabled={!lineItems.length}
            on:click={startCheckout}
            color="red"
            size="lg">Checkout</Button
          >
          <div class="checkout-small-print">
            Seats will be held for 5 minutes once the checkout process is started
          </div>
        </div>
      </Grid>
    </div>
  {/if}

  {#if cartState === CART_STATE.CHECK_OUT}
    <Payment
      {show}
      discountCode={discount?.code}
      seats={[...$selection.values()]}
      on:payment-success={onPaymentSuccess}
      on:timeout={timeout}
    />
  {/if}
</div>

<style lang="scss">
  .cart {
    padding: var(--md);
    background: var(--light);
  }

  .success-notice {
    margin-bottom: var(--md);
  }

  .selection {
    display: flex;
    flex-direction: column;
    gap: var(--xxs);
  }

  .line-item {
    display: flex;
    justify-content: space-between;
    padding: var(--xxs) var(--xxs) 0;

    &:not(:first-child) {
      border-top: 1px var(--dark-1) solid;
    }

    &:last-child {
      text-align: right;
    }
  }

  .subtotal {
    border-top: 3px var(--dark-1) solid !important;
  }

  .total {
    padding-bottom: var(--xxs);
    font-weight: bold;
    border-top: 3px var(--dark-1) solid !important;
    border-bottom: 3px var(--dark-1) solid;
  }

  .vat {
    font-size: 0.8em;
    font-style: italic;
  }

  .controls {
    margin-top: var(--lg);

    // Hack for in-built spinners.
    :global(svg) {
      width: unset;
      height: unset;
    }
  }

  .discount-code {
    display: flex;
    gap: var(--xs);
    align-items: start;
  }

  :global(.discount-code > :first-child) {
    flex-grow: 1;
  }

  .checkout-small-print {
    margin-top: var(--xxs);
    font-size: 0.8em;
    font-style: italic;
  }
</style>
