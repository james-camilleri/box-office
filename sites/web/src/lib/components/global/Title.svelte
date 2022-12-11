<script lang="ts">
  import CONFIG from '$lib/config'

  export let text: string
  export let subtitle: string = null
  export let hidden: boolean = false

  const prefix = CONFIG.GENERAL.siteTitle
</script>

<svelte:head>
  <title>{prefix ? `${prefix} – ` : ''}{text}</title>
</svelte:head>

<h1 class:screen-reader-only={hidden}>{text}</h1>
{#if subtitle}
  <h2 class:screen-reader-only={hidden}>{subtitle}</h2>
{/if}

<style lang="scss">
  // Remove default (large) spacing before subtitle.
  h2 {
    margin-top: 0;
  }
</style>
