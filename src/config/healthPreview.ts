import type { HealthGoalId } from '../types/health'

export const HEALTH_STATUS_MESSAGES = {
  success: "You're doing great!",
  warning: 'You got it, keep it up!',
  danger: 'Take a look at your health!',
} as const

export const HEALTH_GOALS = [
  { id: 'nutrition', label: 'Good Nutrition' },
  { id: 'sleep', label: 'Good Sleep' },
  { id: 'movement', label: 'Daily Movement' },
] as const satisfies readonly { id: HealthGoalId; label: string }[]
