import type { RequestHandler } from '@sveltejs/kit'
import juice from 'juice'

import Email from './template/Email.svelte'

export const GET: RequestHandler = async ({ params }) => {
  const { html: rawHtml, css } = Email.render({
    event: {
      name: 'My Cool event',
    },
  })

  const html = juice(`<style>${css.code}</style>${rawHtml}`)

  return new Response(html)
}
