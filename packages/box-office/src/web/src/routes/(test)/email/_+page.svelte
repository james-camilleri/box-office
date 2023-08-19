<!--
  This page is only used for testing the email layout.
  It should not be published.

  TODO: Figure out how to do that.
 -->
<script lang="ts">
  // import Tickets from '../../api/tickets/email/templates/Tickets.svelte'
  import Invoice from '../../api/tickets/email/templates/Invoice.svelte'
  import { DISCOUNT_TYPE } from '$shared/types'

  const event = {
    name: 'A Cool Event',
    date: '19th January, 1992',
    time: '07:00',
    location: 'Malta',
    map: 'https://maps.google.com/',
  }

  const name = 'James Camilleri'

  const show = 'xxxx-yyyy-zzzz'

  const tickets = [
    {
      _createdAt: '2022-12-18T23:51:57Z',
      _id: 'ZL-97-J8WW',
      _rev: '6hAKPzOTjAph7oezfuGK4J',
      _type: 'ticket',
      _updatedAt: '2022-12-18T23:51:57Z',
      qrCode: {
        _type: 'image',
        asset: {
          _ref: 'image-d24ffecebc5c1c114b198e8438cde061358162cb-1024x1024-png',
          _type: 'reference',
        },
      },
      seat: { _ref: 'STALLS-A-1', _type: 'reference' },
      show: {
        _ref: '759e9e08-5502-4564-9978-38be2119b451',
        _type: 'reference',
      },
      valid: true,
    },
    {
      _createdAt: '2022-12-18T23:51:57Z',
      _id: 'HP-03-N5QT',
      _rev: '6hAKPzOTjAph7oezfuGKDr',
      _type: 'ticket',
      _updatedAt: '2022-12-18T23:51:57Z',
      qrCode: {
        _type: 'image',
        asset: {
          _ref: 'image-d24ffecebc5c1c114b198e8438cde061358162cb-1024x1024-png',
          _type: 'reference',
        },
      },
      seat: { _ref: 'STALLS-A-2', _type: 'reference' },
      show: {
        _ref: '759e9e08-5502-4564-9978-38be2119b451',
        _type: 'reference',
      },
      valid: true,
    },
    {
      _createdAt: '2022-12-18T23:51:57Z',
      _id: 'QH-Z8-YGDP',
      _rev: 'brU4IiM3nJH2kmapCzWG3Q',
      _type: 'ticket',
      _updatedAt: '2022-12-18T23:51:57Z',
      qrCode: {
        _type: 'image',
        asset: {
          _ref: 'image-d24ffecebc5c1c114b198e8438cde061358162cb-1024x1024-png',
          _type: 'reference',
        },
      },
      seat: { _ref: 'STALLS-A-3', _type: 'reference' },
      show: {
        _ref: '759e9e08-5502-4564-9978-38be2119b451',
        _type: 'reference',
      },
      valid: true,
    },
  ]

  const priceTiers = [
    {
      _id: '8b562928-d472-4e5a-97d3-1d337c76ea9c',
      name: 'Platinum+',
      price: 100,
    },
    {
      _id: '58d7f8df-c72f-4bc6-aafa-c5b212d16ca1',
      name: 'Platinum',
      price: 50,
    },
    {
      _id: '43a2429f-65e1-4af5-8d76-bed10d356584',
      name: 'Gold',
      price: 45,
    },
    {
      _id: 'daa5df37-4d72-43b4-b376-cfcd4e4c3da5',
      name: 'Silver',
      price: 40,
    },
    {
      _id: '6ddefe35-aa1a-482a-97f1-9396356441c6',
      name: 'Bronze',
      price: 35,
    },
  ]

  const priceConfiguration = {
    default: {
      TABLES: '8b562928-d472-4e5a-97d3-1d337c76ea9c',
      'STALLS-A': '43a2429f-65e1-4af5-8d76-bed10d356584',
      'STALLS-E': '43a2429f-65e1-4af5-8d76-bed10d356584',
      'STALLS-I': '43a2429f-65e1-4af5-8d76-bed10d356584',
      'STALLS-B': 'daa5df37-4d72-43b4-b376-cfcd4e4c3da5',
      'STALLS-C': 'daa5df37-4d72-43b4-b376-cfcd4e4c3da5',
      'STALLS-F': 'daa5df37-4d72-43b4-b376-cfcd4e4c3da5',
      'STALLS-G': 'daa5df37-4d72-43b4-b376-cfcd4e4c3da5',
      'STALLS-J': 'daa5df37-4d72-43b4-b376-cfcd4e4c3da5',
      'STALLS-K': 'daa5df37-4d72-43b4-b376-cfcd4e4c3da5',
      'STALLS-D': '6ddefe35-aa1a-482a-97f1-9396356441c6',
      'STALLS-H': '6ddefe35-aa1a-482a-97f1-9396356441c6',
      'STALLS-L': '6ddefe35-aa1a-482a-97f1-9396356441c6',
      default: '58d7f8df-c72f-4bc6-aafa-c5b212d16ca1',
    },
  }

  const earlyBirdDiscount = {
    name: 'Early Bird',
    type: DISCOUNT_TYPE.PERCENTAGE,
    percentage: 15,
  }

  const complimentaryDiscount = {
    name: 'Complimentary',
    type: DISCOUNT_TYPE.PERCENTAGE,
    percentage: 100,
  }
</script>

<!-- <Tickets
  {name}
  {event}
  {tickets}
/> -->

<Invoice
  {name}
  {event}
  {show}
  {tickets}
  {priceTiers}
  {priceConfiguration}
  discount={complimentaryDiscount}
/>
