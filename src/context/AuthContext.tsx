import { useEffect, useRef, useState, type ReactNode } from 'react'
import type { AuthError, Session } from '@supabase/supabase-js'
import { getSupabaseClient } from '../utils/supabaseClient'
import {
  AuthContext,
  type AuthCredentials,
  type AuthResult,
} from './authContextValue'

const unavailableMessage =
  'Authentication is unavailable. Please try again later.'

function getAuthErrorMessage(error: AuthError) {
  switch (error.code) {
    case 'invalid_credentials':
    case 'user_not_found':
      return 'The email or password is incorrect.'
    case 'email_address_invalid':
      return 'Enter a valid email address.'
    case 'email_exists':
    case 'user_already_exists':
      return 'An account already exists for this email. Try logging in.'
    case 'weak_password':
      return 'Choose a stronger password and try again.'
    case 'over_request_rate_limit':
    case 'over_email_send_rate_limit':
      return 'Too many attempts. Wait a moment and try again.'
    default:
      return unavailableMessage
  }
}

async function signOut() {
  try {
    const { error } = await getSupabaseClient().auth.signOut()
    return error ? 'Could not log out. Please try again.' : null
  } catch {
    return 'Could not log out. Please try again.'
  }
}

interface SessionState {
  session: Session | null
  isLoading: boolean
  sessionError: string | null
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const authInProgress = useRef(false)
  const [state, setState] = useState<SessionState>({
    session: null,
    isLoading: true,
    sessionError: null,
  })

  async function authenticate(
    method: 'signUp' | 'signInWithPassword',
    credentials: AuthCredentials,
  ): Promise<AuthResult> {
    if (authInProgress.current) {
      return {
        session: null,
        error:
          'An authentication request is already in progress. Try again when it finishes.',
      }
    }

    authInProgress.current = true
    try {
      const { data, error } =
        await getSupabaseClient().auth[method](credentials)
      return error
        ? { session: null, error: getAuthErrorMessage(error) }
        : { session: data.session, error: null }
    } catch {
      return { session: null, error: unavailableMessage }
    } finally {
      authInProgress.current = false
    }
  }

  useEffect(() => {
    let active = true
    let receivedAuthChange = false
    let unsubscribe: (() => void) | undefined

    function updateSession(
      session: Session | null,
      sessionError: string | null = null,
    ) {
      if (active) setState({ session, isLoading: false, sessionError })
    }

    async function restoreSession() {
      try {
        const { auth } = getSupabaseClient()
        const {
          data: { subscription },
        } = auth.onAuthStateChange((event, session) => {
          if (event === 'INITIAL_SESSION') return
          receivedAuthChange = true
          updateSession(session)
        })
        unsubscribe = () => subscription.unsubscribe()

        const { data, error } = await auth.getSession()
        // A newer auth event takes precedence over the initial read.
        if (!receivedAuthChange) {
          updateSession(data.session, error ? unavailableMessage : null)
        }
      } catch {
        if (!receivedAuthChange) updateSession(null, unavailableMessage)
      }
    }

    void restoreSession()

    return () => {
      active = false
      unsubscribe?.()
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{
        ...state,
        user: state.session?.user ?? null,
        signUp: (credentials) => authenticate('signUp', credentials),
        signInWithPassword: (credentials) =>
          authenticate('signInWithPassword', credentials),
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
