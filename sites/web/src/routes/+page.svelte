<script lang="ts">
  import type { PageData } from './$types'
  import SeatMap from '$lib/components/seatmap/SeatMap.svelte'

  export let data: PageData
  const { priceTiers, priceConfiguration, defaultPriceTier, shows } = data.configuration
  const show = shows[0]
</script>

<SeatMap {show} {priceTiers} {priceConfiguration} {defaultPriceTier} />
