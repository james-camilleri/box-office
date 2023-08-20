<script lang="ts">
  import '../../styles/global.scss'
</script>

<main class="grid">
  <slot />
</main>

<style>
  .grid {
    display: grid;
    grid-template-rows: auto 1fr;
    height: 100vh;
    overflow-x: hidden;
    overflow-y: auto;
  }

  main {
    position: relative;
  }
</style>
