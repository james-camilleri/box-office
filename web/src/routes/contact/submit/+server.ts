import sanityClient from '@sanity/client'
import CONFIG from '$lib/config'
import nodemailer from 'nodemailer'

import type { ContactPayload, ContactRequestEvent, ContactResponse } from '../types'

export async function POST({
  request,
}: {
  request: ContactRequestEvent
}): Promise<ContactResponse> {
  try {
    const payload = await request.json()
    await Promise.all([sendEmail(payload), postToSanity(payload)])
  } catch (e) {
    return {
      status: 500,
      body: e.message,
    }
  }

  return {
    status: 200,
    body: 'Message sent successfully',
  }
}

async function sendEmail(emailPayload: ContactPayload) {
  const { name, email, subject, message } = emailPayload
  const { host, port, destination } = CONFIG.CONTACT_EMAIL
  const { EMAIL_USERNAME, EMAIL_PASSWORD } = process.env

  if (!name || !email || !subject || !message) {
    throw new Error('Missing required fields')
  }

  const subjectText = subject ? `Contact form submission: ${subject}` : 'Contact form submission'

  const transport = nodemailer.createTransport({
    name: destination,
    host,
    port,
    auth: {
      user: EMAIL_USERNAME,
      pass: EMAIL_PASSWORD,
    },
    pool: true,
    secure: true,
  })

  await transport.sendMail({
    from: `${name} <${destination}>`,
    replyTo: email,
    to: destination,
    subject: subjectText,
    text: message,
  })
}

async function postToSanity(sanityPayload: ContactPayload) {
  const { name, email, subject, message } = sanityPayload
  const { projectId, dataset, apiVersion } = CONFIG.SANITY
  const { SANITY_API_KEY } = process.env

  const client = sanityClient({
    projectId,
    dataset,
    apiVersion,
    token: SANITY_API_KEY,
    useCdn: false,
  })

  await client.create({
    _type: 'formContact',
    name,
    email,
    subject,
    message,
  })
}
