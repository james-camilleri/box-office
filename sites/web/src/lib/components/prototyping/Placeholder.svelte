<script lang="ts">
  export let height = 250
  export let caption = ''
</script>

<div class="placeholder" style:--height={`${height}px`}>
  <div class="diagonals" />
  {#if caption}
    <strong>{caption}</strong>
  {/if}
</div>

<style lang="scss">
  .placeholder {
    --gradient: rgb(0 0 0 / 0%) calc(50% - (var(--border-width) / 2)),
      var(--border-colour) calc(50% - (var(--border-width) / 2) + 1px),
      var(--border-colour) calc(50% + (var(--border-width) / 2) - 1px),
      rgb(0 0 0 / 0%) calc(50% + (var(--border-width) / 2));

    display: flex;
    flex-direction: column;
    width: 100%;
    height: var(--height);
    border: var(--border);
  }

  .diagonals {
    position: relative;
    flex: 1;
    background: linear-gradient(to top left, var(--gradient));

    &::before,
    &::after {
      position: absolute;
      width: 100%;
      height: 100%;
      content: '';
    }

    &::after {
      background: linear-gradient(to top right, var(--gradient));
    }

    &::before {
      background: var(--border-colour);
      opacity: 0.05;
    }
  }

  strong {
    padding: var(--xxs);
    font-size: var(--sm);
    font-style: normal;
    color: var(--background);
    text-transform: uppercase;
    background: var(--border-colour);
    border-top: var(--border);
  }
</style>
