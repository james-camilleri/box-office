import { visionTool } from '@sanity/vision'
import { DocumentActionComponent, defineConfig } from 'sanity'
import { deskTool } from 'sanity/desk'

import { CancelBooking } from './src/desk/actions/cancel-booking.js'
import { CreateBooking } from './src/desk/actions/create-booking.js'
import { InvalidateTicket } from './src/desk/actions/invalidate-ticket.js'
import { PublishConfig } from './src/desk/actions/publish-config.js'
import { ResendEmail } from './src/desk/actions/resend-email.js'
import { structure } from './src/desk/structure.js'
import { schemaTypes } from './src/schemas/index.js'
import { CustomToolMenu } from './src/tools/custom-tool-menu/index.jsx'
import { reportsTool } from './src/tools/reports/index.js'

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

  plugins: [
    deskTool({ title: 'Box Office', structure }),
    reportsTool(),
    visionTool({ title: 'Database' }),
  ],

  studio: {
    components: {
      toolMenu: CustomToolMenu,
    },
  },

  schema: {
    types: schemaTypes,
    templates: (previous) =>
      previous.filter(
        ({ id }) =>
          !['ticket', 'pageConfigure', 'pageEmail', 'row', 'seat', 'section'].includes(id),
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

      if (['pageEmail', 'pageWebsite'].includes(context.schemaType)) {
        return actions.filter(
          (previousAction) =>
            previousAction.action === ACTIONS.PUBLISH ||
            previousAction.action === ACTIONS.DISCARD_CHANGES,
        )
      }

      if (['booking'].includes(context.schemaType)) {
        return [CreateBooking, CancelBooking, ResendEmail]
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
