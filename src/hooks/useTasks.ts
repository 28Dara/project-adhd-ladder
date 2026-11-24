import { useLadderSession } from './useLadderSession'

export function useTasks() {
  const { taskData, createTask, renameTask, setTaskCompleted } =
    useLadderSession()
  return { ...taskData, createTask, renameTask, setTaskCompleted }
}
