export type HealthGoalId = 'nutrition' | 'sleep' | 'movement'

// A record exists after interaction even if every goal is unchecked.
export interface HealthCheck extends Readonly<Record<HealthGoalId, boolean>> {
  readonly user_id: string
  readonly date: string
}
