import type { UserConfig } from 'vite'

import { sveltekit } from '@sveltejs/kit/vite'

export function createViteConfig(config?: UserConfig) {
  return {
    ...config,
    plugins: [sveltekit(), ...(config?.plugins || [])],
  }
}
