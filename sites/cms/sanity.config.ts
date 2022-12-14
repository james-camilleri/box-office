import { visionTool } from '@sanity/vision'
import { defineConfig } from 'sanity'
import { deskTool } from 'sanity/desk'

import { PublishConfig } from './desk/actions/publish-config'
import { schemaTypes } from './schemas'
import { structure } from './structure'

export default defineConfig({
  name: 'default',
  title: 'tickets',

  projectId: '8biawkr2',
  dataset: 'production',

  plugins: [deskTool({ structure }), visionTool()],

  schema: {
    types: schemaTypes,
    templates: (previous) =>
      previous.filter(
        ({ id }) => !['ticket', 'pageConfigure', 'row', 'seat', 'section'].includes(id),
      ),
  },

  document: {
    actions(actions, context) {
      if (context.schemaType === 'pageConfigure') {
        actions = actions.map((previousAction) =>
          previousAction.action === 'publish' ? PublishConfig : previousAction,
        )
      }

      return actions
    },
  },
})
