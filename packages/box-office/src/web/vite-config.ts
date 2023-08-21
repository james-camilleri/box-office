import type { UserConfig } from 'vite'

import { sveltekit } from '@sveltejs/kit/vite'

export function createViteConfig(config?: UserConfig) {
  return {
    ...config,
    resolve: {
      ...config?.resolve,
      preserveSymlinks: true,
    },
    plugins: [sveltekit(), ...(config?.plugins || [])],
  }
}
