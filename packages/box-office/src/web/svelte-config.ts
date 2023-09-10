import type { Config } from '@sveltejs/kit'

import adapter from '@sveltejs/adapter-auto'
import { vitePreprocess } from '@sveltejs/kit/vite'

export function createSvelteConfig(config?: Config) {
  return {
    ...config,
    preprocess: vitePreprocess() || config?.preprocess,
    kit: {
      adapter: adapter(),
      files: {
        ...config?.kit?.files,
        appTemplate: 'node_modules/@the-gods/box-office/dist/web/app.html',
        routes: 'node_modules/@the-gods/box-office/dist/web/routes',
        lib: 'node_modules/@the-gods/box-office/dist/web/lib',
        hooks: {
          server: 'node_modules/@the-gods/box-office/dist/web/hooks.server.ts',
        },
      },
      ...config?.kit,
    },
  }
}
