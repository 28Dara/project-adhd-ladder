interface LifeLadderPreview {
  path: '/health' | '/activities' | '/learning'
  label: string
  badge: string | number
  caption: string
}

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
      badge: '✓',
      caption: '3 of 3 goals completed',
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
