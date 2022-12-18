<script lang="ts">
  import type { PageData } from './$types.js'
  import SeatMap from '$lib/components/seatmap/SeatMap.svelte'
  import { page } from '$app/stores'

  export let data: PageData
  const { priceTiers, priceConfiguration, defaultPriceTier, shows } = data.configuration

  let show = shows[0]._id
  let unavailableSeats: string[] | undefined

  $: {
    unavailableSeats = undefined

    fetch(`${$page.url.origin}/api/seats/${show}`)
      .then((response) => response.json())
      .then(({ unavailable }) => {
        unavailableSeats = unavailable
      })
  }
</script>

<select bind:value={show}>
  {#each shows as show}
    {@const date = new Date(show.date)}
    <option value={show._id}>
      {date.toLocaleDateString()}
      {date.toLocaleTimeString().replace(/:00$/, '')}
    </option>
  {/each}
</select>

<SeatMap {show} {priceTiers} {priceConfiguration} {defaultPriceTier} {unavailableSeats} />
