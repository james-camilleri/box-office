import sanityClient from '@sanity/client'

const { SANITY_API_KEY } = process.env
const client = sanityClient({
  projectId: '8biawkr2',
  apiVersion: '2022-11-01',
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

client
  .fetch(query)
  .then((lockedSeats) => {
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
  .catch((err) => {
    if (err.message.includes('Insufficient permissions')) {
      console.error(err.message)
    } else {
      console.error(err.stack)
    }
  })
