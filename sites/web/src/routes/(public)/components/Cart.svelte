<script lang="ts">
  import { Button, Loader, TextInput } from '@svelteuidev/core'
  import { pricing, selection } from '$lib/components/seatplan/stores.js'
  import type { Discount, PriceConfiguration, PriceTier, Show } from 'shared/types'
  import { getLineItem, getTotals } from 'shared/utils'
  import Payment from './Payment.svelte'
  import Grid from '$lib/components/layout/Grid.svelte'

  export let show: string
  export let priceTiers: PriceTier[]
  export let priceConfiguration: PriceConfiguration

  enum CART_STATE {
    SELECTION = 'selection',
    CHECK_OUT = 'check-out',
    PAYMENT_IN_PROGRESS = 'payment-in-progress',
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
  }

  function onPaymentSuccess() {
    cartState = CART_STATE.PAYMENT_SUCCESS
  }
</script>

<div class="cart">
  {#if cartState === CART_STATE.SELECTION}
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
    {#if lineItems.length}
      <div class="controls">
        <Grid>
          <form on:submit|preventDefault={applyDiscount} class="discount-code">
            <TextInput
              label="Discount code"
              error={!discountCode && discountError}
              bind:value={discountCode}
            >
              <svelte:fragment slot="rightSection">
                {#if checkingDiscount}
                  <Loader color="blue" size="xs" />
                {/if}
              </svelte:fragment>
            </TextInput>
            <Button disabled={!discountCode || checkingDiscount}>Apply discount</Button>
          </form>
          <Button fullSize disabled={!lineItems.length} on:click={startCheckout}>Checkout</Button>
        </Grid>
      </div>
    {/if}
  {/if}

  {#if cartState === CART_STATE.CHECK_OUT}
    <Payment
      {show}
      discountCode={discount?.code}
      seats={[...$selection.values()]}
      on:payment-success={onPaymentSuccess}
    />
  {/if}
</div>

<style lang="scss">
  .cart {
    padding: var(--md);
    background: var(--light);
  }

  .selection {
    display: flex;
    flex-direction: column;
    gap: var(--xxs);
  }

  .line-item {
    display: flex;
    justify-content: space-between;
    padding-bottom: 2px;
    border-bottom: 1px var(--neutral) solid;

    &:last-child {
      text-align: right;
    }
  }

  .total {
    font-weight: bold;
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
    align-items: end;
  }
</style>
