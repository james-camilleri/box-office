import { visionTool } from '@sanity/vision'
import { DocumentActionComponent, defineConfig } from 'sanity'
import { deskTool } from 'sanity/desk'

import { CreateBooking } from './desk/actions/create-booking.js'
import { InvalidateTicket } from './desk/actions/invalidate-ticket.js'
import { PublishConfig } from './desk/actions/publish-config.js'
import { schemaTypes } from './schemas/index.js'
import { structure } from './structure.js'

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

      if (['ticket'].includes(context.schemaType)) {
        return [InvalidateTicket]
      }

      if (['row', 'seat', 'section'].includes(context.schemaType)) {
        return []
      }

      return actions
    },
  },
})
