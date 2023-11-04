import { Handler } from '@netlify/functions'

const { FRONT_END_URL } = process.env

export const triggerInvoiceWebhook: Handler = async (event) => {
  const appUrl = `${FRONT_END_URL?.includes('http') ? '' : 'https://'}${FRONT_END_URL}`
  const response = await fetch(`${appUrl}/api/invoice`, {
    method: 'POST',
    headers: {
      origin: appUrl,
    },
    body: event.body,
  })

  return {
    statusCode: response.status,
    body: await response.text(),
  }
}
