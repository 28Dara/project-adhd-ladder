import { HEALTH_PREVIEW_STATUS } from './healthPreview'

type LifeLadderPreview = { label: string; caption: string } & (
  | { path: '/health'; tone: typeof HEALTH_PREVIEW_STATUS.tone }
  | { path: '/activities' | '/learning'; badge: number }
)

interface LifePreview {
  todaySteps: number
  totalSteps: number
  streakDays: number
  daysOnLadder: number
  joinedOn: { date: string; label: string }
  ladders: LifeLadderPreview[]
}

export const lifePreview: LifePreview = {
  todaySteps: 2,
  totalSteps: 28,
  streakDays: 20,
  daysOnLadder: 20,
  joinedOn: { date: '2026-11-01', label: 'Nov 1, 2026' },
  ladders: [
    {
      path: '/health',
      label: 'Health',
      tone: HEALTH_PREVIEW_STATUS.tone,
      caption: HEALTH_PREVIEW_STATUS.message,
    },
    {
      path: '/activities',
      label: 'My Activities',
      badge: 1,
      caption: 'step today',
    },
    { path: '/learning', label: 'Learning', badge: 1, caption: 'step today' },
  ],
}
