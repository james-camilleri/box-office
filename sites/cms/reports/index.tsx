import { BarChartIcon } from '@sanity/icons'
import { Card, Grid, Stack } from '@sanity/ui'
import { useEffect, useState } from 'react'
import { type Tool, useClient } from 'sanity'
import { definePlugin } from 'sanity'
import { API_VERSION, DATASET, PROJECT_ID } from 'shared/constants'
import { ALL_BOOKINGS, NUMBER_OF_SEATS } from 'shared/queries'
import { Discount, Seat, Show } from 'shared/types'
import { formatShowDateTime } from 'shared/utils'

// TODO: Move to shared library
interface BookingReportDetails {
  _id: string
  _createdAt: string
  orderConfirmation: string
  source: string
  name: string
  email: string
  show: Show
  seats: Seat[]
  tickets: string[]
  discount?: Discount
}

interface ShowData {
  sales: {
    subtotal: number
    serviceCharge: number
    vat: number
    total: number
  }
  seats: {
    total: number
  }
  bookings: BookingReportDetails[]
}

function ProgressBar({ amount, total }: { amount: number; total: number }) {
  const width = amount && total ? (amount / total) * 100 : 0
  const background = width > 80 ? 'limegreen' : width > 50 ? 'yellow' : 'red'

  return (
    <div
      style={{
        width: '100%',
        height: '5px',
        background: 'black',
        borderRadius: '2px',
      }}
    >
      <div style={{ width: `${width}%`, height: '5px', background, borderRadius: '2px' }}></div>
    </div>
  )
}

function ToolComponent() {
  const [rawBookings, setRawBookings] = useState<BookingReportDetails[]>([])
  const [totalNoOfSeats, setTotalNoOfSeats] = useState<number>()

  const client = useClient({ apiVersion: API_VERSION })

  useEffect(() => {
    client.fetch(ALL_BOOKINGS).then((bookings) => {
      console.log(bookings)
      setRawBookings(bookings as BookingReportDetails[])
    })
  }, [client])

  useEffect(() => {
    client.fetch(NUMBER_OF_SEATS).then((seats) => {
      setTotalNoOfSeats(seats)
    })
  }, [client])

  const bookings = rawBookings.reduce<Record<string, ShowData>>((bookings, booking) => {
    const date = booking.show?.date

    if (!date) {
      return bookings
    }

    if (!bookings[date]) {
      bookings[date] = {
        sales: {
          subtotal: 0,
          serviceCharge: 0,
          vat: 0,
          total: 0,
        },
        seats: {
          total: 0,
        },
        bookings: [],
      }
    }

    bookings[date].seats.total += booking.seats.length
    bookings[date].bookings.push(booking)

    return bookings
  }, {})

  const totalNoOfSeatsAllShows = (totalNoOfSeats ?? 0) * Object.keys(bookings).length
  const bookedSeatsAllShows = Object.values(bookings).reduce(
    (total, { seats }) => (total += seats.total),
    0,
  )

  return (
    <Grid columns={[2, 3, 4]} gap={[1, 1, 2]} padding={4}>
      <Card padding={[3, 3, 4]}>
        <Stack space={[3, 3, 4]}>
          <Card padding={[3, 3, 4]} radius={2} shadow={1} tone="default">
            <Stack space={[2]}>
              <span>
                {bookedSeatsAllShows}/{totalNoOfSeatsAllShows}
              </span>
              <ProgressBar amount={bookedSeatsAllShows} total={totalNoOfSeatsAllShows} />
            </Stack>
          </Card>
          {Object.entries(bookings)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([show, bookingData]) => {
              return (
                <Card
                  padding={[3, 3, 4]}
                  radius={2}
                  shadow={1}
                  tone="default"
                  style={{ cursor: 'pointer' }}
                  key={show}
                >
                  <Stack space={[3]}>
                    <span>{formatShowDateTime(show)}</span>
                    <Stack space={[2]}>
                      <span>
                        {bookingData.seats.total}/{totalNoOfSeats ?? ''}
                      </span>
                      <ProgressBar amount={bookingData.seats.total} total={totalNoOfSeats ?? 0} />
                    </Stack>
                  </Stack>
                </Card>
              )
            })}
        </Stack>
      </Card>
    </Grid>
  )
}

function tool(): Tool {
  return {
    name: 'reportsTool',
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
