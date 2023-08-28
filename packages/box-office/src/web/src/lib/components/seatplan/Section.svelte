<script lang="ts">
  import { setContext } from 'svelte'

  import { SECTION_ID } from './context.js'

  export let id: string

  setContext(SECTION_ID, id)
</script>

<g>
  <slot />
</g>
