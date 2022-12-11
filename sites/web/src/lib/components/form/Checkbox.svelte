<script lang="ts">
  // TODO: Style disabled checkbox.
  // TODO: Checkbox groups / multiple checkboxes.
  import uniqueId from 'lodash/uniqueId.js'

  export let name: string
  export let label: string = null
  export let hint: string = null
  export let value: boolean = false
  export let disabled: boolean

  const id = uniqueId('checkbox-')
  if (!name) throw new Error(`Checkbox ${id} requires a name`)

  const capitalise = (string: string) => {
    return `${string.slice(0, 1).toLocaleUpperCase()}${string.slice(1)}`
  }
</script>

<div>
  <label class:disabled>
    <input type="checkbox" {name} {disabled} bind:checked={value} />
    <div>
      {label ?? capitalise(name)}
      {#if hint}<span class="hint">{hint}</span>{/if}
    </div>
  </label>
</div>

<style lang="scss">
  // Based on:
  // @link https://moderncss.dev/pure-css-custom-checkbox-style/

  label {
    --checkbox-size: 1.5rem;

    display: grid;
    grid-template-columns: var(--checkbox-size) auto;
    gap: 1em;
    line-height: 1;
    cursor: pointer;

    // We don't need this for now.
    // + label {
    //   margin-top: var(--gutter);
    // }

    &.disabled {
      cursor: not-allowed;
    }

    div {
      display: flex;
      flex-direction: column;
    }
  }

  input {
    // Remove most all native input styles
    // (Safari only supports this with a prefix until v15.3.
    // stylelint-disable-next-line
    -webkit-appearance: none;
    appearance: none;

    display: grid;
    place-content: center;
    width: var(--checkbox-size);
    height: var(--checkbox-size);
    margin: 0; // Not removed via appearance.
    cursor: pointer;
    background-color: var(--background); // iOS < 15 fix

    border: 0;
    border-radius: var(--border-radius);
    outline: none;
    box-shadow: 0 0 0 var(--border-width) var(--border-colour);

    transition: box-shadow var(--transition-fast) ease-in-out,
      background var(--transition-fast) ease-in-out;
    transform: translateY(calc(var(--border-width) / -1.5)); // Magic number.

    &::before {
      width: calc(var(--checkbox-size) - 0.5em);
      height: calc(var(--checkbox-size) - 0.5em);
      clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%);
      content: '';
      background-color: var(--foreground);
      opacity: 0;
      transition: transform var(--transition-fast) ease-in-out,
        opacity var(--transition-fast) ease-in-out;
      transform: scale(0.5);
    }
  }

  input:checked {
    background-color: var(--primary);

    &::before {
      opacity: 1;
      transform: scale(1);
    }
  }

  input:focus {
    box-shadow: 0 0 0 var(--border-width) var(--primary);
  }

  // input:disabled {
  //   --form-control-color: var(--form-control-disabled);

  //   color: var(--form-control-disabled);
  //   cursor: not-allowed;
  // }

  .hint {
    margin-top: var(--xs);
    font-size: 0.9em;
    color: var(--neutral);
  }
</style>
