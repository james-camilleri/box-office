import { type SanityClient, createClient } from '@sanity/client'
import builder from '@sanity/image-url'

import {
  SANITY_STUDIO_PROJECT_ID,
  SANITY_STUDIO_DATASET,
  SANITY_STUDIO_API_VERSION,
  SANITY_STUDIO_API_KEY,
} from '$env/static/private'

const CLIENT_CONFIG = {
  projectId: SANITY_STUDIO_PROJECT_ID,
  dataset: SANITY_STUDIO_DATASET,
  apiVersion: SANITY_STUDIO_API_VERSION,
  token: SANITY_STUDIO_API_KEY,
  useCdn: true,
}

interface SanityCompoundClient extends SanityClient {
  noCdn: SanityClient
}

const sanity = createClient(CLIENT_CONFIG) as SanityCompoundClient
sanity.noCdn = createClient({ ...CLIENT_CONFIG, useCdn: false }) as SanityClient

const imageUrlBuilder = builder(sanity)

export { sanity, imageUrlBuilder }
