import { EmailPlugin, LOG_LEVEL, SlackPlugin } from '@james-camilleri/logger'
import { LOG_EMAILS, MAILJET_API_KEY, MAILJET_SECRET_KEY, SLACK_WEBHOOK } from '$env/static/private'
import CONFIG from '$lib/config.js'
import { createTransport } from 'nodemailer'
import { log } from 'shared/utils'

const { host, port } = CONFIG.EMAIL

const transport = createTransport({
  name: 'tickets@arthaus.mt',
  host,
  port,
  auth: {
    user: MAILJET_API_KEY,
    pass: MAILJET_SECRET_KEY,
  },
  pool: true,
  secure: true,
})

const emailPlugins = LOG_EMAILS.split(',').map((email) => {
  const plugin = new EmailPlugin(transport, { from: 'tickets@arthaus.mt', to: email })
  plugin.level = LOG_LEVEL.ERROR

  return plugin
})

log.loadPlugin(new SlackPlugin(SLACK_WEBHOOK))
log.loadPlugins(emailPlugins)
