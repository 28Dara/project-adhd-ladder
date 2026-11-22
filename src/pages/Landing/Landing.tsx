import Header from '../../components/Header/Header'
import landingIllustration from '../../images/landing-illustration.webp'
import './Landing.css'

export default function Landing() {
  return (
    <div className="landing">
      <Header />
      <main className="landing__hero">
        <div className="landing__artwork">
          <img
            className="landing__illustration"
            src={landingIllustration}
            alt=""
            width={1536}
            height={1024}
          />
        </div>
        <div className="landing__content">
          <h1 className="landing__title">Welcome to the Ladder</h1>
          <button className="landing__cta" type="button" disabled>
            Take your first step <span aria-hidden="true">↑</span>
          </button>
        </div>
      </main>
    </div>
  )
}
