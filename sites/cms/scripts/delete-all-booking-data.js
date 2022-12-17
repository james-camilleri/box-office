import readline from 'readline'

import sanityClient from '@sanity/client'

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

rl.question(
  'This will delete *ALL* bookings, customers, and tickets. There is no turning back after this point - Sanity.io does not retain deleted data. Are you sure you want to do this? [y/n] ',
  function (confirm) {
    rl.close()
    if (confirm !== 'y') {
      process.exit(0)
    }

    const { SANITY_API_KEY } = process.env
    const client = sanityClient({
      projectId: '8biawkr2',
      apiVersion: '2022-11-01',
      dataset: 'production',
      token: SANITY_API_KEY,
      useCdn: false,
    })

    const query = '*[ _type in ["booking", "ticket", "customer"]][]._id'

    client
      .fetch(query)
      .then((ids) => {
        if (!ids.length) {
          console.log(ids)
          console.log('No data to delete.')
          return
        }

        console.log(`Deleting ${ids.length} bookings, customers, and tickets`)
        return ids
          .reduce((trx, id) => trx.delete(id), client.transaction())
          .commit()
          .then(() => console.log('Done!'))
      })
      .catch((err) => {
        if (err.message.includes('Insufficient permissions')) {
          console.error(err.message)
        } else {
          console.error(err.stack)
        }
      })
  },
)
