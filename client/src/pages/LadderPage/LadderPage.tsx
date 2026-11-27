import { useId, useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import LadderArtwork from '../../components/LadderArtwork/LadderArtwork'
import EditBubble from '../../components/LadderPopup/EditBubble'
import LadderTooltip from '../../components/LadderPopup/LadderTooltip'
import TaskCard, { type TaskPopup } from '../../components/TaskCard/TaskCard'
import { MAX_ACTIVE_TASKS } from '../../config/constants'
import { useLadderSession } from '../../hooks/useLadderSession'
import { useRegistrationDate } from '../../hooks/useRegistrationDate'
import { useTasks } from '../../hooks/useTasks'
import type { TaskLadder } from '../../types/task'
import { getDaysInLadder } from '../../utils/dates'
import { getLadderProgress } from '../../utils/progress'
import { isTaskCompleted } from '../../utils/taskCompletions'
import { getActiveTasks } from '../../utils/tasks'
import '../../styles/ladder-cards.css'
import './LadderPage.css'

type LadderPopupState =
  { mode: 'create'; ladder: TaskLadder } | { mode: TaskPopup; taskId: string }

export default function LadderPage({ ladder }: { ladder: TaskLadder }) {
  const {
    tasks,
    completions,
    createTask,
    renameTask,
    archiveTask,
    toggleTaskCompleted,
  } = useTasks()
  const { taskDrafts, setTaskDraft, today } = useLadderSession()
  const joinedOn = useRegistrationDate()
  const daysInLadder = getDaysInLadder(joinedOn.date, today)
  const { todaySteps, totalSteps } = getLadderProgress(
    { tasks, completions },
    today,
  )[ladder]
  const [popup, setPopup] = useState<LadderPopupState>()
  const addPopupId = useId()
  const addTrigger = useRef<HTMLButtonElement>(null)
  const taskList = useRef<HTMLUListElement>(null)
  const restoreTaskListFocus = useRef(false)
  const activeTasks = getActiveTasks(tasks, ladder)
  const canAddTask = activeTasks.length < MAX_ACTIVE_TASKS
  const isCreateOpen = popup?.mode === 'create' && popup.ladder === ladder
  const createDraftKey = `create:${ladder}` as const

  useLayoutEffect(() => {
    if (!restoreTaskListFocus.current) return
    restoreTaskListFocus.current = false
    if (!addTrigger.current) taskList.current?.focus()
  }, [canAddTask, isCreateOpen])

  function closeCreatePopup() {
    setPopup((current) =>
      current?.mode === 'create' && current.ladder === ladder
        ? undefined
        : current,
    )
  }

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
            <p className="ladder-page__today-count">
              <svg aria-hidden="true" viewBox="0 0 42 65">
                <path d="M33 16 15 5M25 32H5M29 48 14 59" />
              </svg>
              <span>{todaySteps}</span>
              <svg aria-hidden="true" viewBox="0 0 42 65">
                <path d="M33 16 15 5M25 32H5M29 48 14 59" />
              </svg>
            </p>
            <p className="ladder-card__pill">
              {todaySteps} of {activeTasks.length} completed
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
                Days in the ladder: {daysInLadder}
              </p>
            </div>
            <p className="ladder-page__total-count">{totalSteps}</p>
          </section>
        </div>

        <section className="ladder-page__tasks" aria-label="Tasks">
          <ul
            className="ladder-page__task-list"
            role="list"
            ref={taskList}
            tabIndex={-1}
          >
            {activeTasks.map((task) => (
              <TaskCard
                key={task.id}
                title={task.title}
                completed={isTaskCompleted(completions, task.id, today)}
                onToggleCompleted={() => toggleTaskCompleted(task.id)}
                renameDraft={taskDrafts[`rename:${task.id}`]}
                canArchive={activeTasks.length > 1}
                popup={
                  popup && popup.mode !== 'create' && popup.taskId === task.id
                    ? popup.mode
                    : undefined
                }
                onOpenPopup={(mode) => setPopup({ taskId: task.id, mode })}
                onClosePopup={(mode) =>
                  setPopup((current) =>
                    current?.mode === mode && current.taskId === task.id
                      ? undefined
                      : current,
                  )
                }
                onRenameDraftChange={(draft) =>
                  setTaskDraft(`rename:${task.id}`, draft)
                }
                onRename={(title) => renameTask(task.id, title)}
                onArchive={() => {
                  archiveTask(task.id)
                  taskList.current?.focus()
                }}
              />
            ))}
            {canAddTask && (
              <li className="ladder-page__add-slot ladder-tooltip__anchor">
                <button
                  ref={addTrigger}
                  className="ladder-page__add"
                  type="button"
                  aria-label="Add task"
                  aria-expanded={isCreateOpen}
                  aria-controls={isCreateOpen ? addPopupId : undefined}
                  onClick={() =>
                    isCreateOpen
                      ? closeCreatePopup()
                      : setPopup({ mode: 'create', ladder })
                  }
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
                  Add task
                </LadderTooltip>
                {isCreateOpen && (
                  <EditBubble
                    id={addPopupId}
                    trigger={addTrigger}
                    label="Enter a new task name"
                    placeholder="Task name"
                    draft={taskDrafts[createDraftKey] ?? ''}
                    onDraftChange={(draft) =>
                      setTaskDraft(createDraftKey, draft)
                    }
                    onDismiss={closeCreatePopup}
                    onCancel={() => {
                      setTaskDraft(createDraftKey, undefined)
                      closeCreatePopup()
                    }}
                    onSubmit={(title) => {
                      restoreTaskListFocus.current = true
                      createTask(ladder, title)
                      setTaskDraft(createDraftKey, undefined)
                      closeCreatePopup()
                    }}
                  />
                )}
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
