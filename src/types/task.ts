export type TaskLadder = 'activities' | 'learning'

export interface Task {
  readonly id: string
  readonly user_id: string
  readonly ladder: TaskLadder
  readonly title: string
  readonly created_at: string
  readonly archived_at: string | null
}

export interface TaskCompletion {
  readonly id: string
  readonly user_id: string
  readonly task_id: string
  readonly completed_date: string
}

export interface TaskData {
  readonly tasks: readonly Task[]
  readonly completions: readonly TaskCompletion[]
}

export interface TaskNameEdit {
  title?: string
  draft?: string
}
