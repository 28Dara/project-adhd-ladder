import { useOutletContext } from 'react-router'
import type { HealthCheck, HealthGoalId } from '../types/health'
import type { Quote } from '../types/quote'
import type { TaskData, TaskNameEdit } from '../types/task'

export interface LadderSession {
  taskData: TaskData
  setTaskCompleted: (taskId: string, checked: boolean) => void
  taskNames: Partial<Record<string, TaskNameEdit>>
  updateTaskName: (id: string, edit: TaskNameEdit | undefined) => void
  healthChecks: readonly HealthCheck[]
  setHealthGoal: (goalId: HealthGoalId, checked: boolean) => void
  dailyQuote: { date: string; quote: Quote } | undefined
  revealQuote: () => void
}

export function useLadderSession() {
  return useOutletContext<LadderSession>()
}
