<script lang="ts">
  import type { Discount, PriceConfiguration, PriceTier, Seat } from '$shared/types'
  import type { PortableTextBlock } from '@portabletext/types'

  import { PortableText } from '@portabletext/svelte'
  import { Alert, Button, Loader, TextInput, Tooltip } from '@svelteuidev/core'
  import { createEventDispatcher } from 'svelte'
  import SvelteLogo from 'virtual:icons/fluent/info-28-regular'

  import Grid from '$lib/components/layout/Grid.svelte'
  import { selection } from '$lib/components/seatplan/stores.js'
  import { getLineItem, getTotals } from '$shared/utils'

  import Payment from './Payment.svelte'

  export let show: string
  export let priceTiers: PriceTier[]
  export let priceConfiguration: PriceConfiguration
  export let text: PortableTextBlock[]

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

  // Reset discount if show is changed.
  $: show, resetDiscount()

  function resetDiscount() {
    discount = undefined
    discountCode = ''
    checkingDiscount = false
    discountError = ''
  }

  async function applyDiscount() {
    const discountToCheck = discountCode.trim().toUpperCase()
    checkingDiscount = true
    discountCode = ''
    discountError = ''

    const response = await fetch(`/api/config/discount/${show}/${discountToCheck}`)
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
      {#if lineItems.length}
        <span class="line-item subtotal">
          <span>Subtotal <small>(5% VAT)</small></span>
          <span>€{totals.subtotal.toFixed(2)}</span>
        </span>
        {#if discount && totals.reduction}
          <span class="line-item discount">
            <span>Discount ({discount.name})</span>
            <span>-€{totals.reduction.toFixed(2)}</span>
          </span>
        {/if}
        <span class="line-item booking-fee">
          <span
            >Booking fee <small>(0% VAT)</small><Tooltip
              wrapLines
              width={300}
              withArrow
              transitionDuration={200}
              label="This booking fee covers credit card processing costs and maintenance of the ticketing platform, so that 100% of the ticket price goes to the artists. Booking fees are regrettably not refundable."
              ><span class="info-icon">
                <SvelteLogo />
              </span></Tooltip
            ></span
          >
          <span>€{totals?.bookingFee?.toFixed(2) ?? '0'}</span>
        </span>
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
            class="input"
            aria-label="Discount code"
            placeholder="Discount code"
            error={!discountCode && discountError}
            bind:value={discountCode}
          >
            <svelte:fragment slot="rightSection">
              {#if checkingDiscount}
                <Loader color="gray" size="xs" />
              {/if}
            </svelte:fragment>
          </TextInput>
          <Button
            disabled={!discountCode || checkingDiscount}
            color="var(--primary)"
            variant="outline">Apply discount</Button
          >
        </form>
        <div>
          <Button
            fullSize
            disabled={!lineItems.length}
            on:click={startCheckout}
            color="var(--primary)"
            size="lg">Checkout</Button
          >
          <div class="checkout-small-print">
            Seats will be held for 5 minutes once the checkout process is started
          </div>

          <div class="text">
            <PortableText value={text} />
          </div>
        </div>
      </Grid>
    </div>
  {/if}

  {#if cartState === CART_STATE.CHECK_OUT}
    <Payment
      {show}
      {discount}
      paymentRequired={!!totals?.total}
      seats={[...$selection.values()]}
      on:payment-success={onPaymentSuccess}
      on:timeout={timeout}
    />
  {/if}
</div>

<style lang="scss">
  .cart {
    padding: var(--md);
    background: var(--light-1);
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

    .input {
      flex-grow: 1;
    }
  }

  .info-icon {
    display: inline-block;
    width: 1em;
    height: 1em;
    margin-inline-start: 0.5em;
    cursor: pointer;
  }

  .checkout-small-print {
    margin-top: var(--xxs);
    font-size: 0.8em;
    font-style: italic;
  }

  .text {
    margin-top: var(--lg);
  }
</style>
