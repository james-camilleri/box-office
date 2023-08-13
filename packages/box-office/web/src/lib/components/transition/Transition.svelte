<script lang="ts">
  import { fade } from 'svelte/transition'

  export let order = 0

  const duration = 300
  const delay = 100 * order
</script>

<div in:fade={{ duration, delay }}>
  <slot />
</div>
