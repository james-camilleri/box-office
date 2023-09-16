<!--
  Based on the responsive email template by Lee Munroe:
  https://github.com/leemunroe/responsive-html-email-template
-->
<script lang="ts">
  import type { TicketDocument, PriceConfiguration, Discount, PriceTier, Seat } from '$shared/types'
  import type { PortableTextBlock } from '@portabletext/types'

  import { PortableText } from '@portabletext/svelte'
  import Footer from 'email-footer'

  import { ORGANISATION_NAME } from '$env/static/private'
  import { getLineItem, getTotals, getZonedDate, getZonedTime } from '$shared/utils'

  import { imageUrlBuilder } from '../../../sanity.js'

  import EmailWrapper from './components/EmailWrapper.svelte'
  import QrCode from './components/QrCode.svelte'

  export let event: {
    name: string
    date: string
    timeZone: string
    location: string
    map: string
    vatNumber: string
    vatPermitNumber: string
  }
  export let name: string
  export let show: string
  export let tickets: TicketDocument[]
  export let seats: Seat[]
  export let orderConfirmation: string
  export let receiptNumber: string
  export let receiptTime: string
  export let priceTiers: PriceTier[]
  export let priceConfiguration: PriceConfiguration
  export let discount: Discount | undefined
  export let emailText: PortableTextBlock[]
  export let calculateBookingFee: boolean

  const lineItems = seats.map((seat) => getLineItem(seat, show, priceTiers, priceConfiguration))
  const { subtotal, bookingFee, reduction, total, vat } = getTotals(
    lineItems.map(({ price }) => price ?? 0),
    discount,
    calculateBookingFee,
  )
</script>

<EmailWrapper title="Your tickets for {event.name}">
  <div slot="content">
    <p>Hey {name}, here are your tickets for <strong>{event.name}</strong>.</p>
    <p>No need to print anything – just bring this email on your phone.</p>
    <PortableText value={emailText} />
    {#each tickets as ticket}
      <QrCode
        ticketId={ticket._id}
        qrCodeUrl={ticket?.qrCode?.asset?._ref &&
          imageUrlBuilder.image(ticket?.qrCode?.asset?._ref).url()}
        seat={ticket.seat._ref}
      />
    {/each}
    <table class="details">
      <tr>
        <td class="details-heading" valign="bottom"><strong>Date</strong></td>
      </tr>
      <tr>
        <td class="details-text">{getZonedDate(event.date, event.timeZone)}</td>
      </tr>
      <tr>
        <td class="details-heading" valign="bottom"><strong>Time</strong></td>
      </tr>
      <tr>
        <td class="details-text">{getZonedTime(event.date, event.timeZone)}</td>
      </tr>
      <tr>
        <td class="details-heading" valign="bottom"><strong>Location</strong></td>
      </tr>
      <tr>
        <td class="details-text"><a href={event.map}>{event.location}</a></td>
      </tr>
      <tr>
        <td class="details-heading" valign="bottom"><strong>Order confirmation</strong></td>
      </tr>
      <tr>
        <td class="details-text">{orderConfirmation}</td>
      </tr>
    </table>

    <p>Your invoice:</p>

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
      {#if (discount && reduction) || bookingFee}
        <tr class="line-item subtotal">
          <td>Subtotal (5% VAT)</td>
          <td>€</td>
          <td>{subtotal.toFixed(2)}</td>
        </tr>
      {/if}
      {#if discount && reduction}
        <tr class="line-item discount">
          <td>Discount ({discount.name})</td>
          <td>€</td>
          <td>-{reduction.toFixed(2)}</td>
        </tr>
      {/if}
      {#if bookingFee}
        <tr class="line-item booking-fee">
          <td>Booking fee (0% VAT)</td>
          <td>€</td>
          <td>{bookingFee.toFixed(2)}</td>
        </tr>
      {/if}
      <tr class="line-item total">
        <td>Total</td>
        <td>€</td>
        <td>{total.toFixed(2)}</td>
      </tr>
      {#if vat > 0}
        <tr class="vat">
          <td colspan="3">includes €{vat.toFixed(2)} VAT</td>
        </tr>
      {/if}
    </table>

    <table class="details">
      <tr>
        <td class="details-heading" valign="bottom"
          >Tickets issued by <strong>{ORGANISATION_NAME}</strong></td
        >
      </tr>
      <tr>
        <td class="details-text" valign="bottom"><strong>VAT number:</strong> {event.vatNumber}</td>
      </tr>
      <tr>
        <td class="details-text" valign="bottom"
          ><strong>VAT permit number:</strong> {event.vatPermitNumber}</td
        >
      </tr>
    </table>
  </div>
  <div slot="footer">
    <Footer
      {receiptNumber}
      receiptTime="{getZonedDate(receiptTime, event.timeZone)} {getZonedTime(
        receiptTime,
        event.timeZone,
      )}"
    />
  </div>
</EmailWrapper>

<style lang="scss">
  strong,
  .subtotal,
  .discount,
  .total {
    font-weight: bold;
  }

  .details-heading {
    padding-top: 15px;
    vertical-align: bottom;
  }

  .invoice {
    width: 100%;
    border-spacing: 0;

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
      border-top: solid 3px #ccc;
    }

    .line-item.total td {
      border-bottom: solid 3px #ccc;
    }

    .line-item:not(.discount) + .line-item.total td {
      border-top: solid 3px #ccc;
    }

    .vat {
      padding-top: 3px;
      font-size: 0.8em;
      font-style: italic;
      text-align: right;
    }
  }
</style>
