/** @type {import('@sveltejs/kit').HandleFetch} */
export function handleFetch(arg) {
  console.log('arg.request', arg.request)
  console.log('arg.event', arg.event)
  const { request, fetch } = arg

  return fetch(request)
}
