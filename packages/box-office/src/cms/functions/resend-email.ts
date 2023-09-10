import { Handler } from '@netlify/functions'

const { FRONT_END_URL } = process.env

export const resendEmail: Handler = async (event) => {
  const appUrl = `${FRONT_END_URL?.includes('http') ? '' : 'https://'}${FRONT_END_URL}`
  const response = await fetch(`${appUrl}/api/booking/email`, {
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
