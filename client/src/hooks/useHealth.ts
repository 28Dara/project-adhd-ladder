import { HEALTH_STATUSES } from '../config/healthPreview'
import { getHealthLevel, isHealthStreakEligible } from '../utils/health'
import { useLadderSession } from './useLadderSession'
import { useRegistrationDate } from './useRegistrationDate'

export function useHealth() {
  const { healthChecks, today, toggleHealthGoal } = useLadderSession()
  const joinedOn = useRegistrationDate()
  const healthByDate = new Map(healthChecks.map((check) => [check.date, check]))
  const todayCheck = healthByDate.get(today)
  const level = getHealthLevel(healthByDate, today)

  return {
    healthByDate,
    today,
    todayCheck,
    toggleHealthGoal,
    status: HEALTH_STATUSES[level],
    streakEligible: isHealthStreakEligible(level),
    joinedOn,
  }
}
