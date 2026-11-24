import type { Task, TaskData, TaskLadder } from '../types/task'
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

  const task = data.tasks.find(
    (task) =>
      task.id === taskId &&
      task.user_id === userId &&
      task.archived_at === null,
  )
  if (!task || task.title === title) return data

  const renamed = {
    ...data,
    tasks: data.tasks.map((item) =>
      item === task ? { ...item, title } : item,
    ),
  }
  return updateTaskCompletion(renamed, taskId, today, false)
}
