import { PublishIcon, SpinnerIcon } from '@sanity/icons'
import { useEffect, useState } from 'react'
import {
  DocumentActionDescription,
  DocumentActionProps,
  SanityDocument,
  useDocumentOperation,
  useValidationStatus,
} from 'sanity'

import { Configuration } from '$shared/types'

interface ConfigurationPage extends SanityDocument, Partial<Configuration> {}

function generateCompositePricingConfiguration(draft: ConfigurationPage | null) {
  if (!draft || !draft.priceConfiguration) {
    console.error('Missing data in draft document for publishing.')
    return ''
  }

  const configuration = draft.priceConfiguration
  const composite: Record<string, Record<string, string>> = {}

  configuration.forEach((config) => {
    const keys = config.applyToAllShows ? ['default'] : config.shows.map((show) => show._ref)
    const priceTier = config.priceTier._ref

    keys.forEach((key) => {
      composite[key] = {
        ...composite[key],
        ...config.applyTo.reduce<Record<string, string>>(
          (tierApplyTo, { _ref }) => ({ ...tierApplyTo, [_ref]: priceTier }),
          {},
        ),
      }
    })
  })

  const defaultTier = draft.defaultPrice && draft.defaultPrice._ref
  if (defaultTier) {
    composite['default']['default'] = defaultTier
  }

  return JSON.stringify(composite)
}

function generateCompositeReservedSeatsConfiguration(draft: ConfigurationPage | null) {
  if (!draft || !draft.reservedSeats) {
    console.error('Missing data in draft document for publishing.')
    return ''
  }

  const configuration = draft.reservedSeats
  const composite: Record<string, string[]> = {}

  configuration.forEach((config) => {
    const keys = config.applyToAllShows ? ['default'] : config.shows.map((show) => show._ref)

    keys.forEach((key) => {
      composite[key] = [...(composite[key] ?? []), ...config.seats.map(({ _ref }) => _ref)]
    })
  })

  return JSON.stringify(composite)
}

export function PublishConfig({
  id,
  type,
  draft,
  onComplete,
}: DocumentActionProps): DocumentActionDescription {
  const { patch, publish } = useDocumentOperation(id, type)
  const { validation } = useValidationStatus(id, type)
  const [isPublishing, setIsPublishing] = useState(false)

  useEffect(() => {
    // if the isPublishing state was set to true and the draft has changed
    // to become `null` the document has been published
    if (isPublishing && !draft) {
      setIsPublishing(false)
    }
  }, [isPublishing, draft])

  return {
    disabled: validation.length ? true : !!publish.disabled,
    label: isPublishing ? 'Publishing…' : 'Publish',
    icon: isPublishing ? SpinnerIcon : PublishIcon,
    shortcut: 'ctrl+alt+p',

    onHandle: () => {
      setIsPublishing(true)

      // Create composite pricing configuration.
      patch.execute([
        { set: { compositePriceConfiguration: generateCompositePricingConfiguration(draft) } },
        { set: { compositeReservedSeats: generateCompositeReservedSeatsConfiguration(draft) } },
      ])

      publish.execute()
      onComplete()
    },
  }
}
