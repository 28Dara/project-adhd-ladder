import { HEALTH_STATUS_MESSAGES } from '../config/healthPreview'
import { getPreviousLocalDateKey } from '../utils/dates'
import { getHealthTone } from '../utils/health'
import { useLadderSession } from './useLadderSession'
import { useLocalDateKey } from './useLocalDateKey'
import { useRegistrationDate } from './useRegistrationDate'

export function useHealth() {
  const { healthChecks, setHealthGoal } = useLadderSession()
  const today = useLocalDateKey()
  const joinedOn = useRegistrationDate(today)
  const todayCheck = healthChecks.find((check) => check.date === today)
  const yesterday = getPreviousLocalDateKey(today)
  const yesterdayCheck = healthChecks.find((check) => check.date === yesterday)
  const isFirstDay = !joinedOn.isSimulated && joinedOn.date === today
  const tone = getHealthTone(todayCheck, yesterdayCheck, isFirstDay)
  const status = { tone, message: HEALTH_STATUS_MESSAGES[tone] }

  return { healthChecks, today, todayCheck, setHealthGoal, status, joinedOn }
}
