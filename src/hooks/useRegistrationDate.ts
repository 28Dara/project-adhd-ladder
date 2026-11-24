import { getLocalDateKey } from '../utils/dates'
import { useAuth } from './useAuth'

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
})

export function useRegistrationDate(today: string) {
  const { session } = useAuth()
  const createdAt = session?.user.created_at
  const registeredAt = createdAt ? new Date(createdAt) : undefined

  if (registeredAt && !Number.isNaN(registeredAt.getTime())) {
    return {
      date: getLocalDateKey(registeredAt),
      label: dateFormatter.format(registeredAt),
      isSimulated: false,
    }
  }

  const localToday = new Date(`${today}T12:00:00`)
  return {
    date: today,
    label: `${dateFormatter.format(localToday)} (simulated)`,
    isSimulated: true,
  }
}
