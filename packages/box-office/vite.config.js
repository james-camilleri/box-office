import { svelte } from '@sveltejs/vite-plugin-svelte'
import dts from 'vite-plugin-dts'
import { vitePreprocess } from '@sveltejs/kit/vite'

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
        'cms/functions': resolve(__dirname, 'src/cms/functions/index.ts'),
        'cms/setup': resolve(__dirname, 'src/cms/setup.ts'),
        'cms/config': resolve(__dirname, 'src/cms/config.ts'),
        web: resolve(__dirname, 'src/web/index.ts'),
      },
      name: '@the-gods/box-office',
      formats: ['es'],
    },
    rollupOptions: {
      external: [
        '@sanity/icons',
        '@sanity/ui',
        '@sanity/vision',
        '@sveltejs/adapter-auto',
        '@sveltejs/kit',
        '@sveltejs/kit/vite',
        'nodemailer',
        'pdfmake',
        'react',
        'react/jsx-runtime',
        'sanity',
        'sanity/desk',
        'sanity/router',
        'svelte-preprocess',
        'vite',
      ],
      // pdfmake, see https://pdfmake.github.io/docs/0.1/getting-started/client-side/
      moduleContext: {
        './node_modules/pdfmake/build/vfs_fonts.js': 'window',
      },
    },
  },
  plugins: [
    dts(),
    svelte({
      preprocess: [vitePreprocess()],
    }),
  ],
})
