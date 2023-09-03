<script lang="ts">
  import { setContext } from 'svelte'

  import { SECTION_ID } from './context.js'

  export let id: string
  export let transform?: string | undefined

  setContext(SECTION_ID, id)
</script>

<g {transform}>
  <slot />
</g>
