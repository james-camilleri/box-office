import { error, type RequestHandler } from '@sveltejs/kit'
import { LOCKED_SEATS } from 'shared/queries'
import { log } from 'shared/utils'
import { sanity } from '../../sanity.js'

interface Body {
  show: string
  seats: string[]
}

interface LockedSeat {
  _id: string
  _rev: string
  locked: boolean
}

export const POST: RequestHandler = async ({ request }) => {
  const { show, seats } = (await request.json()) as Body
  log.info(`Checking for locks on seat(s) ${seats.join(', ')} for show ${show}`)

  let lockData: LockedSeat[] = []
  try {
    lockData = (await sanity.noCdn.fetch(LOCKED_SEATS, { show, seats })) as LockedSeat[]
  } catch (e) {
    log.error(`Could not retrieve locked seats`)
    throw error(e.response.statusCode, 'failed-to-retrieve-locked-seats')
  }

  const lockedSeats = lockData.filter(({ locked }) => locked)
  if (lockedSeats.length) {
    log.error(`Seat(s) ${lockedSeats?.map(({ _id }) => _id).join(', ')} already locked`)
    throw error(409, 'already-locked')
  }

  log.info('Attempting to lock seats')

  try {
    const lockTime = new Date()
    const lockResponse = await Promise.all(
      lockData.map((seat) =>
        sanity.noCdn
          .patch(seat._id)
          .ifRevisionId(seat._rev)
          .setIfMissing({ locks: [] })
          .append('locks', [{ show, lockTime }])
          .commit({ autoGenerateArrayKeys: true }),
      ),
    )

    console.log(lockResponse)

    return new Response()
  } catch (e) {
    log.error(`Failed to lock seat(s) ${seats.join(', ')}`)
    throw error(e.response.statusCode, 'failed-to-lock')
  }
}
