import { Link } from 'react-router'
import { lifePreview } from '../../config/lifePreview'
import ladderIllustration from '../../images/ladder-illustration.webp'
import mobileIllustration from '../../images/tab-cel-illustration.webp'
import '../../styles/ladder-cards.css'
import './Life.css'

export default function Life() {
  const {
    todaySteps,
    totalSteps,
    streakDays,
    daysOnLadder,
    joinedOn,
    ladders,
  } = lifePreview

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
            <p className="ladder-card__pill">
              You have a {streakDays}-day streak
            </p>
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
                Days in the ladder: {daysOnLadder}
              </p>
            </div>
            <p className="life__total-count">{totalSteps}</p>
          </section>
        </div>

        <div className="life__side">
          <nav aria-label="Ladders">
            <ul className="life__ladders">
              {ladders.map(({ path, label, badge, caption }) => (
                <li key={path}>
                  <Link className="ladder-card life__ladder" to={path}>
                    <span className="life__ladder-badge" aria-hidden="true">
                      {badge}
                    </span>
                    <span className="life__ladder-info">
                      <span className="life__ladder-name">{label}</span>
                      <span className="life__ladder-caption">
                        {typeof badge === 'number' ? `${badge} ` : ''}
                        {caption}
                      </span>
                    </span>
                    <span className="life__ladder-arrow" aria-hidden="true">
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <section
            className="ladder-card life__card life__quote"
            aria-labelledby="life-quote"
          >
            <h2 id="life-quote" className="ladder-card__title">
              Motivational quote
            </h2>
            <p>Coming soon</p>
          </section>
        </div>

        <picture className="life__artwork">
          <source
            media="(min-width: 64rem)"
            srcSet={ladderIllustration}
            width={966}
            height={1445}
          />
          <img
            src={mobileIllustration}
            alt=""
            width={2088}
            height={2048}
            loading="lazy"
          />
        </picture>
      </div>
    </main>
  )
}
