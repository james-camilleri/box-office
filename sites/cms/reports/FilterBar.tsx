import '@wojtekmaj/react-daterange-picker/dist/DateRangePicker.css'
import 'react-calendar/dist/Calendar.css'
import './date-picker.css'

import { Button, Card, Flex, Stack } from '@sanity/ui'
import DateRangePicker from '@wojtekmaj/react-daterange-picker'
import { isSameDay, startOfMonth, startOfWeek, subDays } from 'date-fns'
import Select from 'react-select'

export interface Option {
  label: string
  value: string
  colour?: string
}

export interface FilterOptions {
  show?: Option[]
  seatTier?: Option[]
  discount?: Option[]
  campaign?: Option[]
  source?: Option[]
}

export interface Filters {
  dates: Date[]
  show?: Set<string>
  seatTier?: Set<string>
  discount?: Set<string>
  campaign?: Set<string>
  source?: Set<string>
}

interface FilterBarProps {
  filters: Filters
  filterOptions: FilterOptions
  startDate: Date
  onSelectionChange: (filters: Filters) => void
}

const MAX_DATE = new Date()

const DATE_RANGES = {
  today: (today: Date) => [today, today],
  'this-week': (today: Date) => [startOfWeek(today, { weekStartsOn: 1 }), today],
  'last-week': (today: Date) => {
    const endOfLastWeek = subDays(startOfWeek(today, { weekStartsOn: 1 }), 1)
    const startOfLastWeek = startOfWeek(endOfLastWeek, { weekStartsOn: 1 })

    return [startOfLastWeek, endOfLastWeek]
  },
  'this-month': (today: Date) => [startOfMonth(today), today],
  'last-month': (today: Date) => {
    const endOfLastMonth = subDays(startOfMonth(today), 1)
    const startOfLastMonth = startOfMonth(endOfLastMonth)

    return [startOfLastMonth, endOfLastMonth]
  },
  'last-7': (today: Date) => [subDays(today, 6), today],
  'last-10': (today: Date) => [subDays(today, 9), today],
  'last-15': (today: Date) => [subDays(today, 14), today],
}
type Range = keyof typeof DATE_RANGES

export function FilterBar(props: FilterBarProps) {
  const { filters, filterOptions, startDate, onSelectionChange } = props
  const width = `${Math.max(100 / Object.keys(filterOptions).length, 33.33)}%`

  function onDateChange(dates: Date[]) {
    if (!dates) {
      dates = [startDate, new Date()]
    }

    onSelectionChange({
      ...filters,
      dates,
    })
  }

  function onSelectChange(filter: string, selectedItems: Option[]) {
    onSelectionChange({
      ...filters,
      [filter]: selectedItems.length ? new Set(selectedItems.map(({ value }) => value)) : undefined,
    })
  }

  return (
    <Card padding={[3, 3, 4]} shadow={1}>
      <Stack space={[3, 4]}>
        <Flex gap={5}>
          <Flex gap={2} align="center">
            <label htmlFor="dates">Booking dates</label>
            <div style={{ flex: 1 }}>
              <DateRangePicker
                name="dates"
                // Not sure why the browser locale is returning as en-US right now.
                locale="en-GB"
                minDate={startDate}
                maxDate={MAX_DATE}
                minDetail="month"
                value={filters?.dates}
                onChange={onDateChange}
              />
            </div>
          </Flex>
          <Flex gap={2} align="center">
            <Button
              padding={[2]}
              onClick={() => onDateChange(generateDateRange('today'))}
              mode={
                areDateRangesEqual(filters?.dates, generateDateRange('today')) ? 'default' : 'ghost'
              }
            >
              Today
            </Button>
            <Button
              padding={[2]}
              onClick={() => onDateChange(generateDateRange('this-week'))}
              mode={
                areDateRangesEqual(filters?.dates, generateDateRange('this-week'))
                  ? 'default'
                  : 'ghost'
              }
            >
              This week
            </Button>
            <Button
              padding={[2]}
              onClick={() => onDateChange(generateDateRange('last-week'))}
              mode={
                areDateRangesEqual(filters?.dates, generateDateRange('last-week'))
                  ? 'default'
                  : 'ghost'
              }
            >
              Last week
            </Button>
            <Button
              padding={[2]}
              onClick={() => onDateChange(generateDateRange('this-month'))}
              mode={
                areDateRangesEqual(filters?.dates, generateDateRange('this-month'))
                  ? 'default'
                  : 'ghost'
              }
            >
              This month
            </Button>
            <Button
              padding={[2]}
              onClick={() => onDateChange(generateDateRange('last-month'))}
              mode={
                areDateRangesEqual(filters?.dates, generateDateRange('last-month'))
                  ? 'default'
                  : 'ghost'
              }
            >
              Last month
            </Button>
            <Button
              padding={[2]}
              onClick={() => onDateChange(generateDateRange('last-7'))}
              mode={
                areDateRangesEqual(filters?.dates, generateDateRange('last-7'))
                  ? 'default'
                  : 'ghost'
              }
            >
              Last 7 days
            </Button>
            <Button
              padding={[2]}
              onClick={() => onDateChange(generateDateRange('last-10'))}
              mode={
                areDateRangesEqual(filters?.dates, generateDateRange('last-10'))
                  ? 'default'
                  : 'ghost'
              }
            >
              Last 10 days
            </Button>
            <Button
              padding={[2]}
              onClick={() => onDateChange(generateDateRange('last-15'))}
              mode={
                areDateRangesEqual(filters?.dates, generateDateRange('last-15'))
                  ? 'default'
                  : 'ghost'
              }
            >
              Last 15 days
            </Button>
            <Button
              padding={[2]}
              onClick={() => onDateChange([startDate, new Date()])}
              mode={
                areDateRangesEqual(filters?.dates, [startDate, new Date()]) ? 'default' : 'ghost'
              }
            >
              All time
            </Button>
          </Flex>
        </Flex>
        <Flex gap={5}>
          {Object.entries(filterOptions).map(([name, options]) => (
            <div style={{ width }} key={name}>
              <Flex gap={2} align="center" key={name}>
                <label htmlFor={name}>{formatName(name)}</label>
                <div style={{ flex: 1 }}>
                  <Select
                    isMulti
                    key={name}
                    name={name}
                    options={options}
                    onChange={(selected) => onSelectChange(name, selected)}
                    styles={{
                      control: (styles) => ({
                        ...styles,
                        borderRadius: 0,
                        border: 'solid 0.5px var(--card-fg-color)',
                        backgroundColor: 'var(--card-bg-color)',
                      }),
                      menu: (styles) => ({
                        ...styles,
                        backgroundColor: 'var(--card-bg-color)',
                        borderRadius: 0,
                        border: 'solid 0.5px var(--card-fg-color)',
                        color: 'var(--card-fg-color)',
                        marginTop: 0,
                      }),
                      menuList: (styles) => ({
                        ...styles,
                        padding: 0,
                      }),
                      option: (styles, { isFocused }) => ({
                        ...styles,
                        backgroundColor: isFocused ? 'var(--card-focus-ring-color)' : undefined,
                      }),
                    }}
                  />
                </div>
              </Flex>
            </div>
          ))}
        </Flex>
      </Stack>
    </Card>
  )
}

function formatName(name: string) {
  return name.charAt(0).toUpperCase() + name.replace(/([A-Z])/g, ' $1').slice(1)
}

function generateDateRange(range: Range) {
  return DATE_RANGES[range](new Date())
}

function areDateRangesEqual(dateRangeA: Date[] | undefined, dateRangeB: Date[]) {
  return (
    !!dateRangeA &&
    isSameDay(dateRangeA[0], dateRangeB[0]) &&
    isSameDay(dateRangeA[1], dateRangeB[1])
  )
}
