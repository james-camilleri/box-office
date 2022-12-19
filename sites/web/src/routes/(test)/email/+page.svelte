<!--
  This page is only used for testing the email layout.
  It should not be published.

  TODO: Figure out how to do that.
 -->
<script lang="ts">
  import Email from '../../api/tickets/email/template/Email.svelte'
</script>

<Email
  name="James Camilleri"
  event={{
    name: 'A Cool Event',
    date: '19th January, 1992',
    time: '07:00',
    location: 'Malta',
    map: 'https://maps.google.com/',
  }}
  tickets={[
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
  ]}
/>
