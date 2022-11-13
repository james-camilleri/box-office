<script lang="ts">
  import '../styles/global.scss'

  import type { PageData } from './$types'

  import { setContext } from 'svelte'
  import CONFIG from '$lib/config'
  import Header from '$lib/components/global/Header.svelte'
  import Footer from '$lib/components/global/Footer.svelte'
  import PageTransition from '$lib/components/transition/PageTransition.svelte'

  setContext('CONFIG', CONFIG)

  export let data: PageData
  $: ({ url } = data)
</script>

<div class="grid">
  <Header />
  <main>
    <PageTransition {url}>
      <slot />
    </PageTransition>
  </main>
  <Footer />
</div>

<style>
  .grid {
    display: grid;
    grid-template-rows: auto 1fr auto;
    height: 100vh;
    overflow-x: hidden;
    overflow-y: auto;
  }

  main {
    position: relative;
    margin: 0 var(--gutter);
  }
</style>
