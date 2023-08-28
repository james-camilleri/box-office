import type { UserConfig } from 'vite'

import { sveltekit } from '@sveltejs/kit/vite'

export function createViteConfig(seatPlanPath?: string, config?: UserConfig) {
  return {
    ...config,
    resolve: {
      ...config?.resolve,
      alias: {
        ...config?.resolve?.alias,
        'seat-plan': seatPlanPath,
      },
      preserveSymlinks: true,
    },
    plugins: [sveltekit(), ...(config?.plugins || [])],
  }
}
