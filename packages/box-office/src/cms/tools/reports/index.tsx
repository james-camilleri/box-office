import { BarChartIcon } from '@sanity/icons'
import { Card, Flex, Grid } from '@sanity/ui'
import { useEffect, useMemo, useState } from 'react'
import { type Tool, useClient } from 'sanity'
import { definePlugin } from 'sanity'

import { API_VERSION } from '$shared/constants'
import { ALL_BOOKINGS, ALL_DISCOUNTS, CONFIG } from '$shared/queries'
import { Booking, DISCOUNT_TYPE, Discount, ReportConfiguration } from '$shared/types'
import { addBookingPrices, formatShowDateTime } from '$shared/utils'

import { BookingCard } from './BookingCard/index.jsx'
import { FilterBar, Filters, Option } from './FilterBar.jsx'
import { Summary } from './Summary/index.jsx'
import { filterBookings } from './utils.js'

const TODAY = new Date()
const DEFAULT_FILTER = { dates: [TODAY, TODAY] }

function ToolComponent() {
  const [rawBookings, setRawBookings] = useState<Booking[]>([])
  const [config, setConfig] = useState<ReportConfiguration>()
  const [discounts, setDiscounts] = useState<Discount[]>()
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTER)
  const [firstBookingDate, setFirstBookingDate] = useState(TODAY)

  const client = useClient({ apiVersion: API_VERSION })

  useEffect(() => {
    client.fetch(ALL_BOOKINGS).then(setRawBookings)
    client.fetch(CONFIG).then(setConfig)
    client.fetch(ALL_DISCOUNTS).then(setDiscounts)
  }, [client])

  useEffect(() => {
    const firstBooking = rawBookings.at(-1)
    if (firstBooking) {
      const firstBookingDate = new Date(firstBooking._createdAt)

      setFirstBookingDate(firstBookingDate)
      setFilters((filters) => ({ ...filters, dates: [firstBookingDate, filters.dates[1]] }))
    }
  }, [rawBookings])

  const filterOptions = useMemo(() => {
    const sources = new Map<string, Option>()
    const discounts = new Map<string, Option>()
    const campaigns = new Map<string, Option>()

    rawBookings.forEach((booking) => {
      booking.source &&
        sources.set(booking.source, { label: booking.source, value: booking.source })
      booking.discount &&
        discounts.set(booking.discount._id, {
          label: `${booking.discount.name} ${
            booking.discount.type === DISCOUNT_TYPE.PERCENTAGE
              ? `(${booking.discount.value}% off)`
              : `(€${booking.discount.value} off)`
          }`,
          value: booking.discount._id,
        })
      booking.campaigns &&
        booking.campaigns.forEach((campaign) => {
          campaigns.set(campaign, { label: campaign, value: campaign })
        })
    })

    return {
      ...(config?.shows && config.shows.length > 1
        ? {
            show: config.shows.map(({ _id, date }) => ({
              label: formatShowDateTime(date, config.timeZone),
              value: _id,
            })),
          }
        : undefined),
      ...(config?.priceTiers && config.priceTiers.length > 1
        ? {
            seatTier: config.priceTiers.map(({ _id, name, colour }) => ({
              label: name,
              value: _id,
              colour,
            })),
          }
        : undefined),
      ...(discounts.size > 0 ? { discount: [...discounts.values()] } : undefined),
      ...(campaigns.size > 0 ? { campaign: [...campaigns.values()] } : undefined),
      ...(sources.size > 1 ? { source: [...sources.values()] } : undefined),
    }
  }, [config, rawBookings])

  const priceConfiguration = config && JSON.parse(config.priceConfiguration)
  const priceTiers = config && config.priceTiers

  const processedBookings = useMemo(
    () => addBookingPrices(rawBookings, priceConfiguration, priceTiers),
    [priceConfiguration, priceTiers, rawBookings],
  )

  const filteredBookings = useMemo(
    () => filterBookings(processedBookings, filters),
    [processedBookings, filters],
  )

  return (
    <Grid
      style={{
        height: '100%',
        gridTemplateRows: 'auto 1fr',
      }}
    >
      <FilterBar
        filters={filters}
        filterOptions={filterOptions}
        startDate={firstBookingDate}
        onSelectionChange={setFilters}
      />
      <Grid columns={[1, 1, 3]}>
        <Card
          padding={[3, 3, 4]}
          style={{ borderRight: 'solid 0.5px var(--card-border-color)', overflowY: 'auto' }}
        >
          <Summary bookings={filteredBookings} config={config} discounts={discounts} />
        </Card>
        <Card padding={[3, 3, 4]} style={{ gridColumn: 'span 2', overflowY: 'auto' }}>
          <Grid columns={[1, 1, 2]} gap={[3, 3, 4]}>
            <Flex direction="column" gap={[3, 3, 4]}>
              {filteredBookings.map(
                (booking, i) =>
                  i % 2 === 0 && (
                    <BookingCard booking={booking} config={config} key={booking._id} />
                  ),
              )}
            </Flex>
            <Flex direction="column" gap={[3, 3, 4]}>
              {filteredBookings.map(
                (booking, i) =>
                  i % 2 !== 0 && (
                    <BookingCard booking={booking} config={config} key={booking._id} />
                  ),
              )}
            </Flex>
          </Grid>
        </Card>
      </Grid>
    </Grid>
  )
}

function tool(): Tool {
  return {
    name: 'reports',
    title: 'Reports',
    component: ToolComponent,
    icon: BarChartIcon,
  }
}

export const reportsTool = definePlugin(() => {
  return {
    name: 'reports-tool',
    tools: [tool()],
  }
})
