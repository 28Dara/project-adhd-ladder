import { useState } from 'react'
import { Link } from 'react-router'
import Header from '../../components/Header/Header'
import landingIllustration from '../../images/landing-illustration.webp'
import './Landing.css'

export default function Landing() {
  const [imageFailed, setImageFailed] = useState(false)

  return (
    <div className="landing">
      <Header />
      <main className="landing__hero">
        <div
          className={`landing__artwork${imageFailed ? ' landing__artwork--fallback' : ''}`}
        >
          {imageFailed ? (
            <div
              className="landing__illustration landing__illustration--fallback"
              aria-hidden="true"
            >
              <span>ADHD Ladder illustration unavailable</span>
            </div>
          ) : (
            <img
              className="landing__illustration"
              src={landingIllustration}
              alt=""
              width={1536}
              height={1024}
              onError={() => setImageFailed(true)}
            />
          )}
        </div>
        <div className="landing__content">
          <h1 className="landing__title">Welcome to the Ladder</h1>
          <div className="landing__actions">
            <Link className="landing__cta" to="/signup">
              Take your first step <span aria-hidden="true">↑</span>
            </Link>
            <p className="landing__actions-separator">or</p>
            <Link className="landing__cta landing__cta--secondary" to="/login">
              Log in to your ladder
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
