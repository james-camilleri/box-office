import { createClient, SanityClient } from '@sanity/client'

const {
  SANITY_STUDIO_API_KEY,
  SANITY_STUDIO_API_VERSION,
  SANITY_STUDIO_DATASET,
  SANITY_STUDIO_PROJECT_ID,
} = process.env

interface SeatingPlan {
  [section: string]: {
    [row: string]: number | [number, number] | string[]
  }
}

function isArrayOfNumbers(array: any[]): array is number[] {
  return array.every((item) => typeof item === 'number')
}

function isArrayOfStrings(array: any[]): array is string[] {
  return array.every((item) => typeof item === 'string')
}

function isValidSeatingConfig(config: any): config is SeatingPlan {
  if (typeof config !== 'object' || config == null || Array.isArray(config)) {
    return false
  }

  for (const rowName in config) {
    if (typeof config[rowName] !== 'object' || rowName == null) {
      return false
    }

    for (const seatName in config[rowName]) {
      const seat = config[rowName][seatName]

      if (
        typeof seat !== 'number' && // Single number of seats, e.g. `A: 20`
        !(
          (
            Array.isArray(seat) &&
            ((seat.length === 2 && isArrayOfNumbers(seat)) || // Start and end count, e.g. A: [3, 17]
              (seat.length > 0 && isArrayOfStrings(seat)))
          ) // Individually names seats, e.g. ['TABLE-1-2', 'TABLE-2-3']
        )
      ) {
        return false
      }
    }
  }

  return true
}

async function deleteExistingData(client: SanityClient) {
  console.log('Deleting existing data')

  await client.delete({ query: '*[_type == "section" || _type == "row" || _type == "seat"]' })
}

function generateSeatArray(firstSeat: number, lastSeat: number) {
  return Array(lastSeat - firstSeat + 1)
    .fill(0)
    .map((_, i) => `${firstSeat + i}`)
}

export async function createSeatingData(seatingPlan: unknown) {
  const client = createClient({
    projectId: SANITY_STUDIO_PROJECT_ID,
    apiVersion: SANITY_STUDIO_API_VERSION,
    dataset: SANITY_STUDIO_DATASET,
    token: SANITY_STUDIO_API_KEY,
    useCdn: false,
  })

  if (!isValidSeatingConfig(seatingPlan)) {
    throw Error('Seating plan configuration is invalid.')
  }

  await deleteExistingData(client)
  console.log('Creating new seating data.')

  for (const sectionName in seatingPlan) {
    const section = seatingPlan[sectionName]
    const sectionId = sectionName.toUpperCase()

    console.log(`Creating section "${sectionId}".`)
    await client.create({
      _type: 'section',
      _id: sectionId,
      name: sectionId,
    })

    for (const rowName in section) {
      const row = section[rowName]
      const rowId = `${sectionId}-${rowName.toUpperCase()}`
      console.log(`Creating row "${rowId}".`)

      await client.create({
        _type: 'row',
        _id: rowId,
        name: rowId,
        section: {
          _type: 'reference',
          _ref: sectionId,
        },
      })

      const seatNumbers = Array.isArray(row)
        ? isArrayOfNumbers(row)
          ? generateSeatArray(row[0], row[1])
          : row
        : generateSeatArray(1, row)

      const seatRequests = seatNumbers.map((number) => {
        const _id = `${rowId}-${number}`

        console.log(`Creating seat "${_id}".`)
        return client.create({
          _type: 'seat',
          _id,
          name: _id,
          number,
          row: {
            _type: 'reference',
            _ref: rowId,
          },
        })
      })

      const createdSeats = await Promise.all(seatRequests)
      await client
        .patch(rowId)
        .setIfMissing({ seats: [] })
        .set({
          seats: createdSeats.map(({ _id }) => ({
            _type: 'reference',
            _ref: _id,
          })),
        })
        .commit({
          autoGenerateArrayKeys: true,
        })

      await client
        .patch(sectionId)
        .setIfMissing({ rows: [] })
        .append('rows', [
          {
            _type: 'reference',
            _ref: rowId,
          },
        ])
        .commit({ autoGenerateArrayKeys: true })
    }
  }
}
