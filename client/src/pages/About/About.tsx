import { Link } from 'react-router'
import Header from '../../components/Header/Header'
import { useAuth } from '../../hooks/useAuth'
import './About.css'

export default function About() {
  const { isLoading, session, sessionError } = useAuth()
  const canGoBackToLanding = !isLoading && !session && !sessionError

  return (
    <>
      <Header />
      <main className="about">
        <section aria-labelledby="about-title">
          <h1 id="about-title">About ADHD Ladder</h1>
          <p>
            ADHD Ladder turns everyday activities into small steps so you can
            see your progress over time.
          </p>
          <dl className="about__areas">
            <div>
              <dt>Health</dt>
              <dd>
                Track nutrition, sleep, and movement as three daily goals.
              </dd>
            </div>
            <div>
              <dt>Activities</dt>
              <dd>Complete personal activities at your own pace.</dd>
            </div>
            <div>
              <dt>Learning</dt>
              <dd>Record small steps toward what you want to learn.</dd>
            </div>
          </dl>
          <p>
            Life brings together your completed steps from Activities and
            Learning and shows them on a single ladder.
          </p>
        </section>
        <section aria-labelledby="about-creator">
          <h2 id="about-creator">About the Creator</h2>
          <p>
            I'm Dara, a web development student focused on frontend. I built
            ADHD Ladder as my final project for the TripleTen web development
            program.
          </p>
        </section>
        {canGoBackToLanding && (
          <Link className="about__home-link" to="/">
            Back to home
          </Link>
        )}
      </main>
    </>
  )
}
