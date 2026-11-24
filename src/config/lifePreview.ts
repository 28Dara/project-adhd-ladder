import { HEALTH_PREVIEW_STATUS } from './healthPreview'

export const lifePreview = {
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
    { ladder: 'activities', label: 'My Activities' },
    { ladder: 'learning', label: 'Learning' },
  ] as const,
}
