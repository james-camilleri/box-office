import type { RequestEvent } from '@sveltejs/kit'

export interface ContactPayload {
  name: string
  email: string
  subject?: string
  message: string
}

export interface ContactRequestEvent extends RequestEvent {
  json: () => Promise<ContactPayload>
}

export interface ContactResponse {
  status: number
  body: string
}
