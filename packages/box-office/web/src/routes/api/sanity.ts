import createClient, { type SanityClient } from '@sanity/client'
import builder from '@sanity/image-url'
import { SANITY_API_KEY } from '$env/static/private'

import CONFIG from '../../config.js'

const { projectId, dataset, apiVersion } = CONFIG.SANITY

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
