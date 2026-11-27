import type { HealthCheck } from '../types/health'
import { getPreviousLocalDateKey } from './dates'

function countHealthGoals(check: HealthCheck) {
  return Number(check.nutrition) + Number(check.sleep) + Number(check.movement)
}

export function getHealthLevel(
  healthByDate: ReadonlyMap<string, HealthCheck>,
  date: string,
) {
  // A recorded day overrides inheritance, including when all goals are unchecked.
  // Even a green day has decayed to zero after three days.
  let day = date
  for (let daysAgo = 0; daysAgo < 3; daysAgo += 1) {
    const check = healthByDate.get(day)
    if (check) return Math.max(0, countHealthGoals(check) - daysAgo)
    day = getPreviousLocalDateKey(day)
  }
  return 0
}

export function isHealthStreakEligible(level: number) {
  return level >= 2
}
