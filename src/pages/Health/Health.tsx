import { useState } from 'react'
import { Link } from 'react-router'
import LadderArtwork from '../../components/LadderArtwork/LadderArtwork'
import {
  HEALTH_PREVIEW_GOALS,
  HEALTH_PREVIEW_STATUS,
  HEALTH_PREVIEW_STATUSES,
} from '../../config/healthPreview'
import '../../styles/ladder-cards.css'
import './Health.css'

export default function Health() {
  const [goals, setGoals] = useState(HEALTH_PREVIEW_GOALS)

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
              className={`health__indicator ladder-health-tone--${HEALTH_PREVIEW_STATUS.tone}`}
              role="img"
              aria-label={HEALTH_PREVIEW_STATUS.message}
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
              {HEALTH_PREVIEW_STATUSES.map(({ tone, message }) => (
                <li
                  key={tone}
                  className={`health__legend-item ladder-health-tone--${tone}`}
                  aria-current={
                    tone === HEALTH_PREVIEW_STATUS.tone ? true : undefined
                  }
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
            {goals.map(({ id, label, checked }) => (
              <li className="health__goal" key={id}>
                <label className="ladder-card health__goal-label">
                  <input
                    className="ladder-check"
                    type="checkbox"
                    checked={checked}
                    onChange={(event) => {
                      const nextChecked = event.currentTarget.checked
                      setGoals((items) =>
                        items.map((goal) =>
                          goal.id === id
                            ? { ...goal, checked: nextChecked }
                            : goal,
                        ),
                      )
                    }}
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
