const LOCALE = 'en-GB'

export function getAllTimeZones(): string[] {
  return Intl.supportedValuesOf('timeZone')
}

export function getUserTimeZone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone
}

export function getZonedDate(dateTime: string, timeZone: string) {
  return new Intl.DateTimeFormat(LOCALE, { dateStyle: 'full', timeZone }).format(new Date(dateTime))
}

export function getZonedTime(dateTime: string, timeZone: string) {
  return new Intl.DateTimeFormat(LOCALE, { timeStyle: 'short', timeZone }).format(
    new Date(dateTime),
  )
}

export function formatShowDateTime(dateString: string, timeZone: string | undefined) {
  const date = new Date(dateString)
  return `${date.toLocaleDateString(LOCALE)} ${date
    .toLocaleTimeString(undefined, { timeZone })
    .split(':')
    .slice(0, 2)
    .join(':')}`
}

export function formatShowDateTimeLong(dateString: string, timeZone: string | undefined) {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat(LOCALE, {
    weekday: 'short',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    timeZone,
  })
    .format(date)
    .replaceAll(',', '')
    .toUpperCase()
}
