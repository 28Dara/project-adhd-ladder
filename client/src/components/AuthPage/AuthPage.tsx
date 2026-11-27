import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type SubmitEvent,
} from 'react'
import { Link } from 'react-router'
import { DISPLAY_NAME_MAX_LENGTH } from '../../config/displayName'
import { useAuth } from '../../hooks/useAuth'
import Header from '../Header/Header'
import './AuthPage.css'

const stairs = [
  { top: '0%', left: '54%' },
  { top: '6%', left: '47%' },
  { top: '12%', left: '40%' },
  { top: '32%', left: '24%' },
  { top: '45%', left: '29%' },
  { top: '70%', left: '34%' },
  { bottom: '0%', left: '41%' },
]

const passwordIcon = (
  <svg aria-hidden="true" viewBox="0 0 24 24">
    <rect x="4" y="10" width="16" height="12" rx="2" />
    <path d="M7 10V7a5 5 0 0 1 10 0v3m-5 5v3" />
  </svg>
)

function PasswordVisibilityButton({
  inputId,
  label,
  visible,
  onToggle,
}: {
  inputId: string
  label: string
  visible: boolean
  onToggle: () => void
}) {
  return (
    <button
      className="auth-page__visibility"
      type="button"
      aria-controls={inputId}
      aria-label={`${visible ? 'Hide' : 'Show'} ${label}`}
      onClick={onToggle}
    >
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6S2 12 2 12Z" />
        <circle cx="12" cy="12" r="2.5" />
        {!visible && <path d="m4 4 16 16" />}
      </svg>
    </button>
  )
}

export default function AuthPage({ mode }: { mode: 'signup' | 'login' }) {
  const { signUp, signInWithPassword } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordConfirmation, setShowPasswordConfirmation] =
    useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [feedback, setFeedback] = useState<{
    error: boolean
    text: string
    field?: 'displayName' | 'passwordConfirmation'
  } | null>(null)
  const displayNameInput = useRef<HTMLInputElement>(null)
  const confirmationInput = useRef<HTMLInputElement>(null)
  const mounted = useRef(false)
  const isSignUp = mode === 'signup'

  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
    }
  }, [])

  useLayoutEffect(() => {
    if (feedback?.field === 'displayName') {
      displayNameInput.current?.focus()
    } else if (feedback?.field === 'passwordConfirmation') {
      confirmationInput.current?.focus()
    }
  }, [feedback])

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    if (isSubmitting) return

    try {
      const fields = new FormData(event.currentTarget)
      const credentials = {
        email: String(fields.get('email')).trim(),
        password: String(fields.get('password')),
      }
      const rawName = String(fields.get('displayName') ?? '')
      const displayName = rawName.trim()

      if (
        isSignUp &&
        (!displayName || rawName.length > DISPLAY_NAME_MAX_LENGTH)
      ) {
        setFeedback({
          error: true,
          text: `Enter a username of up to ${DISPLAY_NAME_MAX_LENGTH} characters.`,
          field: 'displayName',
        })
        return
      }

      if (
        isSignUp &&
        fields.get('passwordConfirmation') !== credentials.password
      ) {
        setFeedback({
          error: true,
          text: 'Passwords do not match.',
          field: 'passwordConfirmation',
        })
        return
      }

      setIsSubmitting(true)
      setFeedback(null)

      const { session, error } = isSignUp
        ? await signUp({ ...credentials, displayName })
        : await signInWithPassword(credentials)
      if (!mounted.current) return

      if (error) {
        setFeedback({ error: true, text: error })
      } else if (!session) {
        setFeedback({
          error: !isSignUp,
          text: isSignUp
            ? 'Your registration was received. Try logging in to start a session.'
            : 'We could not start a session. Please try again.',
        })
      }
    } catch {
      if (mounted.current) {
        setFeedback({
          error: true,
          text: 'Something went wrong. Please try again.',
        })
      }
    } finally {
      if (mounted.current) setIsSubmitting(false)
    }
  }

  return (
    <div className="auth-page">
      <Header showBackLink />
      <main className="auth-page__main auth-page__main--form">
        <div className="auth-page__stairs" aria-hidden="true">
          {stairs.map((step) => (
            <span key={step.left} style={step} />
          ))}
        </div>

        <section className="auth-page__card" aria-labelledby="auth-title">
          <h1 id="auth-title" className="auth-page__title">
            <svg aria-hidden="true" viewBox="0 0 54 62">
              <path d="M42 6l7 23M15 18l18 17M5 46l21 7" />
            </svg>
            {isSignUp ? (
              <>
                Let’s create your
                <br /> Account!!!
              </>
            ) : (
              'Welcome back!'
            )}
          </h1>

          <form onSubmit={handleSubmit}>
            <fieldset className="auth-page__fields" disabled={isSubmitting}>
              <div className="auth-page__field">
                <label htmlFor="auth-email">
                  {isSignUp ? 'First enter your email!' : 'Enter your email!'}
                </label>
                <div className="auth-page__input">
                  <svg aria-hidden="true" viewBox="0 0 24 24">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="m3 6 9 7 9-7" />
                  </svg>
                  <input
                    id="auth-email"
                    name="email"
                    type="email"
                    autoComplete="username"
                    required
                    placeholder="example@gmail.com"
                  />
                </div>
              </div>

              {isSignUp && (
                <div className="auth-page__field">
                  <label htmlFor="auth-display-name">
                    Username (up to {DISPLAY_NAME_MAX_LENGTH} characters)
                  </label>
                  <div className="auth-page__input">
                    <svg aria-hidden="true" viewBox="0 0 24 24">
                      <circle cx="12" cy="7" r="4" />
                      <path d="M4 21v-2a5 5 0 0 1 5-5h6a5 5 0 0 1 5 5v2" />
                    </svg>
                    <input
                      ref={displayNameInput}
                      id="auth-display-name"
                      name="displayName"
                      autoComplete="nickname"
                      maxLength={DISPLAY_NAME_MAX_LENGTH}
                      required
                      placeholder="Username example"
                      aria-invalid={
                        feedback?.field === 'displayName' || undefined
                      }
                      aria-describedby={
                        feedback?.field === 'displayName'
                          ? 'auth-feedback'
                          : undefined
                      }
                    />
                  </div>
                </div>
              )}

              <div className="auth-page__field">
                <label htmlFor="auth-password">
                  {isSignUp
                    ? 'Now create your Password!'
                    : 'Enter your password!'}
                </label>
                <div className="auth-page__input">
                  {passwordIcon}
                  <input
                    id="auth-password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete={
                      isSignUp ? 'new-password' : 'current-password'
                    }
                    required
                    minLength={isSignUp ? 6 : undefined}
                    placeholder="••••••••"
                  />
                  <PasswordVisibilityButton
                    inputId="auth-password"
                    label="password"
                    visible={showPassword}
                    onToggle={() => setShowPassword((visible) => !visible)}
                  />
                </div>
              </div>

              {isSignUp && (
                <div className="auth-page__field">
                  <label htmlFor="auth-password-confirmation">
                    Confirm your password
                  </label>
                  <div className="auth-page__input">
                    {passwordIcon}
                    <input
                      ref={confirmationInput}
                      id="auth-password-confirmation"
                      name="passwordConfirmation"
                      type={showPasswordConfirmation ? 'text' : 'password'}
                      autoComplete="new-password"
                      required
                      placeholder="••••••••"
                      aria-invalid={
                        feedback?.field === 'passwordConfirmation' || undefined
                      }
                      aria-describedby={
                        feedback?.field === 'passwordConfirmation'
                          ? 'auth-feedback'
                          : undefined
                      }
                    />
                    <PasswordVisibilityButton
                      inputId="auth-password-confirmation"
                      label="password confirmation"
                      visible={showPasswordConfirmation}
                      onToggle={() =>
                        setShowPasswordConfirmation((visible) => !visible)
                      }
                    />
                  </div>
                </div>
              )}
            </fieldset>

            {feedback && (
              <p
                id="auth-feedback"
                className={`auth-page__message${feedback.error ? ' auth-page__message--error' : ''}`}
                role={feedback.error ? 'alert' : 'status'}
              >
                {feedback.text}
              </p>
            )}

            <button
              className="auth-page__submit"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? isSignUp
                  ? 'Creating account…'
                  : 'Logging in…'
                : 'Continue'}
            </button>
          </form>

          <p className="auth-page__switch">
            {isSignUp ? 'Already have an account?' : 'Don’t have an account?'}{' '}
            <Link to={isSignUp ? '/login' : '/signup'}>
              {isSignUp ? 'Log in' : 'Sign up'}
            </Link>
          </p>
        </section>
      </main>
    </div>
  )
}
