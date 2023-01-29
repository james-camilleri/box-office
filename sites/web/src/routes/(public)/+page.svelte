<script lang="ts">
  import type { PageData } from './$types.js'
  import SeatPlan from '$lib/components/seatplan/SeatPlan.svelte'
  import { page } from '$app/stores'
  import ShowSelection from './components/ShowSelection.svelte'

  export let data: PageData
  const { priceTiers, priceConfiguration, shows, timeZone } = data.configuration

  let selectedShowId: string | undefined = undefined
  let unavailableSeats: string[] | undefined = undefined
  let loading = false

  $: {
    unavailableSeats = undefined

    if (selectedShowId) {
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
  }
</script>

<ShowSelection bind:selected={selectedShowId} {shows} {timeZone} />
<div class="seatplan-wrapper" class:waiting={!selectedShowId || loading}>
  {#if !selectedShowId || loading}
    <div class="status">
      <span>{loading ? 'Loading' : 'Select a show to begin'}</span>
    </div>
  {/if}
  <div class="seatplan">
    <SeatPlan showId={selectedShowId} {priceTiers} {priceConfiguration} {unavailableSeats} />
  </div>
</div>

<style lang="scss">
  .seatplan-wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }

  .seatplan {
    width: 100%;
    padding: var(--md);
  }

  .status {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    padding: var(--md);
    color: var(--light);

    background: rgb(0 0 0 / 70%);

    span {
      padding: var(--sm) var(--lg);
      font-size: var(--xl);
      text-transform: uppercase;
      background: var(--dark);
    }
  }
</style>
