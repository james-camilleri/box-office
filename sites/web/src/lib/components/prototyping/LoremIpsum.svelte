<script lang="ts">
  import { loremIpsum, ILoremIpsumParams } from 'lorem-ipsum'

  export let paragraphs: number = null
  export let sentences: number = null
  export let words: number = null

  let props = { paragraphs, sentences, words } as const
  let text = []

  $: {
    const config = Object.entries(props).filter(([_, value]) => value != null)
    if (config.length > 1) {
      console.warn(
        'You can only configure paragraphs, sentences, or words for the LoremIpsum component.',
        `${paragraphs != null ? '`paragraphs`' : '`sentences`'} will be used.`,
      )
    }

    const unit = config[0]?.[0] ?? 'paragraphs'
    text = loremIpsum({
      count: props[unit] ?? 1,
      units: unit as ILoremIpsumParams['units'],
    }).split('\n')
  }
</script>

<div>
  {#each text as paragraph}
    <p>{paragraph}</p>
  {/each}
</div>
