import { error } from '@sveltejs/kit'

import { sanity } from '../sanity.js'

const CONFIG_ID = 'configure'

/** @type {import('./$types').RequestHandler} */
export async function GET() {
  const configuration = await sanity.getDocument(CONFIG_ID)
  return new Response()
}
