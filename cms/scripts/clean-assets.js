// Based on https://www.sanity.io/schemas/delete-unused-assets-2ef651b5
// by Espen Hovlandsdal

const sanityClient = require('@sanity/client')

const { SANITY_API_KEY } = process.env
const client = sanityClient({
  projectId: '8biawkr2',
  apiVersion: '2022-11-01',
  dataset: 'production',
  token: SANITY_API_KEY,
  useCdn: false,
})

const query = `
  *[ _type in ["sanity.imageAsset", "sanity.fileAsset"] ]
  {_id, "refs": count(*[ references(^._id) ])}
  [ refs == 0 ]
  ._id
`

client
  .fetch(query)
  .then((ids) => {
    if (!ids.length) {
      console.log('No assets to delete.')
      return
    }

    console.log(`Deleting ${ids.length} assets`)
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
