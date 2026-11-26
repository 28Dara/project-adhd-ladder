import { useId, useRef } from 'react'
import '../../styles/ladder-cards.css'
import EditBubble from '../LadderPopup/EditBubble'
import LadderPopup from '../LadderPopup/LadderPopup'
import LadderTooltip from '../LadderPopup/LadderTooltip'
import './TaskCard.css'

export type TaskPopup = 'settings' | 'rename' | 'archive'

interface TaskCardProps {
  title: string
  completed: boolean
  onToggleCompleted: () => void
  renameDraft?: string
  canArchive: boolean
  popup?: TaskPopup
  onOpenPopup: (mode: TaskPopup) => void
  onClosePopup: (mode: TaskPopup) => void
  onRenameDraftChange: (draft: string | undefined) => void
  onRename: (title: string) => void
  onArchive: () => void
}

export default function TaskCard({
  title,
  completed,
  onToggleCompleted,
  renameDraft,
  canArchive,
  popup,
  onOpenPopup,
  onClosePopup,
  onRenameDraftChange,
  onRename,
  onArchive,
}: TaskCardProps) {
  const popupId = useId()
  const archiveTitleId = useId()
  const archiveDescriptionId = useId()
  const settingsTrigger = useRef<HTMLButtonElement>(null)

  function closePopup() {
    if (popup) onClosePopup(popup)
  }

  const popupProps = {
    id: popupId,
    trigger: settingsTrigger,
    onDismiss: closePopup,
  }

  return (
    <li className="ladder-card task-card">
      <label className="task-card__label">
        <input
          className="ladder-check"
          type="checkbox"
          checked={completed}
          onChange={onToggleCompleted}
        />
        <span className="task-card__title">{title}</span>
      </label>
      <div className="ladder-tooltip__anchor">
        <button
          ref={settingsTrigger}
          className="task-card__settings"
          type="button"
          aria-label={`Task settings for ${title}`}
          aria-expanded={Boolean(popup)}
          aria-controls={popup ? popupId : undefined}
          onClick={() => (popup ? closePopup() : onOpenPopup('settings'))}
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
        <LadderTooltip>Task settings</LadderTooltip>

        {popup === 'settings' && (
          <LadderPopup {...popupProps}>
            <div className="ladder-popup__options task-card__options">
              <button
                type="button"
                onClick={() => onOpenPopup('rename')}
                data-popup-focus
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m14 6 4 4M3 21l4.5-1 12-12a2.8 2.8 0 0 0-4-4l-12 12L3 21Z" />
                </svg>
                Change Name
              </button>
              {canArchive && (
                <button type="button" onClick={() => onOpenPopup('archive')}>
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 6h18M9 6V3h6v3m4 0-1 15H6L5 6m5 4v7m4-7v7" />
                  </svg>
                  Delete Card
                </button>
              )}
            </div>
          </LadderPopup>
        )}
        {popup === 'rename' && (
          <EditBubble
            {...popupProps}
            label="Enter a new task name"
            placeholder="Task name"
            draft={renameDraft ?? title}
            onDraftChange={onRenameDraftChange}
            onCancel={() => {
              onRenameDraftChange(undefined)
              closePopup()
            }}
            onSubmit={(value) => {
              onRename(value)
              onRenameDraftChange(undefined)
              closePopup()
            }}
          />
        )}
        {popup === 'archive' && (
          <LadderPopup {...popupProps}>
            <div
              className="task-card__archive"
              role="dialog"
              aria-labelledby={archiveTitleId}
              aria-describedby={archiveDescriptionId}
            >
              <h2 id={archiveTitleId}>Delete “{title}”?</h2>
              <p id={archiveDescriptionId}>
                Past steps are kept. Any step recorded for this card today will
                be removed.
              </p>
              <div className="ladder-popup__actions">
                <button
                  type="button"
                  disabled={!canArchive}
                  onClick={() => {
                    closePopup()
                    onArchive()
                  }}
                >
                  Delete
                </button>
                <button
                  type="button"
                  onClick={() => {
                    closePopup()
                    settingsTrigger.current?.focus()
                  }}
                  data-popup-focus
                >
                  Cancel
                </button>
              </div>
            </div>
          </LadderPopup>
        )}
      </div>
    </li>
  )
}
