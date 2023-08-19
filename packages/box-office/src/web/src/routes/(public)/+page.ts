import type { PortableTextBlock } from '@portabletext/types'
import type { ConfigurationFull } from '$shared/types'

import type { PageLoad } from './$types.js'

// Disabled, because of this, I think.
// https://github.com/sveltejs/kit/issues/3410
export const prerender = false

export const load: PageLoad<{ configuration: ConfigurationFull }> = async ({ fetch }) => {
  const [configuration, text] = await Promise.all([
    (await fetch('/api/config').then((payload) => payload.json())) as ConfigurationFull,
    (await fetch('/').then((payload) => payload.json())) as PortableTextBlock,
  ])

  return { configuration, text }
}
