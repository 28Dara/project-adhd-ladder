export type HealthGoalId = 'nutrition' | 'sleep' | 'movement'

export interface HealthCheck extends Readonly<Record<HealthGoalId, boolean>> {
  readonly user_id: string
  readonly date: string
}
