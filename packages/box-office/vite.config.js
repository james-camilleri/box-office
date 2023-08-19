import dts from 'vite-plugin-dts'

import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  resolve: {
    alias: {
      '$shared/constants': resolve('./src/_shared/constants/index.ts'),
      '$shared/queries': resolve('./src/_shared/queries/index.ts'),
      '$shared/types': resolve('./src/_shared/types/index.ts'),
      '$shared/utils': resolve('./src/_shared/utils/index.ts'),
    },
  },
  build: {
    sourcemap: true,
    lib: {
      entry: {
        cms: resolve(__dirname, 'src/cms/index.ts'),
      },
      name: '@the-gods/box-office',
      formats: ['es'],
    },
    rollupOptions: {
      external: [
        '@sanity/icons',
        '@sanity/ui',
        '@sanity/vision',
        'react',
        'react/jsx-runtime',
        'sanity',
        'sanity/desk',
        'sanity/router',
      ],
    },
  },
  plugins: [dts()],
})