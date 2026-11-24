import type { TaskCompletion, TaskData } from '../types/task'

export function matchesTaskCompletion(
  completion: TaskCompletion,
  taskId: string,
  date: string,
) {
  return completion.task_id === taskId && completion.completed_date === date
}

export function createTaskCompletion(
  userId: string,
  taskId: string,
  date: string,
): TaskCompletion {
  return {
    id: `${taskId}:${date}`,
    user_id: userId,
    task_id: taskId,
    completed_date: date,
  }
}

export function updateTaskCompletion(
  data: TaskData,
  taskId: string,
  date: string,
  checked: boolean,
): TaskData {
  const task = data.tasks.find(
    (task) => task.id === taskId && task.archived_at === null,
  )
  if (!task) return data

  const matches = (completion: TaskCompletion) =>
    matchesTaskCompletion(completion, taskId, date)
  if (data.completions.some(matches) === checked) return data

  const completions = checked
    ? [...data.completions, createTaskCompletion(task.user_id, taskId, date)]
    : data.completions.filter((completion) => !matches(completion))
  return { ...data, completions }
}
