import type { ConfigurationFull } from 'shared/types/configuration'

import type { PageLoad } from './$types'

export const prerender = true

console.log('+++ THIS PAGE +++')
export const load: PageLoad<ConfigurationFull> = async ({ fetch }) => {
  console.log('+++ CALLING FETCH CONFIGURATION +++')
  const configuration = (await fetch('/api/config').then((payload) =>
    payload.json(),
  )) as ConfigurationFull
  console.log('+++ CALLED FETCH CONFIGURATION +++')

  return { configuration }
}
