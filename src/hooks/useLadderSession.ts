import { useOutletContext } from 'react-router'
import type { Quote } from '../types/quote'
import type { TaskNameEdit } from '../types/task'

export interface LadderSession {
  taskNames: Partial<Record<string, TaskNameEdit>>
  updateTaskName: (id: string, edit: TaskNameEdit | undefined) => void
  dailyQuote: { date: string; quote: Quote } | undefined
  revealQuote: () => void
}

export function useLadderSession() {
  return useOutletContext<LadderSession>()
}
