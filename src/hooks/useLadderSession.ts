import { useOutletContext } from 'react-router'
import type { HealthCheck, HealthGoalId } from '../types/health'
import type { Quote } from '../types/quote'
import type { TaskData, TaskLadder } from '../types/task'

type TaskDraftKey = `create:${TaskLadder}` | `rename:${string}`

export interface LadderSession {
  today: string
  sessionStartedOn: string
  taskData: TaskData
  createTask: (ladder: TaskLadder, title: string) => void
  renameTask: (taskId: string, title: string) => void
  archiveTask: (taskId: string) => void
  toggleTaskCompleted: (taskId: string) => void
  taskDrafts: Partial<Record<TaskDraftKey, string>>
  setTaskDraft: (key: TaskDraftKey, draft: string | undefined) => void
  healthChecks: readonly HealthCheck[]
  toggleHealthGoal: (goalId: HealthGoalId) => void
  dailyQuote: { date: string; quote: Quote } | undefined
  revealQuote: () => void
}

export function useLadderSession() {
  return useOutletContext<LadderSession>()
}
