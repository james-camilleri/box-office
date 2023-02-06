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

const scheduledFunction: Handler = async function (event, context) {
  console.log('RUNNING SCHEDULED FUNCTION?')

  try {
    client.fetch(query).then((lockedSeats: LockedSeat[]) => {
      if (!lockedSeats.length) {
        console.log('No data to delete.')
        return
      }

      return Promise.all(
        lockedSeats.map(({ _id, locks }) => {
          client
            .patch(_id)
            .unset(locks.map((lock) => `locks[_key=="${lock}"]`))
            .commit()
            .then(() => console.log(`Deleted ${locks.length} lock(s) for ${_id}`))
            .catch(console.error)
        }),
      )
    })
  } catch (e) {
    console.error(e)

    return {
      statusCode: 500,
    }
  }

  console.log('RAN SCHEDULED FUNCTION, APPARENTLY')

  return {
    statusCode: 200,
  }
}

export const handler = schedule('0,15,30,45 * * * *', scheduledFunction)
