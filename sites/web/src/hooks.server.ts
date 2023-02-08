import { SlackPlugin } from '@james-camilleri/logger'
import { SLACK_WEBHOOK } from '$env/static/private'
import { log } from 'shared/utils'

log.loadPlugin(new SlackPlugin(SLACK_WEBHOOK))
