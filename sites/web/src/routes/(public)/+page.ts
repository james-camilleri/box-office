import type { ConfigurationFull } from 'shared/types'

import type { PageLoad } from './$types.js'

export const prerender = true

export const load: PageLoad<{ configuration: ConfigurationFull }> = async ({ fetch }) => {
  const configuration = (await fetch('/api/config').then((payload) =>
    payload.json(),
  )) as ConfigurationFull

  return { configuration }
}
