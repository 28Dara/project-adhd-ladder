import { useLadderSession } from './useLadderSession'

export function useTasks() {
  const { taskData, createTask, renameTask, archiveTask, toggleTaskCompleted } =
    useLadderSession()
  return {
    ...taskData,
    createTask,
    renameTask,
    archiveTask,
    toggleTaskCompleted,
  }
}
