<script lang="ts">
  import type { Show } from 'shared/types'
  import Select from 'svelte-select'
  import { getZonedDate, getZonedTime } from 'shared/utils'

  export let selected: string | undefined = undefined
  export let shows: Show[]
  export let timeZone: string

  $: selectItems = shows.map((show) => ({
    value: show._id,
    label: `${getZonedDate(show.date, timeZone)} ${getZonedTime(show.date, timeZone)}`,
  }))
</script>

<header>
  <h1 class="title">CHICAGO</h1>
  <div class="select-wrapper">
    <Select
      bind:justValue={selected}
      showChevron
      items={selectItems}
      clearable={false}
      placeholder="Select a show to begin"
    />
  </div>
</header>

<style lang="scss">
  header {
    display: flex;
    flex-wrap: wrap;
    gap: var(--sm);
    padding: var(--md);
    background: var(--light);
    box-shadow: 0 var(--xs) var(--lg) var(--dark);
  }

  .title {
    margin: 0 auto 0 0;
  }

  .select-wrapper {
    flex: 1 0 auto;
    width: 300px;
    max-width: 500px;
  }
</style>
