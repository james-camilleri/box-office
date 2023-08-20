<script>
  import '../styles/global.scss'

  import { page } from '$app/stores'

  const is404 = $page.status === 404

  const message = is404
    ? "The page you're trying to access doesn't exist."
    : 'Something has gone terribly wrong.'

  const instructions = is404
    ? "Please check that you've entered the correct URL"
    : 'Please let us know on info@thegods.mt'
</script>

<div class="message">
  <h1>Oh no<span class="red">.</span></h1>
  <h2>{message}</h2>
  <div>{instructions}</div>
</div>

<style lang="scss">
  :global(html) {
    // TODO: Deal with this abomination.
    --background: rgb(18 18 18) !important;

    margin: 0;
  }

  :global(body) {
    display: flex;
    place-items: center;
    height: 100vh;
    margin: 0;
    // background: rgb(18 18 18);
    background-repeat: no-repeat;
  }

  .message {
    --red: rgb(255 0 60);
    --grey: rgb(33 33 33);
    --border: rgb(120 120 120);
    --background: rgb(18 18 18);
    --border-radius: 1px;

    position: relative;
    padding: 1.5rem;
    margin: 0 auto;
    color: rgb(255 255 255);
    background: var(--grey);
    border: solid 1px var(--border);
    border-radius: var(--border-radius);
    box-shadow: 2px 2px 5px var(--background);

    &::after {
      position: absolute;
      top: 0.5rem;
      left: 0.5rem;
      z-index: -1;
      display: block;
      width: 100%;
      height: 100%;
      content: '';
      background: var(--red);
      border-radius: var(--border-radius);
    }
  }

  h1 {
    margin: 0 0 0.5rem;
    font-variation-settings: 'wght' 600;
  }

  h2 {
    margin: 0 0 2rem;
    font-variation-settings: 'wght' 150;
  }

  .red {
    color: var(--red);
  }
</style>
