<script lang="ts">
  import type { Show } from '$shared/types'

  import { NativeSelect } from '@svelteuidev/core'

  import { getZonedDate, getZonedTime } from '$shared/utils'

  export let name: string
  export let logo: string | undefined = undefined
  export let selected: string | undefined = undefined
  export let shows: Show[]
  export let timeZone: string

  $: selectItems = shows.map((show) => ({
    value: show._id,
    label: `${getZonedDate(show.date, timeZone)} ${getZonedTime(show.date, timeZone)}`,
  }))
</script>

<header>
  <h1 class="title">
    {#if logo}
      <img src="{logo}?h=300&auto=format" alt={name} />
    {:else}
      {name}
    {/if}
  </h1>
  <div class="select-wrapper">
    <NativeSelect
      bind:value={selected}
      showChevron
      data={selectItems}
      variant="filled"
      placeholder="Select a show to begin"
    />
  </div>
</header>

<style lang="scss">
  header {
    display: flex;
    flex-wrap: wrap;
    gap: var(--md);
    padding: var(--md);
    background: var(--secondary);
  }

  .title {
    margin: 0 auto 0 0;
  }

  img {
    max-width: 250px;
  }

  .select-wrapper {
    flex: 1 0 auto;
    align-self: center;
    width: 300px;
    max-width: 500px;
    cursor: pointer;
  }
</style>
