import { type SanityClient, createClient } from '@sanity/client'
import builder from '@sanity/image-url'

import {
  SANITY_PROJECT_ID,
  SANITY_DATASET,
  SANITY_API_VERSION,
  SANITY_API_KEY,
} from '$env/static/private'

const CLIENT_CONFIG = {
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  apiVersion: SANITY_API_VERSION,
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
