import { useId, useRef, useState, type ReactNode } from 'react'
import { Link } from 'react-router'
import { useAuth } from '../../hooks/useAuth'
import BrandLogo from '../BrandLogo/BrandLogo'
import EditBubble from '../LadderPopup/EditBubble'
import LadderTooltip from '../LadderPopup/LadderTooltip'
import './Header.css'

export default function Header({
  showBackLink = false,
  sectionNavigation,
  navigation,
  displayName,
  onDisplayNameChange,
}: {
  showBackLink?: boolean
  sectionNavigation?: ReactNode
  navigation?: ReactNode
  displayName?: string
  onDisplayNameChange?: (name: string) => void
}) {
  const { isLoading, session, sessionError, user } = useAuth()
  const editId = useId()
  const editTrigger = useRef<HTMLButtonElement>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState('')

  function closeEditor() {
    setIsEditing(false)
  }

  function finishEditing() {
    setDraft('')
    closeEditor()
  }

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
                <span className="site-header__name">
                  {displayName ?? user?.email ?? 'Signed in'}
                </span>
                {onDisplayNameChange && (
                  <div className="ladder-tooltip__anchor site-header__edit-anchor">
                    <button
                      ref={editTrigger}
                      className="site-header__control site-header__edit"
                      type="button"
                      aria-label="Edit username"
                      aria-expanded={isEditing}
                      aria-controls={isEditing ? editId : undefined}
                      onClick={() => setIsEditing((editing) => !editing)}
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
                    <LadderTooltip>Edit username</LadderTooltip>
                    {isEditing && (
                      <EditBubble
                        id={editId}
                        trigger={editTrigger}
                        centerOnMobile
                        label="Enter your new username"
                        placeholder="Username example"
                        draft={draft}
                        onDraftChange={setDraft}
                        onDismiss={closeEditor}
                        onCancel={finishEditing}
                        onSubmit={(name) => {
                          onDisplayNameChange(name)
                          finishEditing()
                        }}
                      />
                    )}
                  </div>
                )}
              </div>
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
