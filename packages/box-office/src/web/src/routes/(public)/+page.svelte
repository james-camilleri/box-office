<script lang="ts">
  import type { Seat } from '$shared/types'
  import type { PageData } from './$types.js'

  import { browser } from '$app/environment'
  import { goto } from '$app/navigation'
  import { page } from '$app/stores'
  import Grid from '$lib/components/layout/Grid.svelte'
  import SeatSelection from '$lib/components/seatplan/SeatSelection.svelte'
  import { selection } from '$lib/components/seatplan/stores.js'

  import Cart from './components/Cart.svelte'
  import { selectedShowId } from './state/selected-show.js'

  export let data: PageData
  const { priceTiers, priceConfiguration } = data.ticketConfig

  let unavailableSeats: string[] | undefined = undefined
  let initialSelection: string[] | undefined = undefined
  let loading = false
  let allowSelection = true

  function onCheckoutStart() {
    allowSelection = false
  }

  function refresh() {
    $selection = new Map<string, Seat>()
    unavailableSeats = undefined
    initialSelection = undefined

    fetchSeatData()
    allowSelection = true
  }

  function fetchSeatData() {
    const timeout = setTimeout(() => {
      loading = true
    }, 500)

    const urlSeats = $page.url.searchParams.get('seats')
    const urlHash = $page.url.searchParams.get('hash')

    let url = `${$page.url.origin}/api/seats/${$selectedShowId}`
    if (urlSeats && urlHash) {
      url += `?seats=${urlSeats}&hash=${urlHash}`
    }

    fetch(url)
      .then((response) => response.json())
      .then(({ unavailable }) => {
        unavailableSeats = unavailable

        // Pre-select seats in URL, if they're available.
        if (urlSeats) {
          initialSelection = urlSeats.split(',').filter((seat) => !unavailableSeats?.includes(seat))
        }

        // Reset any query parameters after they've been used/applied once.
        if (browser) {
          goto('?')
        }

        loading = false
        clearTimeout(timeout)
      })
  }

  $: $selectedShowId && refresh()
</script>

<Grid columns={['3fr', 'minmax(auto, 1fr)']} gap="0">
  <div class="seatplan-wrapper" class:waiting={!$selectedShowId || loading}>
    {#if !$selectedShowId || loading}
      <div class="status">
        <span>{loading ? 'Loading' : 'Select a show to begin'}</span>
      </div>
    {/if}
    <SeatSelection
      showId={$selectedShowId}
      {initialSelection}
      {priceTiers}
      {priceConfiguration}
      {unavailableSeats}
      {allowSelection}
    />
  </div>
  <Cart
    show={$selectedShowId}
    {priceTiers}
    {priceConfiguration}
    text={data.uiConfig.text}
    on:checkout-start={onCheckoutStart}
    on:refresh={refresh}
  />
</Grid>

<style lang="scss">
  .seatplan-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    overflow: auto;
    background: var(--light-2);
    border-bottom: var(--border);
    box-shadow: var(--shadow-inset);
  }

  .status {
    position: absolute;
    z-index: 1;
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
      background: var(--primary);
      border-radius: var(--border-radius-sm);
    }
  }
</style>
