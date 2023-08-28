import type { UserConfig } from 'vite'

import { sveltekit } from '@sveltejs/kit/vite'

export function createViteConfig(seatPlan: string, config?: UserConfig) {
  return {
    ...config,
    resolve: {
      ...config?.resolve,
      preserveSymlinks: true,
    },
    plugins: [injectSeatPlan(seatPlan), sveltekit(), ...(config?.plugins || [])],
  }
}

function injectSeatPlan(contents: string) {
  const virtualModuleId = 'virtual:seat-plan'
  const resolvedVirtualModuleId = '\0' + virtualModuleId

  return {
    name: 'box-office',
    resolveId(id: string) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId
      }
    },
    load(id: string) {
      if (id === resolvedVirtualModuleId) {
        return contents
      }
    },
  }
}
