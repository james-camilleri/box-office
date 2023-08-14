import { schedule } from '@netlify/functions'
import { checkForDuplicateBookings } from '@the-gods/box-office/cms'

export const handler = schedule('0 0 * * *', checkForDuplicateBookings)
