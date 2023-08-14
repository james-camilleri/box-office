import { Handler, schedule } from '@netlify/functions'
import sanityClient from '@sanity/client'

const { SANITY_API_KEY } = process.env

const client = sanityClient({
  projectId: '8biawkr2',
  apiVersion: '2023-01-01',
  dataset: 'production',
  token: SANITY_API_KEY,
  useCdn: false,
})

const query = `*[
  _type == "seat"
  && count(locks[dateTime(now()) - dateTime(lockTime) > 60*5]) > 0
]{
  _id,
  'locks': locks[dateTime(now()) - dateTime(lockTime) > 60*5]._key
}`

interface LockedSeat {
  _id: string
  locks: string[]
}

export const clearLocks: Handler = async function (event, context) {
  console.log('Clearing stale locks.')

  try {
    await client.fetch(query).then(async (lockedSeats: LockedSeat[]) => {
      if (!lockedSeats.length) {
        console.log('No data to delete.')
        return
      }

      await Promise.all(
        lockedSeats.map(({ _id, locks }) =>
          client
            .patch(_id)
            .unset(locks.map((lock) => `locks[_key=="${lock}"]`))
            .commit()
            .then(() => console.log(`Deleted ${locks.length} lock(s) for ${_id}.`))
            .catch(console.error),
        ),
      )
    })
  } catch (e) {
    console.error(e)

    return {
      statusCode: 500,
    }
  }

  console.log('Successfully cleared stale locks.')

  return {
    statusCode: 200,
  }
}
