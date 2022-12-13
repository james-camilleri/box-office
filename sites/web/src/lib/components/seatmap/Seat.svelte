<script lang="ts">
  import { createEventDispatcher, getContext } from 'svelte'

  import { pricing, selection, unavailable } from './stores'
  import { SECTION_ID } from './Section.svelte'
  import { ROW_ID } from './Row.svelte'

  export let number: string
  export let x: number | undefined = undefined
  export let y: number | undefined = undefined

  if (!$$slots.default && (x == null || y == null)) {
    throw Error('Position must be defined if seat SVG elements not passed as props.')
  }

  const section = getContext(SECTION_ID) ?? ''
  const row = getContext(ROW_ID) ?? ''
  const id = [section, row, number].filter(Boolean).join('-')

  $: disabled = $unavailable.has(id)
  $: selected = $selection.has(id)
  $: priceTier =
    $pricing.get(id) ??
    $pricing.get(`${section}-${row}`) ??
    $pricing.get(`${section}`) ??
    $pricing.get('default')

  function toggleSelection() {
    if (disabled) {
      return
    }

    const event = selected ? 'deselected' : 'selected'
    console.log(`${id} ${event}`)

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
    cursor: pointer;
    color: var(--seat-colour);

    &.disabled {
      cursor: not-allowed;
      color: var(--disabled);
    }

    &.selected {
      color: var(--selected);
    }
  }
</style>
