import './style.css'

import { ImageRemoveIcon } from '@sanity/icons'
import { Card, Flex, Grid } from '@sanity/ui'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useClient } from 'sanity'
import { definePlugin } from 'sanity'
import { API_VERSION } from 'shared/constants'

import { QrScanner } from './QrScanner.jsx'
import Beep from './beep.mp3'
import Boing from './boing.mp3'

enum STATUS {
  IDLE,
  SUCCESS,
  ERROR,
  ALREADY_SCANNED,
}

function getBackgroundColour(status: STATUS) {
  return status === STATUS.SUCCESS
    ? '#5bb450'
    : status === STATUS.ALREADY_SCANNED || status === STATUS.ERROR
    ? '#ff0000'
    : 'transparent'
}

function ScannerToolComponent() {
  const beepRef = useRef<HTMLAudioElement>(null)
  const boingRef = useRef<HTMLAudioElement>(null)
  const client = useClient({ apiVersion: API_VERSION })

  const [user, setUser] = useState<string>('James')
  const [status, setStatus] = useState<STATUS>(STATUS.IDLE)
  const [error, setError] = useState<string>()

  const scanTicket = useCallback(
    (id: string) => {
      const scannedAt = new Date().toISOString()

      client
        .patch(id)
        .setIfMissing({
          scannedAt,
          scannedBy: user,
        })
        .commit()
        .then((response) => {
          setTimeout(() => {
            setError(undefined)
            setStatus(STATUS.IDLE)
          }, 5000)

          if (response.scannedAt !== scannedAt) {
            setStatus(STATUS.ALREADY_SCANNED)
            setError(
              `${response._id} already scanned by ${response.scannedBy}\n at ${new Date(
                response.scannedAt,
              ).toLocaleString()}`,
            )
            boingRef?.current?.play()
            return
          }

          setStatus(STATUS.SUCCESS)
          beepRef?.current?.play()
        })
        .catch((error) => {
          setStatus(STATUS.ERROR)
          setError(error)
          setTimeout(() => {
            setError(undefined)
            setStatus(STATUS.IDLE)
          }, 5000)
          boingRef?.current?.play()
        })
    },
    [client, user],
  )

  return (
    <div
      className="scanner"
      style={{
        background: getBackgroundColour(status),
      }}
    >
      <Flex gap={[3, 3, 4]} direction="column" height="fill">
        <QrScanner onScan={scanTicket} />
        <div className="status">
          {status !== STATUS.IDLE ? STATUS[status].replace('_', ' ') : ''}
        </div>
        <div className="error">{error ? error : ''}</div>
      </Flex>
      <audio ref={beepRef} src={Beep} />
      <audio ref={boingRef} src={Boing} />
    </div>
  )
}

export const scannerTool = definePlugin(() => {
  return {
    name: 'ticket-scanner-tool',
    tools: [
      {
        name: 'scanner',
        title: 'Scan Tickets',
        component: ScannerToolComponent,
        icon: ImageRemoveIcon,
      },
    ],
  }
})
