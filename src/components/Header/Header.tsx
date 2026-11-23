import { useId, type ReactNode } from 'react'
import { Link } from 'react-router'
import { useAuth } from '../../hooks/useAuth'
import BrandLogo from '../BrandLogo/BrandLogo'
import './Header.css'

export default function Header({
  showBackLink = false,
  sectionNavigation,
  navigation,
}: {
  showBackLink?: boolean
  sectionNavigation?: ReactNode
  navigation?: ReactNode
}) {
  const { isLoading, session, sessionError, user } = useAuth()
  const editHintId = useId()

  return (
    <header
      className={`site-header${showBackLink ? ' site-header--back' : ''}`}
    >
      <BrandLogo />
      {sectionNavigation}
      {!isLoading && !sessionError && (
        <nav className="site-header__nav" aria-label="Main navigation">
          {session && (
            <div className="site-header__account">
              <div className="site-header__identity">
                <span className="site-header__email">
                  {user?.email ?? 'Signed in'}
                </span>
                <button
                  className="site-header__control site-header__edit"
                  type="button"
                  aria-label="Edit display name"
                  aria-describedby={editHintId}
                  disabled
                >
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m14 6 4 4M3 21l4.5-1 12-12a2.8 2.8 0 0 0-4-4l-12 12L3 21Z" />
                  </svg>
                </button>
              </div>
              <p id={editHintId} className="site-header__edit-hint">
                Display name editing coming soon
              </p>
            </div>
          )}
          {navigation ??
            (showBackLink ? (
              <Link className="site-header__control site-header__back" to="/">
                <span aria-hidden="true">←</span> Go Back
              </Link>
            ) : session ? (
              <Link className="site-header__control" to="/life">
                Life
              </Link>
            ) : (
              <>
                <Link className="site-header__control" to="/about">
                  About
                </Link>
                <Link
                  className="site-header__control site-header__control--login"
                  to="/login"
                >
                  Log in
                </Link>
                <Link
                  className="site-header__control site-header__control--filled"
                  to="/signup"
                >
                  Sign up
                </Link>
              </>
            ))}
        </nav>
      )}
    </header>
  )
}
