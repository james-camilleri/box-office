import { Handler } from '@netlify/functions'

const APP_URL = 'https://tickets.arthaus.mt'

export const handler: Handler = async (event) => {
  const { status, json } = await fetch(`${APP_URL}/api/booking/email`, {
    method: 'POST',
    body: event.body,
  })

  return {
    statusCode: status,
    body: await json(),
  }
}
