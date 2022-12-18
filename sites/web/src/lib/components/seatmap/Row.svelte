<script lang="ts" context="module">
  export const ROW_ID = Symbol()
</script>

<script lang="ts">
  import { setContext } from 'svelte'
  import Seat from './Seat.svelte'

  export let id: string
  export let seats: { x: number; y: number }[] = []
  export let startFrom = 1

  setContext(ROW_ID, id)
</script>

<g>
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
