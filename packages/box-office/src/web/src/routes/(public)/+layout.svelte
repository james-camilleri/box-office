<script lang="ts">
  import '../../styles/global.scss'

  import type { PageData } from './$types.js'

  import ShowSelection from './components/ShowSelection.svelte'
  import { selectedShowId } from './state/selected-show.js'

  export let data: PageData
  const { ticketConfig, uiConfig } = data
</script>

<main style:--primary={uiConfig.primaryColour} style:--secondary={uiConfig.secondaryColour}>
  <ShowSelection
    bind:selected={$selectedShowId}
    name={ticketConfig.showName}
    logo={uiConfig.logoSrc}
    shows={ticketConfig.shows}
    timeZone={ticketConfig.timeZone}
  />
  <slot />
</main>

<style>
  main {
    position: relative;
    display: grid;
    grid-template-rows: auto 1fr;
    width: 100vw;
    height: 100vh;
    overflow-x: hidden;
    overflow-y: auto;
  }
</style>
