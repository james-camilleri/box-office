<script lang="ts">
  import type { PageData } from './$types.js'
  import SeatPlan from '$lib/components/seatplan/SeatPlan.svelte'
  import { page } from '$app/stores'

  export let data: PageData
  const { priceTiers, priceConfiguration, shows } = data.configuration

  let showId = shows[0]._id
  let unavailableSeats: string[] | undefined

  $: {
    unavailableSeats = undefined

    fetch(`${$page.url.origin}/api/seats/${showId}`)
      .then((response) => response.json())
      .then(({ unavailable }) => {
        unavailableSeats = unavailable
      })
  }
</script>

<select bind:value={showId}>
  {#each shows as show}
    {@const date = new Date(show.date)}
    <option value={show._id}>
      {date.toLocaleDateString()}
      {date.toLocaleTimeString().replace(/:00$/, '')}
    </option>
  {/each}
</select>

<SeatPlan {showId} {priceTiers} {priceConfiguration} {unavailableSeats} />
