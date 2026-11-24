import type { TaskData } from '../types/task'

export function getLadderProgress(
  { tasks, completions }: TaskData,
  today: string,
) {
  const tasksById = new Map(tasks.map((task) => [task.id, task]))
  const counted = new Set<string>()
  const activities = { todaySteps: 0, totalSteps: 0 }
  const learning = { todaySteps: 0, totalSteps: 0 }
  const progress = { activities, learning }

  for (const { task_id, user_id, completed_date } of completions) {
    const task = tasksById.get(task_id)
    if (!task || task.user_id !== user_id || completed_date > today) continue

    const key = `${task_id}:${completed_date}`
    if (counted.has(key)) continue
    counted.add(key)

    const counter = completed_date === today ? 'todaySteps' : 'totalSteps'
    progress[task.ladder][counter] += 1
  }

  return {
    ...progress,
    life: {
      todaySteps: activities.todaySteps + learning.todaySteps,
      totalSteps: activities.totalSteps + learning.totalSteps,
    },
  }
}
