import sanityClient from '@sanity/client'

const { SANITY_API_KEY } = process.env
const client = sanityClient({
  projectId: '8biawkr2',
  apiVersion: '2022-11-01',
  dataset: 'production',
  token: SANITY_API_KEY,
  useCdn: false,
})

const document = {}

await client.create(document)
