<script lang="ts">
  import { setContext } from 'svelte'

  import { ROW_ID } from './context.js'
  import Seat from './Seat.svelte'

  export let id: string
  export let seats: { x: number; y: number }[] | number
  export let x: number | undefined = undefined
  export let y: number | undefined = undefined
  export let startFrom = 1
  export let transform: string | undefined = undefined

  setContext(ROW_ID, id)

  // Generate row of seats.
  $: {
    if (typeof seats === 'number' && x != null && y !== null) {
      seats = Array.from({ length: seats }, (_, i) => ({
        x: x + i * 40,
        y,
      }))
    }
  }
</script>

<g {transform}>
  <slot>
    <text x={seats[0].x - 50} y={seats[0].y + 10}>{id}</text>
    {#each seats as { x, y }, i}
      <Seat number={startFrom + i} {x} {y} />
    {/each}
    <text x={seats[seats.length - 1].x + 30} y={seats[seats.length - 1].y + 10}>{id}</text>
  </slot>
</g>

<style lang="scss">
  text {
    font: normal 30px sans-serif;
  }
</style>
