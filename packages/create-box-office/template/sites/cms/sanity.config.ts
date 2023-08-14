import { baseConfig } from '@the-gods/box-office/cms'
import { defineConfig } from 'sanity'

export default defineConfig({
  name: 'default',
  title: 'tickets',

  projectId: '{{sanityProjectId}}',
  dataset: 'production',

  ...baseConfig,
})
