<script lang="ts">
  // import Logo from '../../../assets/images/logo.svg'
  import Navigation from './Navigation.svelte'
</script>

<header>
  <!-- Remove the tabindex="-1" if there is no explicit *home* link in the navigation. -->
  <a class="logo" href="/" tabindex="-1">
    <!-- TODO: Uncomment this when the logo asset has been added. -->
    <!-- <Logo /> -->
  </a>
  <Navigation
    items={[
      { text: 'home', link: '/' },
      { text: '(typography test)', link: '/typography' },
    ]}
  />
</header>

<style lang="scss">
  @use '../../../styles/breakpoints';

  header {
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--md);
    margin-bottom: var(--lg);
    background: var(--background);
    border-bottom: var(--border);

    // No need for the header to be sticky on mobile, it wastes screen estate.
    @media (min-width: breakpoints.$md) {
      position: sticky;
      top: 0;
    }
  }

  .logo {
    display: block;
    width: 100%;
    max-height: 5rem;

    &:hover {
      background: none;
    }

    @media (min-width: breakpoints.$md) {
      max-width: 100px;
    }
  }
</style>
