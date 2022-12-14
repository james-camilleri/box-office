import { visionTool } from '@sanity/vision'
import { DocumentActionComponent, defineConfig } from 'sanity'
import { deskTool } from 'sanity/desk'

import { CreateBooking } from './desk/actions/create-booking'
import { PublishConfig } from './desk/actions/publish-config'
import { schemaTypes } from './schemas'
import { structure } from './structure'

enum ACTIONS {
  PUBLISH = 'publish',
  UNPUBLISH = 'unpublish',
  DISCARD_CHANGES = 'discardChanges',
  DUPLICATE = 'duplicate',
  DELETE = 'delete',
  RESTORE = 'restore',
}

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
      // Use custom publish action for the configuration page.
      // Keep the discard changes action and get rid of everything else.
      if (context.schemaType === 'pageConfigure') {
        return actions
          .map((previousAction) =>
            previousAction.action === ACTIONS.PUBLISH
              ? PublishConfig
              : previousAction.action === ACTIONS.DISCARD_CHANGES
              ? previousAction
              : null,
          )
          .filter(Boolean) as DocumentActionComponent[] // TS's silly filter thing again.
      }

      if (['booking'].includes(context.schemaType)) {
        return [CreateBooking]
      }

      if (['pageConfigure'].includes(context.schemaType)) {
        return actions.filter(({ action }) =>
          [ACTIONS.PUBLISH, ACTIONS.DISCARD_CHANGES].includes(action as ACTIONS),
        )
      }

      if (['ticket', 'row', 'seat', 'section'].includes(context.schemaType)) {
        return []
      }

      return actions
    },
  },
})
