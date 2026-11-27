import {
  Fragment,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from 'react'
import { Link } from 'react-router'
import { DISPLAY_NAME_MAX_LENGTH } from '../../config/displayName'
import { useAuth } from '../../hooks/useAuth'
import BrandLogo from '../BrandLogo/BrandLogo'
import EditBubble from '../LadderPopup/EditBubble'
import LadderTooltip from '../LadderPopup/LadderTooltip'
import './Header.css'

// Match the existing Header layout breakpoint in Header.css.
const mobileHeaderQuery = '(width < 40rem)'

function subscribeToMobileHeader(onChange: () => void) {
  const query = window.matchMedia(mobileHeaderQuery)
  query.addEventListener('change', onChange)
  return () => query.removeEventListener('change', onChange)
}

function isMobileHeader() {
  return window.matchMedia(mobileHeaderQuery).matches
}

function resolveDisplayName(customName: unknown, email: string | undefined) {
  const name =
    typeof customName === 'string' && customName.trim()
      ? customName
      : email?.split('@', 1)[0]
  const boundedName = name
    ?.slice(0, DISPLAY_NAME_MAX_LENGTH)
    .replace(/[\uD800-\uDBFF]$/u, '')

  return boundedName?.trim() ? boundedName : 'Signed in'
}

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
  const isMobile = useSyncExternalStore(subscribeToMobileHeader, isMobileHeader)
  const HeaderControls = onDisplayNameChange ? 'div' : 'nav'

  function closeEditor() {
    setIsEditing(false)
  }

  function finishEditing() {
    setDraft('')
    closeEditor()
  }

  const controls = (
    <Fragment key="controls">
      {!isLoading && !sessionError && (
        <HeaderControls
          className="site-header__nav"
          aria-label={onDisplayNameChange ? undefined : 'Main navigation'}
        >
          {session && (
            <div className="site-header__account">
              <span className="site-header__name">
                {resolveDisplayName(
                  displayName ?? user?.user_metadata?.display_name,
                  user?.email,
                )}
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
                      maxLength={DISPLAY_NAME_MAX_LENGTH}
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
        </HeaderControls>
      )}
    </Fragment>
  )
  const selector = <Fragment key="selector">{sectionNavigation}</Fragment>
  const accountFirst = isMobile && session && onDisplayNameChange

  return (
    <header
      className={`site-header${showBackLink ? ' site-header--back' : ''}`}
    >
      <BrandLogo />
      {accountFirst ? [controls, selector] : [selector, controls]}
    </header>
  )
}
