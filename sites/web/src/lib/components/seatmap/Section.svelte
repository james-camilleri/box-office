<script lang="ts" context="module">
  export const SECTION_ID = Symbol()
</script>

<script lang="ts">
  import { setContext } from 'svelte'

  export let id: string

  setContext(SECTION_ID, id)
</script>

<g>
  <slot />
</g>

<style lang="scss">
</style>
