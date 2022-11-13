import path from 'path'

import svg from '@poppanator/sveltekit-svg'
import replace from '@rollup/plugin-replace'
import { sveltekit } from '@sveltejs/kit/vite'

import CONFIG from './src/config.js'

const BREAKPOINT_STRINGS = Object.entries(CONFIG.BREAKPOINTS).reduce(
  (replaceConfig, [breakpoint, width]) => ({
    ...replaceConfig,
    [`__breakpoint-${breakpoint}__`]: width,
  }),
  {},
)

/** @type {import('vite').UserConfig} */
const config = {
  plugins: [
    sveltekit(),
    replace({
      values: BREAKPOINT_STRINGS,
      preventAssignment: true,
    }),
    svg({
      svgoOptions: {
        plugins: [
          {
            name: 'preset-default',
            params: {
              overrides: {
                removeTitle: false,
                removeViewBox: false,
              },
            },
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      $assets: path.resolve('./src/assets'),
    },
  },
}

export default config
