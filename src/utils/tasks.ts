import type { Task, TaskData, TaskLadder } from '../types/task'
import { getLocalDateKey } from './dates'
import { updateTaskCompletion } from './taskCompletions'

export const MAX_ACTIVE_TASKS = 4

function normalizeTaskTitle(title: string): string {
  return title.trim().replace(/^./u, (first) => first.toUpperCase())
}

export function getActiveTasks(tasks: readonly Task[], ladder: TaskLadder) {
  return tasks.filter(
    (task) => task.ladder === ladder && task.archived_at === null,
  )
}

function findActiveTask(
  tasks: readonly Task[],
  userId: string,
  taskId: string,
): Task | undefined {
  return tasks.find(
    (task) =>
      task.id === taskId &&
      task.user_id === userId &&
      task.archived_at === null,
  )
}

export function addTask(data: TaskData, task: Task): TaskData {
  const title = normalizeTaskTitle(task.title)
  if (
    !title ||
    getActiveTasks(data.tasks, task.ladder).length >= MAX_ACTIVE_TASKS ||
    data.tasks.some((existing) => existing.id === task.id)
  ) {
    return data
  }

  return { ...data, tasks: [...data.tasks, { ...task, title }] }
}

export function renameTaskTitle(
  data: TaskData,
  userId: string,
  taskId: string,
  nextTitle: string,
  today: string,
): TaskData {
  const title = normalizeTaskTitle(nextTitle)
  if (!title) return data

  const task = findActiveTask(data.tasks, userId, taskId)
  if (!task || task.title === title) return data

  const renamed = {
    ...data,
    tasks: data.tasks.map((item) =>
      item === task ? { ...item, title } : item,
    ),
  }
  return updateTaskCompletion(renamed, taskId, today, false)
}

export function archiveTask(
  data: TaskData,
  userId: string,
  taskId: string,
  now: Date,
): TaskData {
  const task = findActiveTask(data.tasks, userId, taskId)
  if (!task) return data

  const hasAnotherActiveTask = getActiveTasks(data.tasks, task.ladder).some(
    (item) => item.user_id === userId && item.id !== taskId,
  )
  if (!hasAnotherActiveTask) return data

  const withoutToday = updateTaskCompletion(
    data,
    taskId,
    getLocalDateKey(now),
    false,
  )
  const archived = { ...task, archived_at: now.toISOString() }
  return {
    ...withoutToday,
    tasks: data.tasks.map((item) => (item === task ? archived : item)),
  }
}
