import './styles.scss'

import { ChevronDownIcon, ChevronUpIcon, LaunchIcon } from '@sanity/icons'
import { Badge, Card, Flex, Inline, Stack } from '@sanity/ui'
import { useState } from 'react'
import { BookingWithPrices, ReportConfiguration } from 'shared/types'
import { formatShowDateTime } from 'shared/utils'

import { PriceTierColour } from '../TierColour/index.jsx'

export function BookingCard(props: { booking: BookingWithPrices; config?: ReportConfiguration }) {
  const { booking, config } = props
  const badges = [
    <Badge key={booking.source}>{booking.source}</Badge>,
    ...(booking.discount
      ? [
          <Badge key={booking.discount.name} tone="positive">
            {booking.discount.name}
          </Badge>,
        ]
      : []),
    ...(booking?.campaigns?.map((campaign) => (
      <Badge key={campaign} tone="primary">
        {campaign}
      </Badge>
    )) ?? []),
  ]

  return (
    <Card
      padding={[3, 3, 4]}
      radius={2}
      shadow={1}
      tone="default"
      key={booking._id}
      className="booking"
    >
      <Stack space={[2]}>
        <Flex direction="row" justify="space-between">
          <div className="heading">
            <span>
              <span className="name">{booking.name}</span>
            </span>
            <span className="email">{booking.email}</span>
          </div>
          <div className="heading right">
            {/* TODO: User router instead of direct link. */}
            <a className="confirmation" href={`/desk/bookings;${booking._id}`}>
              {booking.orderConfirmation}
              <LaunchIcon />
            </a>
            <span className="date">{formatShowDateTime(booking._createdAt, config?.timeZone)}</span>
          </div>
        </Flex>
        <Inline space={2} className="badges">
          {badges}
        </Inline>
        <BookingTotal booking={booking} />
      </Stack>
    </Card>
  )
}

function BookingTotal(props: { booking: BookingWithPrices }) {
  const { booking } = props
  const { subtotal, bookingFee, reduction, total, vat, discount } = booking
  const [expanded, setExpanded] = useState(false)

  return (
    <>
      <span className="show-details" onClick={() => setExpanded((expanded) => !expanded)}>
        {expanded ? 'Hide details' : 'Show details'}
        {expanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
      </span>
      <div className={`prices ${expanded ? 'expanded' : ''}`} onClick={() => setExpanded(true)}>
        <table>
          <colgroup>
            <col span={1} style={{ width: '85%' }} />
            <col span={1} style={{ width: '5%' }} />
            <col span={1} style={{ width: '10%' }} />
          </colgroup>
          {expanded && (
            <>
              <tbody>
                {booking.seats
                  .sort((seatA, seatB) => seatA._id.localeCompare(seatB._id))
                  .map((seat, i) => (
                    <tr
                      key={seat._id}
                      className={i === booking.seats.length - 1 ? 'last' : undefined}
                    >
                      <td>
                        {seat._id}{' '}
                        <span className="seat-tier">
                          <PriceTierColour colour={seat.priceTier?.colour} />
                          {seat.priceTier?.name}
                        </span>
                      </td>
                      <td>€</td>
                      <td>{seat.priceTier?.price?.toFixed(2)}</td>
                    </tr>
                  ))}
              </tbody>
              <tbody>
                {conditionalRow(
                  'Subtotal',
                  subtotal,
                  !!((discount && reduction) || bookingFee),
                  'subtotal-row',
                )}
                {conditionalRow(
                  `Discount (${discount?.name})`,
                  reduction * -1,
                  !!(discount && reduction),
                )}
                {conditionalRow('Booking fee', bookingFee, !!bookingFee)}
              </tbody>
            </>
          )}
          <tfoot>
            <tr className="total-row">
              <td>
                {expanded
                  ? 'Total'
                  : `${booking.seats.length} seat${booking.seats.length === 1 ? '' : 's'}`}
              </td>
              <td>€</td>
              <td className="total">{total?.toFixed(2)}</td>
            </tr>
            {expanded && (
              <tr>
                <td colSpan={3} className="vat-row">
                  including €{vat?.toFixed(2)} VAT
                </td>
              </tr>
            )}
          </tfoot>
        </table>
      </div>
    </>
  )
}

function conditionalRow(
  label: string,
  value: number | undefined,
  condition: boolean,
  className?: string,
) {
  return condition ? (
    <tr className={className}>
      <td>{label}</td>
      <td>€</td>
      <td>{value?.toFixed(2)}</td>
    </tr>
  ) : undefined
}
