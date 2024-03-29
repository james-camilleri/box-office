<script lang="ts">
  import type { Writable } from 'svelte/store'

  import { getContext } from 'svelte'

  import { ALLOW_SELECTION, PRE_SELECTION, ROW_ID, SECTION_ID } from './context.js'
  import { pricing, selection, unavailable } from './stores.js'

  export let number: number | string
  export let x: number | undefined = undefined
  export let y: number | undefined = undefined

  if (!$$slots.default && (x == null || y == null)) {
    throw Error('Position must be defined if seat SVG elements not passed as props.')
  }

  const section: string = getContext(SECTION_ID) ?? ''
  const row: string = getContext(ROW_ID) ?? ''
  const id = [section, row, number].filter(Boolean).join('-')

  const preSelection = getContext(PRE_SELECTION) as Writable<string[] | undefined>
  const allowSelection = getContext(ALLOW_SELECTION) as Writable<boolean>

  $: disabled =
    !$unavailable ||
    $unavailable.has(id) ||
    $unavailable.has(`${section}-${row}`) ||
    $unavailable.has(`${section}`)
  $: priceTier =
    $pricing.get(id) ??
    $pricing.get(`${section}-${row}`) ??
    $pricing.get(`${section}`) ??
    $pricing.get('default')

  $: $preSelection?.includes(id) && toggleSelection()
  $: selected = $selection.has(id)

  function toggleSelection() {
    if (disabled || !$allowSelection) {
      return
    }

    selected
      ? $selection.delete(id)
      : $selection.set(id, { _id: id, row: `${section}-${row}`, section })
    $selection = $selection
  }
</script>

<g
  style:--seat-colour="var(--pricing-{priceTier})"
  class:disabled
  class:selected
  on:click={toggleSelection}
  on:keypress={toggleSelection}
>
  <slot>
    <circle cx={x} cy={y} r="15" />
  </slot>
</g>

<style lang="scss">
  g {
    cursor: pointer;
    fill: var(--seat-colour);
    transition: fill var(--transition-medium) ease-in-out;

    &.disabled {
      cursor: not-allowed;
      fill: var(--disabled);
    }

    &.selected {
      fill: var(--selected);
      stroke: var(--dark-3);
      stroke-width: 7px;
    }

    &:hover:not(.disabled) {
      fill: var(--selected);
      transition: fill var(--transition-fast) ease-in-out;
    }
  }
</style>
