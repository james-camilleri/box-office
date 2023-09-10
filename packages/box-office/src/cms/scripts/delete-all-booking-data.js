import readline from 'readline'

import { createClient } from '@sanity/client'

const {
  SANITY_STUDIO_API_KEY,
  SANITY_STUDIO_API_VERSION,
  SANITY_STUDIO_DATASET,
  SANITY_STUDIO_PROJECT_ID,
} = process.env

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

    const client = createClient({
      projectId: SANITY_STUDIO_PROJECT_ID,
      apiVersion: SANITY_STUDIO_API_VERSION,
      dataset: SANITY_STUDIO_DATASET,
      token: SANITY_STUDIO_API_KEY,
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
