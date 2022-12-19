<!--
  Based on the responsive email template by Lee Munroe:
  https://github.com/leemunroe/responsive-html-email-template
-->
<script lang="ts">
  import type { Ticket } from 'shared/types'

  import { parseFullName } from 'parse-full-name'
  import { imageUrlBuilder } from '../../../sanity.js'

  import EmailWrapper from './components/EmailWrapper.svelte'
  import Footer from './components/Footer.svelte'
  import QrCode from './components/QrCode.svelte'

  export let event: {
    name: string
    date: string
    time: string
    location: string
    map: string
  }
  export let name: string
  export let tickets: Ticket[]

  const { first, middle, nick } = parseFullName(name)
  const firstName =
    middle && nick
      ? `${first} ${middle} ${nick}`
      : middle
      ? `${first} ${middle}`
      : nick
      ? `${first} ${nick}`
      : first ?? ''
</script>

<EmailWrapper title="{event.name}: Tickets" description="Your tickets for {event.name}.">
  <div slot="content">
    <p>Hey {firstName}, here are your tickets for <strong>{event.name}</strong>.</p>
    <p>
      No need to print anything – just bring this email on your phone. If you'd rather print them
      out, just make sure the QR codes below are clearly visible.
    </p>
    {#each tickets as ticket}
      <QrCode
        ticketId={ticket._id}
        qrCodeUrl={ticket?.qrCode?.asset?._ref &&
          imageUrlBuilder.image(ticket?.qrCode?.asset?._ref).url()}
        seat={{
          section: 'BALCONY',
          row: 'A',
          seatNumber: '1',
        }}
      />
    {/each}
  </div>
  <div slot="footer">
    <Footer />
  </div>
</EmailWrapper>

<style lang="scss">
  strong {
    font-weight: bold;
  }
</style>
