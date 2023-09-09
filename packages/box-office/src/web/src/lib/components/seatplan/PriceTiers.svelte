<script lang="ts">
  import type { PriceTier } from '$shared/types'

  export let priceTiers: PriceTier[]
</script>

<div class="price-tiers">
  {#each priceTiers as { colour, name, price }}
    <div class="price-tier">
      <div class="key" style:--colour={colour} />
      <div class="price">€{price}</div>
    </div>
  {/each}
</div>

<style>
  .price-tiers {
    position: absolute;
    top: var(--lg);
    left: 50%;
    display: flex;
    flex-wrap: wrap;
    gap: var(--xl);
    padding: var(--md);
    margin: 0 auto;
    background: var(--light-3);
    border-radius: var(--border-radius);
    transform: translateX(-50%);
  }

  .price-tier {
    display: flex;
    gap: var(--xxs);
    align-items: center;
  }

  .key {
    width: 1.2rem;
    height: 1.2rem;
    background: var(--colour);
    border-radius: 50%;
  }

  .price {
    font-weight: bold;
  }
</style>
