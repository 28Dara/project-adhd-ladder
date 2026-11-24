import type { HealthGoalId } from '../types/health'

export const HEALTH_PREVIEW_STATUSES = [
  { tone: 'success', message: "You're doing great!" },
  { tone: 'warning', message: 'You got it, keep it up!' },
  { tone: 'danger', message: 'Take a look at your health!' },
] as const

export const HEALTH_PREVIEW_STATUS = HEALTH_PREVIEW_STATUSES[1]

export const HEALTH_GOALS = [
  { id: 'nutrition', label: 'Good Nutrition' },
  { id: 'sleep', label: 'Good Sleep' },
  { id: 'movement', label: 'Daily Movement' },
] as const satisfies readonly { id: HealthGoalId; label: string }[]
