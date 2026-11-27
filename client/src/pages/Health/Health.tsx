import { Link } from 'react-router'
import LadderArtwork from '../../components/LadderArtwork/LadderArtwork'
import { HEALTH_GOALS, HEALTH_STATUS_LEGEND } from '../../config/healthPreview'
import { useHealth } from '../../hooks/useHealth'
import '../../styles/ladder-cards.css'
import './Health.css'

export default function Health() {
  const { todayCheck, toggleHealthGoal, status, streakEligible } = useHealth()
  const toneClass = `ladder-health-tone--${status.tone}`

  return (
    <main className="health ladder-view ladder-view--detail">
      <div className="health__layout ladder-view__layout">
        <section
          className="ladder-card health__status"
          aria-labelledby="health-title"
        >
          <h1 className="ladder-card__title health__title" id="health-title">
            Health Status
          </h1>
          <p className={`health__indicator ${toneClass}`}>
            <span className="health__status-message" role="status">
              {status.message}
            </span>
            <svg aria-hidden="true" viewBox="0 0 42 65">
              <path d="M33 16 15 5M25 32H5M29 48 14 59" />
            </svg>
            <span className="health__light" aria-hidden="true" />
            <svg aria-hidden="true" viewBox="0 0 42 65">
              <path d="M9 16 27 5M17 32h20M13 48l14 11" />
            </svg>
          </p>
        </section>

        <section className="health__goals" aria-labelledby="health-goals">
          <h2 className="ladder-card__title health__title" id="health-goals">
            Mark today’s goals!
          </h2>
          <ul className="health__goal-list" role="list">
            {HEALTH_GOALS.map(({ id, label }) => (
              <li className="health__goal" key={id}>
                <label className="ladder-card health__goal-label">
                  <input
                    className="ladder-check"
                    type="checkbox"
                    checked={todayCheck?.[id] ?? false}
                    onChange={() => toggleHealthGoal(id)}
                  />
                  <span>{label}</span>
                </label>
              </li>
            ))}
          </ul>
        </section>

        <p className={`ladder-card health__streak ${toneClass}`}>
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 22a7 7 0 0 0 7-7c0-3-2-5-4-7 .3 2-.6 3.2-2 4 .6-4-1.4-7-3-9 .1 4-1.4 6-3.2 8.1A6.7 6.7 0 0 0 5 15a7 7 0 0 0 7 7Z" />
            <path d="M12 22a3 3 0 0 0 3-3c0-1.5-1.2-2.7-3-4-1.8 1.3-3 2.5-3 4a3 3 0 0 0 3 3Z" />
          </svg>
          <span>
            <strong>
              {streakEligible
                ? 'Your health is on track!'
                : 'Your streak is at risk!'}
            </strong>
            <span className="health__streak-detail">
              Be honest with yourself.
            </span>
          </span>
        </p>

        <ul
          className="ladder-card health__legend"
          role="list"
          aria-label="Goal status guide"
        >
          {HEALTH_STATUS_LEGEND.map(({ tone, message }) => (
            <li
              key={tone}
              className={`health__legend-item ladder-health-tone--${tone}`}
              aria-current={tone === status.tone ? true : undefined}
            >
              <span className="health__light" aria-hidden="true" />
              <span className="health__description">{message}</span>
            </li>
          ))}
        </ul>

        <LadderArtwork />
        <Link className="ladder-card ladder-card--back health__back" to="/life">
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
      </div>
    </main>
  )
}
