import { getLocalDateKey } from '../utils/dates'
import { useAuth } from './useAuth'
import { useLadderSession } from './useLadderSession'

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
})

export function useRegistrationDate() {
  const { session } = useAuth()
  const { sessionStartedOn } = useLadderSession()
  const createdAt = session?.user.created_at
  const registeredAt = createdAt ? new Date(createdAt) : undefined

  if (registeredAt && !Number.isNaN(registeredAt.getTime())) {
    return {
      date: getLocalDateKey(registeredAt),
      label: dateFormatter.format(registeredAt),
      isSimulated: false,
    }
  }

  const localDate = new Date(`${sessionStartedOn}T12:00:00`)
  return {
    date: sessionStartedOn,
    label: `${dateFormatter.format(localDate)} (simulated)`,
    isSimulated: true,
  }
}
