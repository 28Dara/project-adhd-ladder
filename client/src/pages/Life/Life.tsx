import { Link } from 'react-router'
import LadderArtwork from '../../components/LadderArtwork/LadderArtwork'
import LadderTooltip from '../../components/LadderPopup/LadderTooltip'
import { lifePreview } from '../../config/lifePreview'
import { useHealth } from '../../hooks/useHealth'
import { useLadderSession } from '../../hooks/useLadderSession'
import { useTasks } from '../../hooks/useTasks'
import { getDaysInLadder } from '../../utils/dates'
import { getLadderProgress, getStreakDays } from '../../utils/progress'
import '../../styles/ladder-cards.css'
import './Life.css'

export default function Life() {
  const { quoteState, revealQuote } = useLadderSession()
  const {
    today: date,
    status: healthStatus,
    joinedOn,
    healthByDate,
  } = useHealth()
  const taskData = useTasks()
  const isQuoteLoading = quoteState.status === 'loading'
  const progress = getLadderProgress(taskData, date)
  const daysInLadder = getDaysInLadder(joinedOn.date, date)
  const streak = getStreakDays(
    taskData,
    healthByDate,
    date,
    joinedOn.isSimulated ? undefined : joinedOn.date,
  )
  const { todaySteps, totalSteps } = progress.life
  const ladders = lifePreview.ladders.map((section) => {
    if ('path' in section) {
      return {
        ...section,
        tone: healthStatus.tone,
        caption: healthStatus.message,
      }
    }

    const steps = progress[section.ladder].todaySteps
    return {
      path: `/${section.ladder}`,
      label: section.label,
      badge: steps,
      caption: `${steps} ${steps === 1 ? 'step' : 'steps'} today`,
    }
  })

  return (
    <main className="life">
      <div className="life__layout">
        <div className="life__summary">
          <section
            className="ladder-card life__card life__today"
            aria-labelledby="life-today"
          >
            <h1 id="life-today" className="ladder-card__title">
              Your steps today
            </h1>
            <div className="life__today-count">
              <svg aria-hidden="true" viewBox="0 0 42 65">
                <path d="M33 16 15 5M25 32H5M29 48 14 59" />
              </svg>
              <span>{todaySteps}</span>
              <svg aria-hidden="true" viewBox="0 0 42 65">
                <path d="M9 16 27 5M17 32h20M13 48l15 11" />
              </svg>
            </div>
            <p className="ladder-card__pill">You have a {streak}-day streak</p>
          </section>

          <section
            className="ladder-card life__card life__total"
            aria-labelledby="life-total"
          >
            <div>
              <h2 id="life-total" className="ladder-card__title">
                Your total steps
              </h2>
              <p className="life__since">
                Since <time dateTime={joinedOn.date}>{joinedOn.label}</time>
              </p>
              <p className="ladder-card__pill">
                Days in the ladder: {daysInLadder}
              </p>
            </div>
            <p className="life__total-count">{totalSteps}</p>
          </section>
        </div>

        <div className="life__side">
          <nav aria-label="Ladders">
            <ul className="life__ladders">
              {ladders.map((ladder) => {
                const { path, label, caption } = ladder
                return (
                  <li key={path}>
                    <Link
                      className="ladder-card life__ladder ladder-tooltip__anchor"
                      to={path}
                    >
                      {'tone' in ladder ? (
                        <span
                          className={`life__ladder-badge life__health-badge ladder-health-tone--${ladder.tone}`}
                          aria-hidden="true"
                        />
                      ) : (
                        <span className="life__ladder-badge" aria-hidden="true">
                          {ladder.badge}
                        </span>
                      )}
                      <span className="life__ladder-info">
                        <span className="life__ladder-name">{label}</span>
                        <span className="life__ladder-caption">{caption}</span>
                      </span>
                      <span className="life__ladder-arrow" aria-hidden="true">
                        →
                      </span>
                      <LadderTooltip className="life__ladder-hint">
                        {`Go to ${label}`}
                      </LadderTooltip>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          <section
            className="ladder-card life__card life__quote"
            aria-label="Motivational quote"
            aria-live="polite"
          >
            {quoteState.status === 'success' ? (
              <p>{quoteState.quote.text}</p>
            ) : (
              <>
                <h2 className="ladder-card__title">
                  Today's quote for you is...
                </h2>
                {quoteState.status === 'error' && <p>{quoteState.message}</p>}
                <button
                  className="life__quote-reveal"
                  type="button"
                  disabled={isQuoteLoading}
                  onClick={revealQuote}
                >
                  {isQuoteLoading
                    ? 'Loading quote...'
                    : quoteState.status === 'error'
                      ? 'Retry'
                      : 'Click to reveal'}
                </button>
              </>
            )}
          </section>
        </div>

        <LadderArtwork />
      </div>
    </main>
  )
}
