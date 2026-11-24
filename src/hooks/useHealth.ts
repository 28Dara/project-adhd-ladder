import { useLadderSession } from './useLadderSession'
import { useLocalDateKey } from './useLocalDateKey'

export function useHealth() {
  const { healthChecks, setHealthGoal } = useLadderSession()
  const today = useLocalDateKey()
  const todayCheck = healthChecks.find((check) => check.date === today)

  return { healthChecks, todayCheck, setHealthGoal }
}
