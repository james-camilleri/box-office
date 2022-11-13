import { visionTool } from '@sanity/vision'
import { createConfig } from 'sanity'
import { deskTool } from 'sanity/desk'

import { schemaTypes } from './schemas'
import { structure } from './structure'

export default createConfig({
  name: 'default',
  title: 'tickets',

  projectId: '8biawkr2',
  dataset: 'production',

  plugins: [deskTool({ structure }), visionTool()],

  schema: {
    types: schemaTypes,
  },
})