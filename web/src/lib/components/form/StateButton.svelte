<script lang="ts" context="module">
  export const STATE = {
    IDLE: 'idle',
    WAITING: 'waiting',
    ERROR: 'error',
    SUCCESS: 'success',
  } as const

  export type State = typeof STATE[keyof typeof STATE]

  export interface StatusMessages {
    [STATE.WAITING]?: string
    [STATE.ERROR]?: string
    [STATE.SUCCESS]?: string
  }
</script>

<script lang="ts">
  import Exclamation from '@fortawesome/fontawesome-free/svgs/solid/circle-exclamation.svg'
  import Check from '@fortawesome/fontawesome-free/svgs/solid/circle-check.svg'
  import { Jumper } from 'svelte-loading-spinners'

  import Button from './Button.svelte'

  export let primary = false
  export let disabled = false
  export let linkTo: string = null
  export let state: State = STATE.IDLE
  export let messages: StatusMessages = {}
</script>

<Button
  {primary}
  {disabled}
  {linkTo}
  info={state === STATE.WAITING}
  success={state === STATE.SUCCESS}
  error={state === STATE.ERROR}
  on:click
>
  {#if state === STATE.IDLE || !messages[state]}
    <slot />
  {:else}
    {messages[state]}
  {/if}

  {#if state === STATE.WAITING}
    <span class="icon">
      <Jumper size="1.5" unit="em" color="var(--background)" duration="1s" />
    </span>
  {/if}
  {#if state === STATE.SUCCESS}
    <span class="icon">
      <Check />
    </span>
  {/if}
  {#if state === STATE.ERROR}
    <span class="icon">
      <Exclamation />
    </span>
  {/if}
</Button>

<style lang="scss">
  .icon {
    height: 1em;
    margin-inline-start: var(--xs);

    :global(svg) {
      vertical-align: baseline;
    }
  }
</style>
