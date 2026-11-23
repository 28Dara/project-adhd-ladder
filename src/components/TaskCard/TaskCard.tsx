import type { TaskPreview } from '../../config/ladderPreviews'
import '../../styles/ladder-cards.css'
import './TaskCard.css'

export default function TaskCard({ task }: { task: TaskPreview }) {
  return (
    <li className="ladder-card task-card">
      <label className="task-card__label">
        <input
          className="task-card__checkbox"
          type="checkbox"
          checked={task.completed}
          disabled
        />
        <span className="task-card__title">{task.title}</span>
      </label>
      <button
        className="task-card__settings"
        type="button"
        aria-label={`Settings for ${task.title}`}
        title="Task editing coming soon"
        disabled
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        >
          <path d="M10 2h4l.6 2.7 2 .8L19 4l2 2-1.5 2.4.8 2L23 11v2l-2.7.6-.8 2L21 18l-2 2-2.4-1.5-2 .8L14 22h-4l-.6-2.7-2-.8L5 20l-2-2 1.5-2.4-.8-2L1 13v-2l2.7-.6.8-2L3 6l2-2 2.4 1.5 2-.8Z" />
          <circle cx="12" cy="12" r="3.1" />
        </svg>
      </button>
    </li>
  )
}
