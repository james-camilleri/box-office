import { json } from '@sveltejs/kit'
import { DISCOUNT } from 'shared/queries'

import { sanity } from '../../../sanity.js'

/** @type {import('./$types').RequestHandler} */
export async function GET({ params }) {
  const discount = await sanity.fetch(DISCOUNT, { code: params.code })

  return json(discount ?? undefined)
}
