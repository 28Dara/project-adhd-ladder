import { useLadderSession } from './useLadderSession'

export function useTasks() {
  const { taskData, createTask, renameTask, archiveTask, setTaskCompleted } =
    useLadderSession()
  return { ...taskData, createTask, renameTask, archiveTask, setTaskCompleted }
}
