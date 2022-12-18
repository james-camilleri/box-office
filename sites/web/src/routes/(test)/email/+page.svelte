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
  tickets={[]}
/>
