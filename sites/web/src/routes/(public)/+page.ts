import type { ConfigurationFull } from 'shared/types'

import type { PageLoad } from './$types.js'

// Disabled, because of this, I think.
// https://github.com/sveltejs/kit/issues/3410
export const prerender = false

export const load: PageLoad<{ configuration: ConfigurationFull }> = async ({ fetch }) => {
  const configuration = (await fetch('/api/config').then((payload) =>
    payload.json(),
  )) as ConfigurationFull

  return { configuration }
}
