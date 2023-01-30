<script lang="ts">
  import Button from '$lib/components/form/Button.svelte'
  import { pricing, selection } from '$lib/components/seatplan/stores.js'
  import type { Discount, PriceConfiguration, PriceTier, Show } from 'shared/types'
  import { getLineItem, getTotals } from 'shared/utils'
  import Payment from './Payment.svelte'

  export let show: string
  export let priceTiers: PriceTier[]
  export let priceConfiguration: PriceConfiguration
  export let discount: Discount | undefined

  enum CART_STATE {
    SELECTION = 'selection',
    CHECK_OUT = 'check-out',
    PAYMENT_IN_PROGRESS = 'payment-in-progress',
  }
  $: cartState = CART_STATE.SELECTION

  $: lineItems = [...$selection.values()].map((seat) =>
    getLineItem(seat, show, priceTiers, priceConfiguration),
  )

  $: totals = getTotals(lineItems.map(({ price }) => price ?? 0))

  function startCheckout() {
    if (!lineItems.length) {
      return
    }

    cartState = CART_STATE.CHECK_OUT
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
    </div>
    <Button big disabled={!lineItems.length} on:click={startCheckout}>Checkout</Button>
  {/if}

  {#if cartState === CART_STATE.CHECK_OUT}
    <Payment {show} seats={[...$selection.values()]} />
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
</style>
