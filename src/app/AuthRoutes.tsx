import { useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { Navigate, Outlet } from 'react-router'
import Header from '../components/Header/Header'
import LadderSelector from '../components/LadderSelector/LadderSelector'
import RoutePanel from '../components/RoutePanel/RoutePanel'
import { EXAMPLE_QUOTES } from '../config/exampleQuotes'
import { createExampleTaskData } from '../config/exampleTasks'
import { useAuth } from '../hooks/useAuth'
import type { LadderSession } from '../hooks/useLadderSession'
import { useLocalDateKey } from '../hooks/useLocalDateKey'
import type { HealthCheck } from '../types/health'
import type { Task } from '../types/task'
import { isTaskCompleted, updateTaskCompletion } from '../utils/taskCompletions'
import { addTask, archiveTask, renameTaskTitle } from '../utils/tasks'
import './AuthRoutes.css'

export function AuthSessionBoundary() {
  const { isLoading, sessionError, retrySession } = useAuth()

  if (isLoading) return <RoutePanel title="Checking your session…" busy />

  if (sessionError) {
    return (
      <RoutePanel title="Could not restore your session">
        <p role="alert">{sessionError}</p>
        <button
          className="route-panel__retry"
          type="button"
          onClick={retrySession}
        >
          Try again
        </button>
      </RoutePanel>
    )
  }

  return <Outlet />
}

export function GuestRoute() {
  const { session } = useAuth()
  return session ? <Navigate to="/life" replace /> : <Outlet />
}

type LogoutState =
  | { status: 'idle' | 'pending' | 'succeeded' }
  | { status: 'failed'; message: string }

export function ProtectedRoute() {
  const { session, signOut } = useAuth()
  const [logout, setLogout] = useState<LogoutState>({ status: 'idle' })
  const isSigningOut = logout.status === 'pending'

  async function handleLogout() {
    if (isSigningOut) return
    setLogout({ status: 'pending' })
    const error = await signOut()
    setLogout(
      error ? { status: 'failed', message: error } : { status: 'succeeded' },
    )
  }

  if (logout.status === 'succeeded') return <Navigate to="/" replace />

  if (!session) {
    // The auth event can arrive before the logout promise settles.
    return isSigningOut ? (
      <RoutePanel title="Logging out…" busy />
    ) : (
      <Navigate to="/login" replace />
    )
  }

  return (
    <PrivateLayout
      key={session.user.id}
      user={session.user}
      logout={logout}
      onLogout={handleLogout}
    />
  )
}

function PrivateLayout({
  user,
  logout,
  onLogout,
}: {
  user: Session['user']
  logout: LogoutState
  onLogout: () => void
}) {
  const [displayName, setDisplayName] = useState<string>()
  const { dateKey: today, syncDate } = useLocalDateKey()
  const [sessionStartedOn] = useState(today)
  const [taskData, setTaskData] = useState(() =>
    createExampleTaskData(user.id, new Date()),
  )
  const [taskDrafts, setTaskDrafts] = useState<LadderSession['taskDrafts']>({})
  const [healthChecks, setHealthChecks] = useState<readonly HealthCheck[]>([])
  const [dailyQuote, setDailyQuote] = useState<LadderSession['dailyQuote']>()
  const isSigningOut = logout.status === 'pending'

  const ladderSession: LadderSession = {
    today,
    sessionStartedOn,
    taskData,
    createTask: (ladder, title) => {
      const task: Task = {
        id: crypto.randomUUID(),
        user_id: user.id,
        ladder,
        title,
        created_at: new Date().toISOString(),
        archived_at: null,
      }
      setTaskData((data) => addTask(data, task))
    },
    renameTask: (taskId, title) => {
      const date = syncDate()
      setTaskData((data) => renameTaskTitle(data, user.id, taskId, title, date))
    },
    archiveTask: (taskId) => {
      const now = new Date()
      syncDate(now)
      setTaskData((data) => archiveTask(data, user.id, taskId, now))
    },
    toggleTaskCompleted: (taskId) => {
      const date = syncDate()
      setTaskData((data) =>
        updateTaskCompletion(
          data,
          taskId,
          date,
          !isTaskCompleted(data.completions, taskId, date),
        ),
      )
    },
    taskDrafts,
    setTaskDraft: (key, draft) =>
      setTaskDrafts((drafts) => ({ ...drafts, [key]: draft })),
    healthChecks,
    toggleHealthGoal: (goalId) => {
      const date = syncDate()
      setHealthChecks((checks) => {
        const current = checks.find((check) => check.date === date)

        if (current) {
          return checks.map((check) =>
            check === current
              ? { ...check, [goalId]: !current[goalId] }
              : check,
          )
        }

        const newCheck = {
          user_id: user.id,
          date,
          nutrition: false,
          sleep: false,
          movement: false,
          [goalId]: true,
        }
        return [...checks, newCheck]
      })
    },
    dailyQuote,
    revealQuote: () => {
      const date = syncDate()
      const quote =
        EXAMPLE_QUOTES[Math.floor(Math.random() * EXAMPLE_QUOTES.length)]
      setDailyQuote((current) =>
        current?.date === date ? current : { date, quote },
      )
    },
  }

  return (
    <div className="private-route">
      <Header
        sectionNavigation={<LadderSelector />}
        displayName={displayName ?? user.email}
        onDisplayNameChange={setDisplayName}
        navigation={
          <button
            className="site-header__control site-header__control--filled private-route__logout"
            type="button"
            disabled={isSigningOut}
            onClick={onLogout}
          >
            {isSigningOut ? 'Logging out…' : 'Log out'}
          </button>
        }
      />
      {logout.status === 'failed' && (
        <p className="private-route__logout-error" role="alert">
          {logout.message}
        </p>
      )}
      <Outlet context={ladderSession} />
    </div>
  )
}
