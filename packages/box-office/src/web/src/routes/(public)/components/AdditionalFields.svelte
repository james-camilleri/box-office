<script lang="ts">
  import { TextInput } from '@svelteuidev/core'

  export let name: string
  export let email: string
  export let submitted: boolean
</script>

<div class="additional-fields">
  <TextInput
    bind:value={name}
    name="name"
    label="Name"
    error={!name && submitted && 'Name is required'}
  />
  <TextInput
    bind:value={email}
    name="email"
    label="Email address"
    error={!email && submitted && 'Email is required'}
  />
</div>

<style>
  .additional-fields {
    margin-bottom: var(--xs);
  }
</style>
