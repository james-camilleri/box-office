<script lang="ts">
  import { fade } from 'svelte/transition'
  import uniqueId from 'lodash/uniqueId.js'
  import Exclamation from '@fortawesome/fontawesome-free/svgs/solid/circle-exclamation.svg'
  import FormGroup from './FormGroup.svelte'

  type Validation = (value: string) => string | undefined

  export let name: string
  export let label: string = null
  export let hint: string = null
  export let type: string = 'text'
  export let value: string = ''
  export let optional = false
  export let width: 'short' | 'long' | 'full' = 'short'

  export let validations: Validation[] = []
  export let validate = false
  export let valid = true
  let errorText

  // Default validation for required fields.
  const requiredValidation = (value) =>
    !optional && value == '' && `${label ?? capitalise(name)} is required`

  $: {
    errorText =
      validate &&
      [requiredValidation, ...validations]
        .map((validation) => validation(value))
        .filter((error) => typeof error === 'string')[0] // Show the first error if multiple exist.

    valid = !errorText
  }

  const id = uniqueId('input-')
  if (!name) throw new Error(`Input ${id} requires a name`)

  const capitalise = (string: string) => {
    return `${string.slice(0, 1).toLocaleUpperCase()}${string.slice(1)}`
  }

  // Binding to the value doesn't work if the type can be changed.
  const onChange = (e) => {
    value = e.target.value
  }
</script>

<FormGroup {width}>
  <label for={id}
    >{label ?? capitalise(name)}{#if optional}<span class="optional"
        >optional</span
      >{/if}</label
  >

  {#if hint}<span class="hint">{hint}</span>{/if}
  {#if errorText}
    <span class="error">
      <span class="error-icon">
        <Exclamation />
      </span>
      <span in:fade class="error-text">{errorText}</span>
    </span>
  {/if}

  {#if type === 'textarea'}
    <textarea
      {id}
      {name}
      type="text"
      style={errorText ? '--border-colour: var(--error)' : ''}
      bind:value
    />
  {:else}
    <input
      {id}
      {name}
      {type}
      {value}
      style={errorText ? '--border-colour: var(--error)' : ''}
      on:change={onChange}
      on:keydown={onChange}
    />
  {/if}
</FormGroup>

<style lang="scss">
  textarea {
    max-height: 200px;
  }

  input,
  textarea {
    padding: var(--xxs) var(--xs);
    border: 0;
    border-radius: var(--border-radius);
    outline: none;
    box-shadow: 0 0 0 var(--border-width) var(--border-colour);
    transition: box-shadow var(--transition-fast) ease-in-out;

    &:focus,
    &:hover {
      box-shadow: 0 0 0 var(--border-width) var(--primary);
    }
  }

  .optional {
    padding: 0.1rem 0.3rem;
    margin-inline-start: var(--xs);
    font-size: 0.8em;
    color: var(--background);
    text-transform: uppercase;
    background: var(--neutral);
  }

  .hint {
    font-size: 0.9em;
    color: var(--neutral);
  }

  .error {
    display: flex;
    align-items: center;
  }

  .error-text {
    font-size: 0.9em;
    font-weight: bold;
    color: var(--error);
  }

  .error-icon {
    height: 1em;
    margin-inline-end: var(--xs);
    color: var(--error);

    :global(svg) {
      vertical-align: top;
    }
  }
</style>
