<script lang="ts">
  import { createEventDispatcher, getContext } from 'svelte'

  import { selection, unavailable } from './stores'
  import { SECTION_ID } from './Section.svelte'
  import { ROW_ID } from './Row.svelte'

  export let number: string
  export let x: number
  export let y: number

  $: disabled = $unavailable.has(id)
  $: selected = $selection.has(id)

  const section = getContext(SECTION_ID) ?? ''
  const row = getContext(ROW_ID) ?? ''
  const id = [section, row, number].filter(Boolean).join('-')

  function toggleSelection() {
    const event = selected ? 'deselected' : 'selected'
    console.log(`${id} ${event}`)

    selected ? $selection.delete(id) : $selection.add(id)
    $selection = $selection
  }

  // const dispatch = createEventDispatcher()
  // function dispatchSelectionEvent() {
  //   const event = selected ? 'deselected' : 'selected'
  //   console.log(`${id} ${event}`)
  //   dispatch(event, id)
  // }
</script>

<circle
  cx={x}
  cy={y}
  r="15"
  class:disabled
  class:selected
  on:click={toggleSelection}
  on:keypress={toggleSelection}
/>

<style lang="scss">
  circle {
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
