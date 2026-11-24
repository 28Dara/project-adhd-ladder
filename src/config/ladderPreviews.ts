import type { TaskLadder } from '../types/task'

interface LadderSummaryPreview {
  todaySteps: number
  totalSteps: number
  daysOnLadder: number
  joinedOn: { date: string; label: string }
}

const demoHistory = {
  daysOnLadder: 20,
  joinedOn: { date: '2026-11-01', label: 'Nov 1, 2026' },
}

export const ladderSummaryPreviews: Record<TaskLadder, LadderSummaryPreview> = {
  activities: { ...demoHistory, todaySteps: 1, totalSteps: 12 },
  learning: { ...demoHistory, todaySteps: 2, totalSteps: 36 },
}
