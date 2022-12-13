import type { ConfigurationFull } from 'shared/types/configuration'

import type { PageLoad } from './$types'

export const prerender = true

export const load: PageLoad = async ({ fetch }) => {
  const configuration = (await fetch('/api/config').then((payload) =>
    payload.json(),
  )) as ConfigurationFull

  console.log('configuration', configuration)

  return { configuration }
}
