import type { TaskCompletion, TaskData } from '../types/task'

function matchesTaskCompletion(
  completion: TaskCompletion,
  taskId: string,
  date: string,
) {
  return completion.task_id === taskId && completion.completed_date === date
}

export function isTaskCompleted(
  completions: readonly TaskCompletion[],
  taskId: string,
  date: string,
) {
  return completions.some((completion) =>
    matchesTaskCompletion(completion, taskId, date),
  )
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

  if (isTaskCompleted(data.completions, taskId, date) === checked) return data

  const completions = checked
    ? [...data.completions, createTaskCompletion(task.user_id, taskId, date)]
    : data.completions.filter(
        (completion) => !matchesTaskCompletion(completion, taskId, date),
      )
  return { ...data, completions }
}
