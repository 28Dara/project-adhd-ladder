import { Link } from 'react-router'
import BrandLogo from '../BrandLogo/BrandLogo'
import './Header.css'

export default function Header({
  showBackLink = false,
}: {
  showBackLink?: boolean
}) {
  return (
    <header
      className={`site-header${showBackLink ? ' site-header--back' : ''}`}
    >
      <BrandLogo />
      <nav className="site-header__nav" aria-label="Main navigation">
        {showBackLink ? (
          <Link className="site-header__control site-header__back" to="/">
            <span aria-hidden="true">←</span> Go Back
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
        )}
      </nav>
    </header>
  )
}
