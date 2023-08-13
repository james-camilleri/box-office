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
  *[ _type == "sanity.imageAsset" && metadata.breakpoints == null ]
`

client
  .fetch(query)
  .then((images) => {
    console.log(`Queueing breakpoint generation for ${images.length} images.`)
    Promise.all(
      images.map((image) =>
        fetch(
          'https://manage.fondazzjoniu.org/.netlify/functions/optimise-image',
          { method: 'POST', body: JSON.stringify(image) },
        ),
      ),
    )
  })
  .catch((err) => {
    if (err.message.includes('Insufficient permissions')) {
      console.error(err.message)
    } else {
      console.error(err.stack)
    }
  })
