<!--
  Based on the responsive email template by Lee Munroe:
  https://github.com/leemunroe/responsive-html-email-template
-->
<script lang="ts">
  import type { Ticket, PriceConfiguration, Discount, PriceTier } from 'shared/types'
  import { getLineItem, getTotals } from 'shared/utils'

  import EmailWrapper from './components/EmailWrapper.svelte'

  export let event: { name: string }
  export let name: string
  export let show: string
  export let tickets: Ticket[]
  export let priceTiers: PriceTier[]
  export let priceConfiguration: PriceConfiguration
  export let discount: Discount | undefined

  const lineItems = tickets.map(({ seat }) =>
    getLineItem(seat._ref, show, priceTiers, priceConfiguration),
  )

  const { subtotal, reduction, total } = getTotals(
    lineItems.map(({ price }) => price ?? 0),
    discount,
  )
</script>

<EmailWrapper title="{event.name}: Invoice">
  <div slot="content">
    <p>Hey {name}, here is your invoice for <strong>{event.name}</strong>.</p>
    <table class="invoice" border={0}>
      <colgroup>
        <col span="1" style="width: 85%;" />
        <col span="1" style="width: 5%;" />
        <col span="1" style="width: 10%;" />
      </colgroup>

      {#each lineItems as { description, price }}
        <tr class="line-item">
          <td>{description}</td>
          <td>€</td>
          <td>{price?.toFixed(2)}</td>
        </tr>
      {/each}
      {#if discount && reduction}
        <tr class="line-item subtotal">
          <td>Subtotal</td>
          <td>€</td>
          <td>{subtotal.toFixed(2)}</td>
        </tr>
        <tr class="line-item discount">
          <td>Discount ({discount.name})</td>
          <td>€</td>
          <td>-{reduction.toFixed(2)}</td>
        </tr>
      {/if}
      <tr class="line-item total">
        <td>Total</td>
        <td>€</td>
        <td>{total.toFixed(2)}</td>
      </tr>
    </table>
  </div>
  <!-- <div slot="footer">
    <Footer />
  </div> -->
</EmailWrapper>

<style lang="scss">
  strong,
  .subtotal,
  .discount,
  .total {
    font-weight: bold;
  }

  .invoice {
    border-spacing: 0;
  }

  .line-item td {
    padding: 5px 2px;
    border-top: solid 1px #ccc;
  }

  tr > td:last-child {
    text-align: right;
  }

  .line-item:first-of-type td {
    border-top: 0;
  }

  .line-item.subtotal td {
    border-top: solid 3px #000;
  }

  .line-item.total td {
    border-bottom: solid 3px #000;
  }

  .line-item:not(.discount) + .line-item.total td {
    border-top: solid 3px #000;
  }
</style>
