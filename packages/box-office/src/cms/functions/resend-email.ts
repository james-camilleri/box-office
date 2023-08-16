import { Handler } from '@netlify/functions'

const APP_URL = 'https://tickets.arthaus.mt'

export const resendEmail: Handler = async (event) => {
  const response = await fetch(`${APP_URL}/api/booking/email`, {
    method: 'POST',
    headers: {
      origin: APP_URL,
    },
    body: event.body,
  })

  return {
    statusCode: response.status,
    body: await response.text(),
  }
}