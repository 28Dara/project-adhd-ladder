import { Link } from 'react-router'

export default function Life() {
  return (
    <main className="auth-page">
      <div className="auth-page__main">
        <section className="auth-page__card" aria-labelledby="life-title">
          <h1 id="life-title" className="auth-page__title">
            Life is coming soon
          </h1>
          <p className="auth-page__switch">
            <Link to="/">Back to Landing</Link>
          </p>
        </section>
      </div>
    </main>
  )
}
