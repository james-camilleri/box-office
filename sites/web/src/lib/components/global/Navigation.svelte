<script lang="ts">
  import Cart from '@fortawesome/fontawesome-free/svgs/solid/cart-shopping.svg'
  import User from '@fortawesome/fontawesome-free/svgs/solid/user.svg'

  import type { RawNavItem } from '$lib/utils/urls'

  import { page } from '$app/stores'
  import { normaliseNavItems } from '$lib/utils/urls'
  import CONFIG from '$lib/config'

  export let items: RawNavItem[] = []

  let navOpen = false
  // There's no way to use bind:this conditionally as of 20/02/2022, so
  // we need to store all refs and just use the first one for focus capture.
  let navItemRefs: HTMLElement[] = []
  let menuButtonRef: HTMLElement = null

  function close() {
    navOpen = false
  }

  function toggle() {
    navOpen = !navOpen
  }

  function handleKeydown(e: KeyboardEvent) {
    // Only handle closing and focus capture on the mobile menu.
    if (!navOpen) return

    if (e.key === 'Escape') {
      close()
    }

    // Capture focus when tabbing.
    if (e.key === 'Tab') {
      if (menuButtonRef === document.activeElement && !e.shiftKey) {
        e.preventDefault()
        navItemRefs[0].focus()
        return
      }

      if (navItemRefs[0] === document.activeElement && e.shiftKey) {
        e.preventDefault()
        menuButtonRef.focus()
        console.log('document.activeElement', document.activeElement)
        return
      }
    }
  }
</script>

<svelte:window on:keydown={handleKeydown} />
<div>
  <nav class:open={navOpen}>
    <ul>
      {#each normaliseNavItems(items) as { text, link }, i}
        <li>
          <a
            class="nav-item"
            class:active={$page.url.pathname === link}
            href={link}
            on:click={close}
            bind:this={navItemRefs[i]}
            sveltekit:prefetch
          >
            {text}
          </a>
        </li>
      {/each}
      {#if CONFIG.SNIPCART.enabled}
        <div class="snipcart-icons">
          <button class="snipcart-checkout nav-item">
            <Cart />
            <span class="screen-reader-only">Shopping cart</span>
          </button>
          <button class="snipcart-customer-signin nav-item">
            <User />
            <span class="screen-reader-only">My account</span>
          </button>
        </div>
      {/if}
    </ul>
  </nav>

  <button
    aria-controls="navigation"
    class="menu-button"
    type="button"
    on:click={toggle}
    bind:this={menuButtonRef}
  >
    <div class="hamburger" class:active={navOpen}>
      <span class="screen-reader-only">Open/close navigation</span>
    </div>
  </button>
</div>

<style lang="scss">
  @use '../../../styles/breakpoints';

  nav {
    // Full-screen mobile navigation.
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1;

    display: flex;
    flex-direction: column;
    overflow: auto;

    font-size: var(--lg);
    background: var(--background);
    opacity: 0.98;

    transition: opacity var(--transition-fast) ease-in-out,
      transform 0s ease-in-out var(--transition-fast);

    &:not(.open) {
      opacity: 0;
      transform: translateY(100%);

      // Undo transformations on desktop menu.
      @media (min-width: breakpoints.$md) {
        opacity: 1;
        transform: none;
      }
    }

    // Desktop layout.
    @media (min-width: breakpoints.$md) {
      position: static;
      margin-right: var(--lg);
      font-size: var(--md);
      opacity: 1;
      transition: none;
    }
  }

  ul {
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin: auto 0;

    // Desktop layout.
    @media (min-width: breakpoints.$md) {
      flex-direction: row;
      align-items: center;
    }
  }

  .nav-item {
    --hover-background: var(--primary);
    --hover-colour: var(--background);
    --active-background: var(--secondary);
    --active-colour: var(--foreground);

    color: var(--foreground);
    text-align: center;
    text-decoration: none;
    overflow-wrap: normal;

    transition: color var(--transition-fast) ease-in-out,
      background-color var(--transition-fast) ease-in-out;

    &:hover,
    &:focus {
      outline: none;
    }
  }

  a {
    display: block;
    padding: var(--lg);

    &:hover,
    &:focus {
      color: var(--hover-colour);
      background: var(--hover-background);
    }

    // Desktop layout.
    @media (min-width: breakpoints.$md) {
      padding: var(--xs) var(--md);
    }
  }

  a.active {
    color: var(--foreground);
    background: var(--secondary);
  }

  .snipcart-icons {
    display: flex;
    align-content: center;
    align-items: center;
    justify-content: center;
    margin-top: var(--xxl);

    @media (min-width: breakpoints.$md) {
      margin-inline-start: var(--lg);
      margin-top: 0;
    }

    > button {
      width: var(--xxl);
      height: var(--xxl);
      padding: 0; // Safari fix. The icons are tiny otherwise.
      margin: 0 var(--sm);

      cursor: pointer;
      background: none;
      border: 0;

      // Shrink buttons on desktop navigation.
      @media (min-width: breakpoints.$md) {
        width: var(--lg);
        height: var(--lg);
      }
    }

    > button:hover,
    button:focus {
      color: var(--hover-background);
    }
  }

  .menu-button {
    --size: 4rem;
    --padding: var(--md);
    --button-colour: var(--primary);
    --icon-colour: var(--secondary);

    // Used when tabbing to the menu button, for accessibility.
    --focus-ring-colour: var(--secondary);

    // You can probably leave these alone.
    --bar-width: calc(var(--size) - (var(--padding) * 2));
    --bar-height: calc(var(--bar-width) / 5);

    position: fixed;
    right: var(--lg);
    bottom: var(--lg);
    z-index: 2;
    width: var(--size);
    height: var(--size);
    padding: var(--padding);

    background: var(--button-colour);
    border: 0;
    border-radius: 100%;
    transition: transform var(--transition-fast) ease-in-out;

    &:hover,
    &:focus {
      transform: scale(1.2);
    }

    // Add focus ring for rare cases when button is tabbed into.
    &:focus {
      outline: 5px solid var(--focus-ring-colour);
    }

    &:focus:not(:focus-visible) {
      outline: none;
    }

    // Scale button back down after it's cliccked on.
    &:focus:not(:focus-visible):not(:hover) {
      transform: scale(1);
    }

    // Hide the button on desktop.
    @media (min-width: breakpoints.$md) {
      display: none;
    }
  }

  .hamburger {
    top: 50%;
    margin-top: calc(var(--bar-height) / -2);

    transition-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);
    transition-duration: 0.22s;

    &,
    &::before,
    &::after {
      position: absolute;
      width: var(--bar-width);
      height: var(--bar-height);
      background-color: var(--icon-colour);
      border-radius: var(--bar-height);
      transition: transform var(--transition-fast) ease;
    }

    &::before,
    &::after {
      display: block;
      content: '';
    }

    &::before {
      top: calc(var(--bar-height) * -1.5);
      transition: top 0.1s 0.25s ease-in, opacity 0.1s ease-in;
    }

    &::after {
      bottom: calc(var(--bar-height) * -1.5);
      transition: bottom 0.1s 0.25s ease-in,
        transform 0.22s cubic-bezier(0.55, 0.055, 0.675, 0.19);
    }
  }

  // Animations based on "Hamburgers" by Jonathan Suh @jonsuh
  // @link https://github.com/jonsuh/hamburgers
  .hamburger.active {
    transition-delay: 0.12s;
    transition-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
    transform: rotate(225deg);

    &::before {
      top: 0;
      opacity: 0;
      transition: top 0.1s ease-out, opacity 0.1s 0.12s ease-out;
    }

    &::after {
      bottom: 0;
      transition: bottom 0.1s ease-out,
        transform 0.22s 0.12s cubic-bezier(0.215, 0.61, 0.355, 1);
      transform: rotate(-90deg);
    }
  }
</style>
