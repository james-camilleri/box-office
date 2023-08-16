import './styles.scss'

import { DownloadIcon } from '@sanity/icons'
import { Button, Flex } from '@sanity/ui'
import { useMemo } from 'react'

import { DISCOUNT_TYPE, Discount, ReportConfiguration } from '$shared/types'

import { PriceTierColour } from '../TierColour/index.jsx'
import { BookingWithPrices, createCsvString } from '../utils.js'

interface SummaryProps {
  bookings: BookingWithPrices[]
  discounts?: Discount[]
  config?: ReportConfiguration
}

export function Summary(props: SummaryProps) {
  const { bookings: rawBookings, discounts, config } = props

  const { bookings, seats, sales } = useMemo(
    () =>
      rawBookings.reduce(
        (summaryData, booking) => {
          const { source, discount, campaigns } = booking

          incrementMapCount(summaryData.bookings.bySource, source)
          incrementMapCount(summaryData.bookings.byDiscount, discount?._id)
          campaigns &&
            campaigns.forEach((campaign) =>
              incrementMapCount(summaryData.bookings.byCampaign, campaign),
            )

          summaryData.seats.total += booking.seats.length
          booking.seats.forEach((seat) => {
            incrementMapCount(summaryData.seats.byTier, seat.priceTier?._id)
          })

          summaryData.sales.subtotal += booking.subtotal ?? 0
          summaryData.sales.reduction += booking.reduction ?? 0
          summaryData.sales.bookingFee += booking.bookingFee ?? 0
          summaryData.sales.total += booking.total ?? 0
          summaryData.sales.vat += booking.vat ?? 0
          summaryData.sales.profit +=
            (booking.total ?? 0) - ((booking.bookingFee ?? 0) + (booking.vat ?? 0))

          return summaryData
        },
        {
          bookings: {
            bySource: new Map<string, number>(),
            byDiscount: new Map<string, number>(),
            byCampaign: new Map<string, number>(),
          },
          seats: {
            total: 0,
            byTier: new Map<string, number>(),
          },
          sales: {
            subtotal: 0,
            reduction: 0,
            bookingFee: 0,
            total: 0,
            vat: 0,
            profit: 0,
          },
        },
      ),
    [rawBookings],
  )

  return (
    <Flex direction="column" gap={[3, 3, 4]} height="fill">
      <div style={{ flex: '1' }}>
        <table style={{ width: '100%' }} className="summary">
          <colgroup>
            <col span={1} style={{ width: '85%' }} />
            <col span={1} style={{ width: '15%' }} />
          </colgroup>

          <tbody className="major">
            <tr>
              <LabelCell value={rawBookings.length}>Bookings</LabelCell>
              <ValueCell value={rawBookings.length} />
            </tr>
          </tbody>
          {bookings.bySource.size > 0 && (
            <tbody className="minor">
              {Array.from(bookings.bySource)
                .sort(([sourceA], [sourceB]) => sourceA.localeCompare(sourceB))
                .map(([source, count]) => (
                  <tr key={source}>
                    <LabelCell value={count}>{source}</LabelCell>
                    <ValueCell value={count} />
                  </tr>
                ))}
            </tbody>
          )}
          {bookings.byDiscount.size > 0 && (
            <tbody className="minor">
              {discounts?.map(({ _id, name, type, value }) => (
                <tr key={_id}>
                  <LabelCell value={bookings.byDiscount.get(_id)}>
                    {name} ({type === DISCOUNT_TYPE.PERCENTAGE ? `${value}% off` : `€${value} off`})
                  </LabelCell>
                  <ValueCell value={bookings.byDiscount.get(_id)} />
                </tr>
              ))}
            </tbody>
          )}
          {bookings.byCampaign.size > 0 && (
            <tbody className="minor">
              {Array.from(bookings.byCampaign)
                .sort(([sourceA], [sourceB]) => sourceA.localeCompare(sourceB))
                .map(([source, count]) => (
                  <tr key={source}>
                    <LabelCell value={count}>{source}</LabelCell>
                    <ValueCell value={count} />
                  </tr>
                ))}
            </tbody>
          )}

          <tbody className="major">
            <tr>
              <LabelCell value={seats.total}>Seats sold</LabelCell>
              <ValueCell value={seats.total} />
            </tr>
            {config?.priceTiers?.map(({ _id, name, price, colour }) => (
              <tr key={_id}>
                <LabelCell value={seats.byTier.get(_id)}>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <PriceTierColour colour={colour} /> {name} @ €{price}
                  </div>
                </LabelCell>
                <ValueCell value={seats.byTier.get(_id)} />
              </tr>
            ))}
          </tbody>

          <tbody className="major">
            <tr>
              <LabelCell value={sales.profit}>Sales</LabelCell>
              <ValueCell value={sales.profit} currency />
            </tr>
            <tr>
              <LabelCell value={sales.subtotal}>Subtotal</LabelCell>
              <ValueCell value={sales.subtotal} currency />
            </tr>
            <tr>
              <LabelCell value={sales.reduction}>Discounts</LabelCell>
              <ValueCell value={sales.reduction} currency negative />
            </tr>
            {/* <tr>
          <LabelCell value={sales.bookingFee}>Booking fee</LabelCell>
          <ValueCell value={sales.bookingFee} currency negative />
        </tr> */}
            <tr>
              <LabelCell value={sales.vat}>VAT</LabelCell>
              <ValueCell value={sales.vat} currency negative />
            </tr>
          </tbody>
        </table>
      </div>
      <Button icon={DownloadIcon} onClick={() => downloadCsv(rawBookings, config)}>
        Download bookings CSV
      </Button>
    </Flex>
  )
}

function incrementMapCount(map: Map<string, number>, key: string | undefined) {
  if (!key) {
    return
  }

  const currentValue = map.get(key)
  map.set(key, currentValue != null ? currentValue + 1 : 1)
}

function LabelCell({ value, children }: { value?: number; children?: any }) {
  return <td className={!value ? 'zero' : undefined}>{children}</td>
}

function ValueCell({
  value,
  currency = false,
  negative = false,
}: {
  value?: number
  currency?: boolean
  negative?: boolean
}) {
  const valueOrZero = (value ?? 0) * (negative ? -1 : 1)

  return (
    <td className={!valueOrZero ? 'value zero' : 'value'}>
      {currency && <span>€</span>}
      <span>
        {currency
          ? new Intl.NumberFormat(undefined, {
              currency: 'EUR',
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(valueOrZero)
          : valueOrZero}
      </span>
    </td>
  )
}

function downloadCsv(bookings: BookingWithPrices[], config?: ReportConfiguration) {
  const csvString = createCsvString(bookings, config)

  const data = encodeURI('data:text/csv;charset=utf-8,' + csvString)
  const link = document.createElement('a')
  link.href = data
  link.download = 'bookings.csv'

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
