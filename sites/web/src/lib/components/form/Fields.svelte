<script lang="ts">
  import type { Field } from '$lib/types/forms'
  import Checkbox from './Checkbox.svelte'
  import Input from './Input.svelte'

  export let validate = false
  export let fieldInfo: Field[] = []
</script>

{#each fieldInfo as field}
  {#if typeof field.type !== 'string'}
    <svelte:component
      this={field.type}
      {...field}
      {validate}
      bind:value={field.value}
      bind:valid={field.valid}
    />
  {:else if field.type === 'checkbox'}
    <Checkbox
      {...field}
      {validate}
      bind:value={field.value}
      bind:valid={field.valid}
    />
  {:else}
    <Input
      {...field}
      {validate}
      bind:value={field.value}
      bind:valid={field.valid}
    />
  {/if}
{/each}
