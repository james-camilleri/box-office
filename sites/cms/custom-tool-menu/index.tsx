import './styles.scss'

import { InfoOutlineIcon, PlugIcon } from '@sanity/icons'
import { Badge, Button, Card, Flex, Popover, Stack } from '@sanity/ui'
import { useState, useEffect, useMemo } from 'react'
import { ToolMenuProps, ToolLink, useClient } from 'sanity'
import { API_VERSION } from 'shared/constants'
import { ALL_BOOKINGS, CONFIG, NUMBER_OF_SEATS } from 'shared/queries'
import { Booking, ReportConfiguration } from 'shared/types'
import { addBookingPrices, formatShowDateTimeLong } from 'shared/utils'

import { ProgressBar } from './ProgressBar.jsx'

type ShowSummary = Record<string, { seats: number; subtotal: number; profit: number }>

export function CustomToolMenu(props: ToolMenuProps) {
  const { activeToolName, context, tools } = props
  const isSidebar = context === 'sidebar'

  // Change flex direction depending on context
  const direction = isSidebar ? 'column' : 'row'

  return (
    <Flex gap={1} direction={direction} align="center">
      {tools.map((tool) => (
        <Button
          as={ToolLink}
          icon={tool.icon || PlugIcon}
          key={tool.name}
          name={tool.name}
          padding={3}
          selected={tool.name === activeToolName}
          text={tool.title || tool.name}
          mode="bleed"
          style={{ alignSelf: 'stretch' }}
          justify="flex-start"
        />
      ))}
      <SalesSummary />
    </Flex>
  )
}

function SalesSummary() {
  const client = useClient({ apiVersion: API_VERSION })

  const [bookings, setBookings] = useState<Booking[]>([])
  const [config, setConfig] = useState<ReportConfiguration>()
  const [noOfSeats, setNoOfSeats] = useState(0)

  const [popoverOpen, setPopoverOpen] = useState(false)

  useEffect(() => {
    client.fetch(ALL_BOOKINGS).then(setBookings)
    client.fetch(CONFIG).then(setConfig)
    client.fetch(NUMBER_OF_SEATS).then(setNoOfSeats)
  }, [client])

  const priceConfiguration = config && JSON.parse(config.priceConfiguration)
  const priceTiers = config && config.priceTiers

  const bookingsWithPrices = useMemo(
    () => addBookingPrices(bookings, priceConfiguration, priceTiers),
    [bookings, priceConfiguration, priceTiers],
  )

  const salesByShow = useMemo(
    () =>
      bookingsWithPrices.reduce<ShowSummary>((bookings, booking) => {
        const date = booking.show?.date

        if (!date) {
          return bookings
        }

        if (!bookings[date]) {
          bookings[date] = {
            seats: 0,
            subtotal: 0,
            profit: 0,
          }
        }

        bookings[date].seats += booking.seats.length
        bookings[date].subtotal += booking.subtotal ?? 0
        bookings[date].profit += booking.profit ?? 0

        return bookings
      }, {}),
    [bookingsWithPrices],
  )

  const seatsSold = useMemo(
    () => bookings?.reduce((seatsSold, booking) => seatsSold + (booking?.seats?.length ?? 0), 0),
    [bookings],
  )
  const totalNoOfSeats = (noOfSeats ?? 0) * (config?.shows.length ?? 0)
  const totalSoldPercentage = (seatsSold / totalNoOfSeats) * 100

  return (
    <div className="sales-summary">
      <Popover
        content={
          <SummaryBreakdown config={config} summary={salesByShow} totalSeatsPerShow={noOfSeats} />
        }
        paddingX={4}
        placement="bottom"
        open={popoverOpen}
      >
        <Button
          padding={4}
          style={{ cursor: 'pointer' }}
          onClick={() => setPopoverOpen((open) => !open)}
          tone="primary"
        >
          {seatsSold}/{totalNoOfSeats} seats sold ({totalSoldPercentage.toFixed(2)}
          %) |{' '}
          {formatCurrency(
            Object.values(salesByShow).reduce((total, show) => total + show.profit, 0),
          )}{' '}
          profit
        </Button>
      </Popover>
    </div>
  )
}

interface SummaryBreakdownProps {
  config?: ReportConfiguration
  summary: ShowSummary
  totalSeatsPerShow: number
}

function SummaryBreakdown(props: SummaryBreakdownProps) {
  const { config, summary, totalSeatsPerShow } = props

  return (
    <Card>
      <Stack>
        {Object.entries(summary)
          .sort(([showDateA], [showDateB]) => showDateA.localeCompare(showDateB))
          .map(([showDate, showSummary]) => (
            <Card key={showDate} className="show-summary" paddingY={[3, 4]}>
              <Stack space={[3, 4]}>
                <div className="heading">{formatShowDateTimeLong(showDate, config?.timeZone)}</div>
                <Stack space={[2, 3]}>
                  <div className="sales">
                    {formatCurrency(showSummary.profit)}
                    <span className="muted"> profit</span>
                  </div>
                  <Flex justify="space-between" gap={4} align="center">
                    <div>
                      {showSummary.seats}/{totalSeatsPerShow}{' '}
                      <span className="muted">seats sold</span>
                    </div>
                    <Badge>{((showSummary.seats / totalSeatsPerShow) * 100).toFixed(2)}%</Badge>
                  </Flex>
                  <ProgressBar amount={showSummary.seats ?? 0} total={totalSeatsPerShow ?? 0} />
                </Stack>
              </Stack>
            </Card>
          ))}
      </Stack>
    </Card>
  )
}

function formatCurrency(value?: number) {
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'EUR',
  }).format(value ?? 0)
}
