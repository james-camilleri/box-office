export function formatShowDateTime(dateString: string) {
  const date = new Date(dateString)
  return `${date.toLocaleDateString()} ${date
    .toLocaleTimeString()
    .split(':')
    .slice(0, 2)
    .join(':')}`
}
