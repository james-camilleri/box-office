import { schedule } from '@netlify/functions'
import { clearLocks } from '@the-gods/box-office/cms'

export const handler = schedule('0,15,30,45 * * * *', clearLocks)
