export interface TaskPreview {
  id: string
  title: string
  completed: boolean
}

export interface LadderPreview {
  todaySteps: number
  totalSteps: number
  daysOnLadder: number
  joinedOn: { date: string; label: string }
  tasks: readonly TaskPreview[]
}

const demoHistory = {
  daysOnLadder: 20,
  joinedOn: { date: '2026-11-01', label: 'Nov 1, 2026' },
}

export const ladderPreviews: Record<'activities' | 'learning', LadderPreview> =
  {
    activities: {
      ...demoHistory,
      todaySteps: 1,
      totalSteps: 12,
      tasks: [
        { id: 'gym', title: 'Gym', completed: true },
        { id: 'read-book', title: 'Read my Book', completed: false },
        { id: 'guitar-practice', title: 'Guitar Practice', completed: false },
      ],
    },
    learning: {
      ...demoHistory,
      todaySteps: 2,
      totalSteps: 36,
      tasks: [
        {
          id: 'learn-something',
          title: 'Learned something new',
          completed: true,
        },
        { id: 'study-language', title: 'Studied a language', completed: true },
        {
          id: 'study-music-theory',
          title: 'Studied music theory',
          completed: false,
        },
      ],
    },
  }
