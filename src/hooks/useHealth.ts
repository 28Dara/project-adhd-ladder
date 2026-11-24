import { HEALTH_STATUS_MESSAGES } from '../config/healthPreview'
import { getLocalDateKey, getPreviousLocalDateKey } from '../utils/dates'
import { getHealthTone } from '../utils/health'
import { useAuth } from './useAuth'
import { useLadderSession } from './useLadderSession'
import { useLocalDateKey } from './useLocalDateKey'

export function useHealth() {
  const { session } = useAuth()
  const { healthChecks, setHealthGoal } = useLadderSession()
  const today = useLocalDateKey()
  const todayCheck = healthChecks.find((check) => check.date === today)
  const yesterday = getPreviousLocalDateKey(today)
  const yesterdayCheck = healthChecks.find((check) => check.date === yesterday)
  const createdAt = session?.user.created_at
  const isFirstDay =
    !!createdAt && getLocalDateKey(new Date(createdAt)) === today
  const tone = getHealthTone(todayCheck, yesterdayCheck, isFirstDay)
  const status = { tone, message: HEALTH_STATUS_MESSAGES[tone] }

  return { healthChecks, today, todayCheck, setHealthGoal, status }
}
