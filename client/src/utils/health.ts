import type { HealthCheck } from '../types/health'

function countHealthGoals(check: HealthCheck | undefined) {
  if (!check) return 0
  return Number(check.nutrition) + Number(check.sleep) + Number(check.movement)
}

export function getHealthTone(
  today: HealthCheck | undefined,
  yesterday: HealthCheck | undefined,
  isFirstDay: boolean,
) {
  const todayCount = countHealthGoals(today)
  if (todayCount === 3) return 'success'
  if (todayCount > 0 || isFirstDay || countHealthGoals(yesterday) > 0) {
    return 'warning'
  }
  return 'danger'
}
