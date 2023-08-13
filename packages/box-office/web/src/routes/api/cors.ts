const allowed = [
  'https://chicago-tickets-cms.netlify.app',
  'https://manage.tickets.arthaus.mt',
]

export function getCrossOriginHeader(headers: Headers) {
  const origin = headers.get('origin')

  if (origin && allowed.includes(origin)) {
    return {
      'Access-Control-Allow-Origin': origin,
    }
  }
}
