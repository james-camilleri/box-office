import { Handler } from '@netlify/functions'

const { FRONT_END_URL } = process.env

export const resendEmail: Handler = async (event) => {
  const response = await fetch(`${FRONT_END_URL}/api/booking/email`, {
    method: 'POST',
    headers: {
      origin: FRONT_END_URL ?? '',
    },
    body: event.body,
  })

  return {
    statusCode: response.status,
    body: await response.text(),
  }
}
