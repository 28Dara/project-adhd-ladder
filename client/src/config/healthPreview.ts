import type { HealthGoalId } from '../types/health'

export const HEALTH_STATUSES = [
  { tone: 'danger', message: 'Take a look at your health!' },
  { tone: 'caution', message: 'Good start, but could be better' },
  { tone: 'warning', message: 'You got it, keep it up!' },
  { tone: 'success', message: "You're doing great!" },
] as const

export const HEALTH_STATUS_LEGEND = [...HEALTH_STATUSES].reverse()

export const HEALTH_GOALS = [
  { id: 'nutrition', label: 'Good Nutrition' },
  { id: 'sleep', label: 'Good Sleep' },
  { id: 'movement', label: 'Daily Movement' },
] as const satisfies readonly { id: HealthGoalId; label: string }[]
