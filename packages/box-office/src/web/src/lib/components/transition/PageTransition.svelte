<script lang="ts">
  import { fade } from 'svelte/transition'

  export let url: URL | undefined = undefined
  const duration = 70
</script>

{#key url?.pathname}
  <div in:fade={{ duration }} out:fade={{ duration }}>
    <slot />
  </div>
{/key}

<style>
  /* Since two divs exist simultaneously while transitioning in and out,
  the page height jumps around significantly as the new div is added to the
  bottom of the container and animated in. By positioning the previous div
  absolutely when it is not the only one in the component, the page will
  instantly adjust to the height of the new content without too much
  jumping about. */
  div:first-child:not(:last-child) {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    z-index: -1;
    height: auto;
  }
</style>
