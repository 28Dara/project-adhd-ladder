import type { Task, TaskData } from '../types/task'
import { getLocalDateKey } from '../utils/dates'

const examples = {
  gym: { ladder: 'activities', title: 'Gym' },
  'read-book': { ladder: 'activities', title: 'Read my Book' },
  'guitar-practice': { ladder: 'activities', title: 'Guitar Practice' },
  'learn-something': { ladder: 'learning', title: 'Learned something new' },
  'study-language': { ladder: 'learning', title: 'Studied a language' },
  'study-music-theory': { ladder: 'learning', title: 'Studied music theory' },
} as const satisfies Record<string, Pick<Task, 'ladder' | 'title'>>

const completedExamples: readonly (keyof typeof examples)[] = [
  'gym',
  'learn-something',
  'study-language',
]

export function createExampleTaskData(userId: string, now: Date): TaskData {
  const taskId = (key: string) => `${userId}:${key}`
  const createdAt = now.toISOString()
  const completedDate = getLocalDateKey(now)

  return {
    tasks: Object.entries(examples).map(([key, example]) => ({
      ...example,
      id: taskId(key),
      user_id: userId,
      created_at: createdAt,
      archived_at: null,
    })),
    completions: completedExamples.map((key) => ({
      id: `${taskId(key)}:${completedDate}`,
      user_id: userId,
      task_id: taskId(key),
      completed_date: completedDate,
    })),
  }
}
