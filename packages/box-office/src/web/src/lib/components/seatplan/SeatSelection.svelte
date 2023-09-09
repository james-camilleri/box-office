<script lang="ts">
  import SeatPlan from 'seat-plan'

  import { setContext } from 'svelte'
  import { writable } from 'svelte/store'
  import { ZoomSvg } from 'svelte-parts/zoom'

  import type { PriceConfiguration, PriceTier, Seat as SeatType } from '$shared/types'

  import Grid from '$lib/components/layout/Grid.svelte'

  import { ALLOW_SELECTION } from './context.js'
  import PriceTiers from './PriceTiers.svelte'

  import { pricing, selection, unavailable } from './stores.js'

  export let priceTiers: PriceTier[]
  export let priceConfiguration: PriceConfiguration
  export let showId: string
  export let unavailableSeats: string[] | undefined
  export let allowSelection = true

  const _allowSelection = writable(allowSelection)
  $: $_allowSelection = allowSelection
  setContext(ALLOW_SELECTION, _allowSelection)

  $: $pricing = new Map(
    Object.entries({
      ...priceConfiguration.default,
      ...priceConfiguration[showId],
    }),
  )

  $: {
    $unavailable = !unavailableSeats ? unavailableSeats : new Set(unavailableSeats)
    $selection = new Map<string, SeatType>()
  }

  $: colours = priceTiers.map(({ _id, colour }) => `--pricing-${_id}: ${colour}`).join(';')
</script>

<div class="seat-plan" style={colours}>
  <PriceTiers {priceTiers} />
  <ZoomSvg viewBox="0 0 1000 1000">
    <SeatPlan />
  </ZoomSvg>
</div>

<style lang="scss">
  .seat-plan {
    width: 100%;
    height: 100%;
    position: relative;
  }
</style>
