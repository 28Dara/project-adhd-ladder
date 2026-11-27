import { createContext } from 'react'
import type { Session, User } from '@supabase/supabase-js'

export interface AuthCredentials {
  email: string
  password: string
}

export interface SignUpCredentials extends AuthCredentials {
  displayName: string
}

export interface AuthResult {
  session: Session | null
  error: string | null
}

interface AuthContextValue {
  session: Session | null
  user: User | null
  isLoading: boolean
  sessionError: string | null
  retrySession: () => void
  signUp: (credentials: SignUpCredentials) => Promise<AuthResult>
  signInWithPassword: (credentials: AuthCredentials) => Promise<AuthResult>
  signOut: () => Promise<string | null>
}

export const AuthContext = createContext<AuthContextValue | null>(null)
