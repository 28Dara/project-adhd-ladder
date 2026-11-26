import type { HealthCheck } from '../types/health'
import type { TaskData } from '../types/task'
import { getPreviousLocalDateKey } from './dates'
import { getHealthTone } from './health'

function* getValidCompletions({ tasks, completions }: TaskData, today: string) {
  const tasksById = new Map(tasks.map((task) => [task.id, task]))
  const counted = new Set<string>()
  for (const { task_id, user_id, completed_date } of completions) {
    const task = tasksById.get(task_id)
    if (!task || task.user_id !== user_id || completed_date > today) continue

    const key = `${task_id}:${completed_date}`
    if (counted.has(key)) continue
    counted.add(key)
    yield { ladder: task.ladder, date: completed_date }
  }
}

export function getLadderProgress(data: TaskData, today: string) {
  const activities = { todaySteps: 0, totalSteps: 0 }
  const learning = { todaySteps: 0, totalSteps: 0 }
  const progress = { activities, learning }

  for (const { ladder, date } of getValidCompletions(data, today)) {
    const counter = date === today ? 'todaySteps' : 'totalSteps'
    progress[ladder][counter] += 1
  }

  return {
    ...progress,
    life: {
      todaySteps: activities.todaySteps + learning.todaySteps,
      totalSteps: activities.totalSteps + learning.totalSteps,
    },
  }
}

export function getStreakDays(
  data: TaskData,
  healthChecks: readonly HealthCheck[],
  today: string,
  firstDay?: string,
): number {
  const daysWithSteps = new Set<string>()
  for (const { date } of getValidCompletions(data, today)) {
    daysWithSteps.add(date)
  }
  const healthByDay = new Map(healthChecks.map((check) => [check.date, check]))
  let streak = 0
  let day = getPreviousLocalDateKey(today)

  while (!firstDay || day >= firstDay) {
    const previousDay = getPreviousLocalDateKey(day)
    if (daysWithSteps.has(day)) {
      streak += 1
    } else {
      // Going backwards, the first reset ends the current streak.
      if (!daysWithSteps.has(previousDay)) break
      const tone = getHealthTone(
        healthByDay.get(day),
        healthByDay.get(previousDay),
        day === firstDay,
      )
      if (tone === 'danger') break
    }
    day = previousDay
  }

  return streak
}
