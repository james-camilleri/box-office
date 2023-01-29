<script lang="ts">
  import { getContext } from 'svelte'

  import { pricing, selection, unavailable } from './stores.js'
  import { SECTION_ID } from './Section.svelte'
  import { ROW_ID } from './Row.svelte'

  export let number: number | string
  export let x: number | undefined = undefined
  export let y: number | undefined = undefined

  if (!$$slots.default && (x == null || y == null)) {
    throw Error('Position must be defined if seat SVG elements not passed as props.')
  }

  const section = getContext(SECTION_ID) ?? ''
  const row = getContext(ROW_ID) ?? ''
  const id = [section, row, number].filter(Boolean).join('-')

  $: selected = $selection.has(id)
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

  function toggleSelection() {
    if (disabled) {
      return
    }

    selected ? $selection.delete(id) : $selection.add(id)
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
    color: var(--seat-colour);
    cursor: pointer;
    transition: color var(--transition-medium) ease-in-out;

    &.disabled {
      color: var(--disabled);
      cursor: not-allowed;
    }

    &.selected {
      color: var(--selected);
    }

    &:hover {
      color: var(--selected);
      transition: color var(--transition-fast) ease-in-out;
    }
  }
</style>
