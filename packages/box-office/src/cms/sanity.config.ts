import { defineConfig } from 'sanity'
import { baseConfig } from './base-config.js'

export default defineConfig({
  name: 'default',
  title: 'box-office-dev',
  projectId: process.env.SANITY_STUDIO_PROJECT_ID,
  dataset: process.env.SANITY_STUDIO_DATASET,
  ...baseConfig,
})
