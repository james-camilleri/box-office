import { defineCliConfig } from 'sanity/cli'
import { resolve } from 'path'

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID,
    dataset: process.env.SANITY_STUDIO_DATASET,
  },
  vite: {
    resolve: {
      alias: {
        '$shared/constants': resolve('./../_shared/constants/index.ts'),
        '$shared/queries': resolve('./../_shared/queries/index.ts'),
        '$shared/types': resolve('./../_shared/types/index.ts'),
        '$shared/utils': resolve('./../_shared/utils/index.ts'),
      },
    },
  },
})
