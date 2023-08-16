import { SanityClient } from '@sanity/client'

interface SeatingPlan {
  [section: string]: {
    [row: string]: number | string[]
  }
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
        typeof seat !== 'number' &&
        !(Array.isArray(seat) && seat.length > 0 && seat.every((seat) => typeof seat === 'string'))
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

export async function createSeatingData(seatingPlan: unknown, client: SanityClient) {
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
        ? row.map((seat) => seat)
        : Array(row)
            .fill(1)
            .map((offset: number, i) => `${offset + i}`)

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
