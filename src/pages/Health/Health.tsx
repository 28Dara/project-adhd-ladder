import { Link } from 'react-router'
import LadderArtwork from '../../components/LadderArtwork/LadderArtwork'
import '../../styles/ladder-cards.css'
import './Health.css'

const statuses = [
  { tone: 'success', message: "You're doing great!" },
  { tone: 'warning', message: 'You got it, keep it up!' },
  { tone: 'danger', message: 'Take a look at your health!' },
] as const

const previewStatus = statuses[1]
const previewGoals = [
  { id: 'nutrition', label: 'Good Nutrition', checked: true },
  { id: 'sleep', label: 'Good Sleep', checked: false },
  { id: 'movement', label: 'Daily Movement', checked: true },
]

export default function Health() {
  return (
    <main className="health">
      <div className="health__layout">
        <div className="health__overview">
          <section
            className="ladder-card health__status"
            aria-labelledby="health-title"
          >
            <h1 className="ladder-card__title health__title" id="health-title">
              Health Status
            </h1>
            <div
              className={
                'health__indicator health__tone--' + previewStatus.tone
              }
              role="img"
              aria-label={previewStatus.message}
            >
              <svg aria-hidden="true" viewBox="0 0 42 65">
                <path d="M33 16 15 5M25 32H5M29 48 14 59" />
              </svg>
              <span className="health__light" />
              <svg aria-hidden="true" viewBox="0 0 42 65">
                <path d="M9 16 27 5M17 32h20M13 48l14 11" />
              </svg>
            </div>
          </section>
          <div className="ladder-card health__legend-card">
            <ul className="health__legend" aria-label="Goal status guide">
              {statuses.map(({ tone, message }) => (
                <li
                  key={tone}
                  className={'health__legend-item health__tone--' + tone}
                  aria-current={tone === previewStatus.tone ? true : undefined}
                >
                  <span className="health__light" aria-hidden="true" />
                  <span>{message}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <section className="health__goals" aria-labelledby="health-goals">
          <h2 className="ladder-card__title health__title" id="health-goals">
            Mark today’s goals!
          </h2>
          <ul className="health__goal-list">
            {previewGoals.map(({ id, label, checked }) => (
              <li className="ladder-card health__goal" key={id}>
                <label>
                  <input
                    className="ladder-check"
                    type="checkbox"
                    checked={checked}
                    disabled
                  />
                  <span>{label}</span>
                </label>
              </li>
            ))}
          </ul>
          <Link className="ladder-card health__back" to="/life">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5m6-6-6 6 6 6" />
            </svg>
            <span>Go back to the Life Ladder</span>
          </Link>
        </section>
        <LadderArtwork />
      </div>
    </main>
  )
}
