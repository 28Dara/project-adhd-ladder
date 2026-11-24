import { useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { Navigate, Outlet } from 'react-router'
import Header from '../components/Header/Header'
import LadderSelector from '../components/LadderSelector/LadderSelector'
import RoutePanel from '../components/RoutePanel/RoutePanel'
import { EXAMPLE_QUOTES } from '../config/exampleQuotes'
import { useAuth } from '../hooks/useAuth'
import type { LadderSession } from '../hooks/useLadderSession'
import { getLocalDateKey } from '../utils/dates'
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
  const [taskNames, setTaskNames] = useState<LadderSession['taskNames']>({})
  const [dailyQuote, setDailyQuote] = useState<LadderSession['dailyQuote']>()
  const isSigningOut = logout.status === 'pending'

  const ladderSession: LadderSession = {
    taskNames,
    updateTaskName: (id, edit) =>
      setTaskNames((names) => ({ ...names, [id]: edit })),
    dailyQuote,
    revealQuote: () => {
      const date = getLocalDateKey(new Date())
      if (date === dailyQuote?.date) return
      const quote =
        EXAMPLE_QUOTES[Math.floor(Math.random() * EXAMPLE_QUOTES.length)]
      setDailyQuote({ date, quote })
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
