import adapter from '@sveltejs/adapter-auto'
import { vitePreprocess } from '@sveltejs/kit/vite'

export default {
  preprocess: vitePreprocess(),
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
