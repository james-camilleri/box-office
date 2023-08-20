import adapter from '@sveltejs/adapter-auto'
import preprocess from 'svelte-preprocess'

export default {
  preprocess: preprocess(),
  kit: {
    adapter: adapter(),
    alias: {
      '$shared/constants': './../_shared/constants/index.ts',
      '$shared/queries': './../_shared/queries/index.ts',
      '$shared/types': './../_shared/types/index.ts',
      '$shared/utils': './../_shared/utils/index.ts',
    },
  },
}
