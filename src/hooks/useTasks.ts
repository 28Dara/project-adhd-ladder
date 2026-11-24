import { useLadderSession } from './useLadderSession'

export function useTasks() {
  return useLadderSession().taskData
}
