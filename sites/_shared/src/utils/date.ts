export function getAllTimeZones(): string[] {
  // @ts-expect-error: This hasn't been added to the definitions yet.
  return Intl.supportedValuesOf('timeZone')
}

export function getUserTimeZone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone
}
