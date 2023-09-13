import type { UserConfig } from 'vite'

import { sveltekit } from '@sveltejs/kit/vite'
import icons from 'unplugin-icons/vite'

interface PathOverrides {
  seatPlan: string
  emailFooter: string
}

export function createViteConfig(paths?: PathOverrides, config?: UserConfig) {
  return {
    ...config,
    resolve: {
      ...config?.resolve,
      alias: {
        ...config?.resolve?.alias,
        'seat-plan': paths?.seatPlan,
        'email-footer': paths?.emailFooter,
      },
      preserveSymlinks: true,
    },
    plugins: [
      sveltekit(),
      icons({
        compiler: 'svelte',
      }),
      ...(config?.plugins || []),
    ],
  }
}
