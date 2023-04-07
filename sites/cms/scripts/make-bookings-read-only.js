import sanityClient from '@sanity/client'

const { SANITY_API_KEY } = process.env
const client = sanityClient({
  projectId: '8biawkr2',
  apiVersion: '2022-11-01',
  dataset: 'production',
  token: SANITY_API_KEY,
  useCdn: false,
})

const query = `*[_type == "booking"]._id`

client
  .fetch(query)
  .then((bookingIds) => {
    return Promise.all(
      bookingIds.map((_id, i) => {
        return new Promise((resolve) => {
          setTimeout(() => {
            console.log(`Making ${_id} read only.`)
            client.patch(_id).set({ readOnly: true }).commit().then(resolve).catch(console.error)
          }, 500 * i)
        })
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
