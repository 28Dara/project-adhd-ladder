export function getLocalDateKey(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

export function getPreviousLocalDateKey(date: string): string {
  const [year, month, day] = date.split('-').map(Number)
  return getLocalDateKey(new Date(year, month - 1, day - 1, 12))
}

export function getDaysInLadder(firstDay: string, today: string): number {
  // UTC is used only to number calendar dates after they have been resolved locally.
  const firstOrdinal = Date.parse(`${firstDay}T00:00:00Z`)
  const todayOrdinal = Date.parse(`${today}T00:00:00Z`)
  return Math.max(0, (todayOrdinal - firstOrdinal) / 86_400_000 + 1)
}
