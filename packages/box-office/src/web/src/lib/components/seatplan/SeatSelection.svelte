<script lang="ts">
  import type { PriceConfiguration, PriceTier, Seat } from '$shared/types'

  import SeatPlan from 'seat-plan'
  import { setContext } from 'svelte'
  import { readable, writable } from 'svelte/store'
  import { ZoomSvg } from 'svelte-parts/zoom'

  import PriceTiers from './PriceTiers.svelte'
  import { ALLOW_SELECTION, PRE_SELECTION } from './context.js'
  import { pricing, unavailable } from './stores.js'

  export let priceTiers: PriceTier[]
  export let priceConfiguration: PriceConfiguration
  export let showId: string
  export let unavailableSeats: string[] | undefined
  export let allowSelection = true
  export let initialSelection: string[] | undefined

  const _allowSelection = writable(allowSelection)
  $: $_allowSelection = allowSelection
  setContext(ALLOW_SELECTION, _allowSelection)

  const _initialSelection = writable<string[] | undefined>(initialSelection)
  $: $_initialSelection = initialSelection
  setContext(PRE_SELECTION, _initialSelection)

  $: $pricing = new Map(
    Object.entries({
      ...priceConfiguration.default,
      ...priceConfiguration[showId],
    }),
  )

  $: {
    $unavailable = !unavailableSeats ? unavailableSeats : new Set(unavailableSeats)
  }

  $: colours = priceTiers.map(({ _id, colour }) => `--pricing-${_id}: ${colour}`).join(';')
</script>

<div class="seat-plan" style={colours}>
  <PriceTiers {priceTiers} />
  <ZoomSvg viewBox="0 0 1000 600">
    <SeatPlan />
  </ZoomSvg>
</div>

<style lang="scss">
  .seat-plan {
    position: relative;
    width: 100%;
    height: 100%;
  }
</style>
