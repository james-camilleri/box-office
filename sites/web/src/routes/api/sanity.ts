import createClient, { type SanityClient } from '@sanity/client'
import builder from '@sanity/image-url'

import CONFIG from '../../config.js'

const { projectId, dataset, apiVersion } = CONFIG.SANITY
const { SANITY_API_KEY } = process.env

const CLIENT_CONFIG = {
  projectId,
  dataset,
  apiVersion,
  token: SANITY_API_KEY,
  useCdn: true,
}

interface SanityCompoundClient extends SanityClient {
  noCdn: SanityClient
}

const sanity = createClient(CLIENT_CONFIG) as SanityCompoundClient
sanity.noCdn = createClient({ ...CLIENT_CONFIG, useCdn: false }) as SanityClient

const imageUrlBuilder = builder(sanity)

export { sanity, imageUrlBuilder }
