import { useState } from 'react'
import { Navigate, Outlet } from 'react-router'
import Header from '../components/Header/Header'
import RoutePanel from '../components/RoutePanel/RoutePanel'
import { useAuth } from '../hooks/useAuth'
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
    <div className="private-route">
      <Header
        navigation={
          <button
            className="site-header__control site-header__control--filled private-route__logout"
            type="button"
            disabled={isSigningOut}
            onClick={handleLogout}
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
      <Outlet />
    </div>
  )
}
