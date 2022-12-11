import createClient, { type SanityClient } from '@sanity/client'

import CONFIG from '../../config.js'

const { projectId, dataset, apiVersion } = CONFIG.SANITY
const { SANITY_API_KEY } = process.env

const CLIENT_CONFIG = {
  projectId,
  dataset,
  apiVersion,
  token: SANITY_API_KEY,
}

interface SanityCompoundClient extends SanityClient {
  noCdn: SanityClient
}

// @ts-expect-error Sanity has trouble with nodenext export resolution.
const sanity = createClient(CLIENT_CONFIG) as SanityCompoundClient
// @ts-expect-error Sanity has trouble with nodenext export resolution.
sanity.noCdn = createClient({ ...CLIENT_CONFIG, useCdn: false }) as SanityClient

export { sanity }
