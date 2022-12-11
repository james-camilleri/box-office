<script lang="ts">
  import { get } from '$lib/utils/get'
  import Button from './Button.svelte'
  import type { Product } from '$lib/types/collections'

  export let product: Product

  function onAddToCart() {
    // Add any secondary functions, like analytics, here.
  }

  let dataAttributes = {
    'item-id': product._id,
    'item-name': product.name,
    'item-description': product.shortDescription,
    'item-image': get.thumbnailUrl(product.image),
    'item-price': product.price,
    'item-metadata': JSON.stringify(product.metadata),
  }
</script>

<Button
  primary
  class="snipcart-add-item"
  on:click={onAddToCart}
  {dataAttributes}
>
  <slot />
</Button>
