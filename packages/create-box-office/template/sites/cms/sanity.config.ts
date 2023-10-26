import '@the-gods/box-office/cms/css'

import { baseConfig } from '@the-gods/box-office/cms'
import { defineConfig } from 'sanity'

export default defineConfig({
  name: 'default',
  title: '{{name}}',

  projectId: '{{sanityProjectId}}',
  dataset: 'production',

  ...baseConfig,
})
