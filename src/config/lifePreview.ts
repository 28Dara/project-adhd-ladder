export const lifePreview = {
  streakDays: 20,
  daysOnLadder: 20,
  joinedOn: { date: '2026-11-01', label: 'Nov 1, 2026' },
  ladders: [
    {
      path: '/health',
      label: 'Health',
    },
    { ladder: 'activities', label: 'My Activities' },
    { ladder: 'learning', label: 'Learning' },
  ] as const,
}
