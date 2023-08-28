<script lang="ts">
  import SeatPlan from 'seat-plan'

  import { setContext } from 'svelte'
  import { writable } from 'svelte/store'

  import type { PriceConfiguration, PriceTier, Seat as SeatType } from '$shared/types'

  import Grid from '$lib/components/layout/Grid.svelte'

  import { ALLOW_SELECTION } from './context.js'
  import PriceTiers from './PriceTiers.svelte'
  import Section from './Section.svelte'
  import Row from './Row.svelte'
  import Seat from './Seat.svelte'

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

<div class="seatplan" style={colours}>
  <Grid>
    <PriceTiers {priceTiers} />
    <SeatPlan />
  </Grid>
</div>

<style lang="scss">
  // TODO: Move these somewhere where they'll work.
  .seatplan svg {
    max-height: 85vh;
  }

  text {
    font: normal 30px sans-serif;
    color: var(--foreground);
  }
</style>
