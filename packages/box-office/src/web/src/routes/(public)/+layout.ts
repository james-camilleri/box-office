import type { ConfigurationFull, WebConfiguration } from '$shared/types'

export async function load({ fetch }) {
  const [ticketConfig, uiConfig] = await Promise.all([
    (await fetch('/api/config').then((payload) => payload.json())) as ConfigurationFull,
    (await fetch('/').then((payload) => payload.json())) as WebConfiguration,
  ])

  return { ticketConfig, uiConfig }
}
