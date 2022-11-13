<script lang="ts">
  export let width: 'short' | 'long' | 'full' = 'short'

  const widths = {
    short: '20rem',
    long: '30rem',
  }
</script>

<div style:max-width={widths[width]}>
  <slot />
</div>

<style lang="scss">
  div {
    display: flex;
    flex-direction: column;
    min-width: 0;

    > :global(:last-child) {
      display: block;
      margin-top: var(--xs);
    }
  }
</style>
