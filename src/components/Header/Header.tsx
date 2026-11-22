import { Link } from 'react-router'
import BrandLogo from '../BrandLogo/BrandLogo'
import './Header.css'

export default function Header() {
  return (
    <header className="site-header">
      <BrandLogo />
      <nav className="site-header__nav" aria-label="Main navigation">
        <Link className="site-header__control" to="/about">
          About
        </Link>
        <button className="site-header__control" type="button" disabled>
          Log in
        </button>
        <button
          className="site-header__control site-header__control--filled"
          type="button"
          disabled
        >
          Sign up
        </button>
      </nav>
    </header>
  )
}
