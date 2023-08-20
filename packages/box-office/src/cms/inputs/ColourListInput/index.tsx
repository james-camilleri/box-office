// Adapted from https://github.com/KimPaow/sanity-color-list/issues/28#issuecomment-1465003989
// by  Francisco José Marques Vieira (https://github.com/fvieira)

import { Avatar, Card, Flex, Stack } from '@sanity/ui'
import { useCallback, useEffect, useState } from 'react'
import { set, StringInputProps, unset, useClient, useFormValue } from 'sanity'

import { API_VERSION } from '$shared/constants'

type ColourCircleProps = {
  colour: string
  active: boolean
  enabled: boolean
  onClickHandler: (colour: string) => void
}

const ColourCircle = ({ colour, active, enabled, onClickHandler }: ColourCircleProps) => {
  return (
    <Card paddingRight={2}>
      <div
        style={{
          position: 'relative',
          margin: '4px',
          borderRadius: '50%',
          backgroundColor: active ? colour : 'transparent',
          border: active ? '3px solid var(--card-focus-ring-color)' : '3px solid transparent',
          cursor: enabled ? 'pointer' : 'default',
        }}
        onClick={() => enabled && onClickHandler(colour)}
      >
        <Avatar
          size={1}
          style={{
            backgroundColor: colour,
            border: enabled
              ? '1px solid var(--card-hairline-soft-color)'
              : '3px solid var(--card-border-color)',
          }}
        />
        {!enabled && (
          <div
            style={{
              width: '100%',
              height: '4px',
              position: 'absolute',
              top: 'calc(50% - 2px)',
              transform: 'rotate(45deg)',
              background: 'var(--card-border-color)',
            }}
          />
        )}
      </div>
    </Card>
  )
}

type ColourListInputProps = StringInputProps & {
  colours: string[]
  unique?: boolean
}

const ColourListInput = ({
  id,
  value = '',
  onChange,
  unique = false,
  colours,
}: ColourListInputProps) => {
  const _type = (useFormValue(['_type']) as string).replace('drafts.', '')

  const client = useClient({ apiVersion: API_VERSION })
  const [availableColours, setAvailableColours] = useState<Set<string>>(
    new Set(unique ? [] : colours),
  )

  useEffect(() => {
    if (!unique) {
      return
    }

    client
      .fetch(`*[_type == "${_type}" && !(_id in path("drafts.**"))].${id}`)
      .then((usedColours) => {
        const used = new Set(usedColours)
        const availableColours = colours.filter((colour) => !used.has(colour))
        setAvailableColours(new Set(availableColours))
      })
  }, [])

  const handleSelect = useCallback(
    (colour: string) => onChange(colour && colour !== value ? set(colour) : unset()),
    [onChange, value],
  )
  return (
    <Stack space={3}>
      {colours && (
        <Card>
          <Flex direction={'row'} wrap={'wrap'}>
            {colours.map((colour) => {
              return (
                <ColourCircle
                  key={colour}
                  colour={colour}
                  active={colour === value}
                  enabled={availableColours.has(colour)}
                  onClickHandler={handleSelect}
                />
              )
            })}
          </Flex>
        </Card>
      )}
    </Stack>
  )
}

export default ColourListInput
