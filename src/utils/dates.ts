export function getLocalDateKey(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

export function getPreviousLocalDateKey(date: string): string {
  const [year, month, day] = date.split('-').map(Number)
  return getLocalDateKey(new Date(year, month - 1, day - 1, 12))
}
