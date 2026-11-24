import { useState } from 'react'
import { Link } from 'react-router'
import LadderArtwork from '../../components/LadderArtwork/LadderArtwork'
import LadderTooltip from '../../components/LadderPopup/LadderTooltip'
import TaskCard, { type TaskPopup } from '../../components/TaskCard/TaskCard'
import type { LadderPreview } from '../../config/ladderPreviews'
import { useLadderSession } from '../../hooks/useLadderSession'
import '../../styles/ladder-cards.css'
import './LadderPage.css'

const MAX_ACTIVE_TASKS = 4

export default function LadderPage({ preview }: { preview: LadderPreview }) {
  const { todaySteps, totalSteps, daysOnLadder, joinedOn, tasks } = preview
  const { taskNames, updateTaskName } = useLadderSession()
  const [popup, setPopup] = useState<{ taskId: string; mode: TaskPopup }>()

  return (
    <main className="ladder-page">
      <div className="ladder-page__layout">
        <div className="ladder-page__summary">
          <section
            className="ladder-card ladder-page__today"
            aria-labelledby="ladder-today"
          >
            <h1 id="ladder-today" className="ladder-card__title">
              Today’s steps!
            </h1>
            <div className="ladder-page__today-count">
              <svg aria-hidden="true" viewBox="0 0 42 65">
                <path d="M33 16 15 5M25 32H5M29 48 14 59" />
              </svg>
              <span>{todaySteps}</span>
              <svg aria-hidden="true" viewBox="0 0 42 65">
                <path d="M33 16 15 5M25 32H5M29 48 14 59" />
              </svg>
            </div>
            <p className="ladder-card__pill">
              {todaySteps} of {tasks.length} completed
            </p>
          </section>

          <section
            className="ladder-card ladder-page__total"
            aria-labelledby="ladder-total"
          >
            <div>
              <h2 id="ladder-total" className="ladder-card__title">
                Your total steps
              </h2>
              <p className="ladder-page__since">
                Since <time dateTime={joinedOn.date}>{joinedOn.label}</time>
              </p>
              <p className="ladder-card__pill">
                Days in the ladder: {daysOnLadder}
              </p>
            </div>
            <p className="ladder-page__total-count">{totalSteps}</p>
          </section>
        </div>

        <section className="ladder-page__tasks" aria-label="Tasks">
          <ul className="ladder-page__task-list">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                nameEdit={taskNames[task.id]}
                canArchive={tasks.length > 1}
                popup={popup?.taskId === task.id ? popup.mode : undefined}
                onOpenPopup={(mode) => setPopup({ taskId: task.id, mode })}
                onClosePopup={(mode) =>
                  setPopup((current) =>
                    current?.taskId === task.id && current.mode === mode
                      ? undefined
                      : current,
                  )
                }
                onNameEdit={(edit) => updateTaskName(task.id, edit)}
              />
            ))}
            {tasks.length < MAX_ACTIVE_TASKS && (
              <li className="ladder-page__add-slot" role="presentation">
                <div className="ladder-page__add-control ladder-tooltip__anchor">
                  <button
                    className="ladder-page__add"
                    type="button"
                    aria-label="Add task (coming soon)"
                    aria-disabled="true"
                  >
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                    >
                      <path d="M12 4v16M4 12h16" />
                    </svg>
                  </button>
                  <LadderTooltip className="ladder-page__add-hint">
                    Add task (coming soon)
                  </LadderTooltip>
                </div>
              </li>
            )}
          </ul>
          <Link className="ladder-card ladder-page__back" to="/life">
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
