import { useLadderSession } from './useLadderSession'

export function useTasks() {
  const { taskData, setTaskCompleted } = useLadderSession()
  return { ...taskData, setTaskCompleted }
}
