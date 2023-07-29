import './style.css'

import { ImageRemoveIcon } from '@sanity/icons'
import { Flex, Label, Select, TextInput } from '@sanity/ui'
import { closestTo, isAfter, addHours } from 'date-fns'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useClient } from 'sanity'
import { definePlugin } from 'sanity'
import { API_VERSION } from 'shared/constants'
import { CONFIG, SHOWS, VALID_TICKETS } from 'shared/queries'
import { ReportConfiguration, Show } from 'shared/types'
import { formatShowDateTime } from 'shared/utils'

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

  const [status, setStatus] = useState<STATUS>(STATUS.IDLE)
  const [error, setError] = useState<string>()
  const [user, setUser] = useState<string>('')
  const [config, setConfig] = useState<ReportConfiguration>()
  const [shows, setShows] = useState<Show[]>([])
  const [selectedShow, setSelectedShow] = useState<string>()
  const [validTicketIds, setValidTicketIds] = useState<Set<string>>()

  useEffect(() => {
    client.fetch(CONFIG).then(setConfig)
    client.fetch(SHOWS).then((shows: Show[]) => {
      const now = new Date()
      const filteredShows = shows.filter((show) => isAfter(addHours(new Date(show.date), 1), now))

      setShows(filteredShows)

      const closestDateTime = closestTo(
        now,
        filteredShows.map((show) => new Date(show.date)),
      )?.toISOString()

      const selectedShow = filteredShows.filter((show) => show.date == closestDateTime)[0]
      setSelectedShow(selectedShow._id)
    })
  }, [])

  useEffect(() => {
    if (!selectedShow) {
      return
    }

    setValidTicketIds(undefined)
    client.fetch(VALID_TICKETS, { show: selectedShow }).then((validTicketIds: string[]) => {
      setValidTicketIds(new Set(validTicketIds))
    })
  }, [client, selectedShow])

  const scanTicket = useCallback(
    (id: string) => {
      if (!validTicketIds?.has(id)) {
        setTimeout(() => {
          setError(undefined)
          setStatus(STATUS.IDLE)
        }, 5000)

        setStatus(STATUS.ERROR)
        setError(`Ticket ${id} is not valid\nfor the currently selected show.`)
        boingRef?.current?.play()
        return
      }

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
    [client, user, validTicketIds],
  )

  return (
    <div
      className="scanner"
      style={{
        background: getBackgroundColour(status),
      }}
    >
      <Flex gap={[3, 3, 4]} direction="column" height="fill">
        {user && validTicketIds && <QrScanner onScan={scanTicket} />}
        <div className="status">
          {status !== STATUS.IDLE ? STATUS[status].replace('_', ' ') : ''}
        </div>
        <div className="error">{error ? error : ''}</div>
        <Flex gap={[2, 2, 3]} direction="column" style={{ marginTop: 'auto' }}>
          <Label size={2}>Show</Label>
          <Select
            onChange={(e) => setSelectedShow(e.currentTarget.value)}
            value={selectedShow}
            fontSize={[2, 2, 3, 4]}
            padding={[3, 3, 4]}
            space={[3, 3, 4]}
          >
            {shows.map((show) => (
              <option key={show._id} value={show._id}>
                {formatShowDateTime(show.date, config?.timeZone)}
              </option>
            ))}
          </Select>
          <Label size={2}>Scanned by</Label>
          <TextInput
            fontSize={[2, 2, 3, 4]}
            onChange={(event) => setUser(event.currentTarget.value)}
            padding={[3, 3, 4]}
            placeholder="Alfred Prufrock"
            value={user}
          />
        </Flex>
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
