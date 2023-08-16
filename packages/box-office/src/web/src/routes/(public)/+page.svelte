<script lang="ts">
  import type { PageData } from './$types.js'
  import SeatPlan from '$lib/components/seatplan/SeatPlan.svelte'
  import { page } from '$app/stores'
  import ShowSelection from './components/ShowSelection.svelte'
  import Cart from './components/Cart.svelte'
  import Grid from '$lib/components/layout/Grid.svelte'

  export let data: PageData
  const { configuration, text } = data
  const { priceTiers, priceConfiguration, shows, timeZone } = configuration

  let selectedShowId: string | undefined = undefined
  let unavailableSeats: string[] | undefined = undefined
  let loading = false
  let allowSelection = true

  function onCheckoutStart() {
    allowSelection = false
  }

  function onRefresh() {
    fetchSeatData()
    unavailableSeats = undefined
    allowSelection = true
  }

  function fetchSeatData() {
    const timeout = setTimeout(() => {
      loading = true
    }, 500)

    fetch(`${$page.url.origin}/api/seats/${selectedShowId}`)
      .then((response) => response.json())
      .then(({ unavailable }) => {
        unavailableSeats = unavailable
        loading = false
        clearTimeout(timeout)
      })
  }

  $: {
    unavailableSeats = undefined

    if (selectedShowId) {
      fetchSeatData()
    }
  }
</script>

<ShowSelection bind:selected={selectedShowId} {shows} {timeZone} />
<Grid columns={['3fr', 'minmax(auto, 1fr)']} gap="0">
  <div class="seatplan-wrapper" class:waiting={!selectedShowId || loading}>
    {#if !selectedShowId || loading}
      <div class="status">
        <span>{loading ? 'Loading' : 'Select a show to begin'}</span>
      </div>
    {/if}
    <div class="seatplan">
      <SeatPlan
        showId={selectedShowId}
        {priceTiers}
        {priceConfiguration}
        {unavailableSeats}
        {allowSelection}
      />
    </div>
  </div>
  <Cart
    show={selectedShowId}
    {priceTiers}
    {priceConfiguration}
    {text}
    on:checkout-start={onCheckoutStart}
    on:refresh={onRefresh}
  />
</Grid>

<style lang="scss">
  .seatplan-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    background: var(--light-2);
    border-bottom: var(--border);
    box-shadow: var(--shadow-inset);
  }

  .seatplan {
    width: 100%;
    padding: var(--lg);
  }

  .status {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    padding: var(--md);
    color: var(--background);
    background: rgb(0 0 0 / 70%);

    span {
      padding: var(--sm) var(--lg);
      font-size: var(--xl);
      text-transform: uppercase;
      background: var(--foreground);
      border-radius: var(--border-radius-sm);
    }
  }
</style>