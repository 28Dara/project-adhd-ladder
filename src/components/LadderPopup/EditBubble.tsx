import { useId, type FormEvent } from 'react'
import LadderPopup, { type LadderPopupProps } from './LadderPopup'

interface EditBubbleProps extends LadderPopupProps {
  label: string
  placeholder: string
  draft: string
  onDraftChange: (draft: string) => void
  onSubmit: (value: string) => void
  onCancel: () => void
}

export default function EditBubble({
  label,
  placeholder,
  draft,
  onDraftChange,
  onSubmit,
  onCancel,
  trigger,
  ...popupProps
}: EditBubbleProps) {
  const inputId = useId()
  const labelId = useId()
  const value = draft.trim()

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (value) {
      onSubmit(value)
      trigger.current?.focus()
    }
  }

  return (
    <LadderPopup trigger={trigger} {...popupProps}>
      <form
        className="ladder-popup__form"
        aria-labelledby={labelId}
        onSubmit={handleSubmit}
      >
        <label id={labelId} htmlFor={inputId}>
          {label}
        </label>
        <input
          id={inputId}
          type="text"
          placeholder={placeholder}
          value={draft}
          onChange={(event) => onDraftChange(event.target.value)}
          required
          data-popup-focus
        />
        <div className="ladder-popup__actions">
          <button
            type="submit"
            className="ladder-popup__primary"
            disabled={!value}
          >
            Submit
          </button>
          <button
            type="button"
            onClick={() => {
              onCancel()
              trigger.current?.focus()
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </LadderPopup>
  )
}
