export function getAllTimeZones(): string[] {
  // @ts-expect-error: This hasn't been added to the definitions yet.
  return Intl.supportedValuesOf('timeZone')
}

export function getUserTimeZone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone
}

export function getZonedDate(dateTime: string, timeZone: string) {
  return new Intl.DateTimeFormat(undefined, { dateStyle: 'full', timeZone }).format(
    new Date(dateTime),
  )
}

export function getZonedTime(dateTime: string, timeZone: string) {
  return new Intl.DateTimeFormat(undefined, { timeStyle: 'short', timeZone }).format(
    new Date(dateTime),
  )
}
