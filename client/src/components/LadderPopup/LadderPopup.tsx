import { useEffect, useLayoutEffect, useRef, type ReactNode } from 'react'
import './LadderPopup.css'

export interface LadderPopupProps {
  id: string
  trigger: { readonly current: HTMLButtonElement | null }
  onDismiss: () => void
  centerOnMobile?: boolean
}

export default function LadderPopup({
  id,
  trigger,
  onDismiss,
  centerOnMobile = false,
  children,
}: LadderPopupProps & { children: ReactNode }) {
  const popupRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const popup = popupRef.current
    const content = contentRef.current
    const button = trigger.current
    if (!popup || !content || !button) return

    const positionPopup = () => {
      const anchor = button.getBoundingClientRect()
      const { clientWidth, clientHeight } = document.documentElement
      const gutter = 8
      const gap = 10
      const width = popup.offsetWidth
      const centerInViewport =
        centerOnMobile && !window.matchMedia('(min-width: 40rem)').matches
      const left = centerInViewport
        ? (clientWidth - width) / 2
        : Math.max(
            gutter,
            Math.min(anchor.right - width, clientWidth - width - gutter),
          )
      const below = clientHeight - anchor.bottom - gap - gutter
      const above = anchor.top - gap - gutter
      const opensAbove = content.scrollHeight + 2 > below && above > below

      popup.dataset.placement = opensAbove ? 'above' : 'below'
      popup.style.left = `${left}px`
      popup.style.setProperty(
        '--popup-space',
        `${Math.max(0, opensAbove ? above : below)}px`,
      )
      popup.style.setProperty(
        '--bubble-tip',
        `${Math.max(14, Math.min(width - 14, anchor.left + anchor.width / 2 - left))}px`,
      )
      popup.style.top = `${opensAbove ? anchor.top - gap - popup.offsetHeight : anchor.bottom + gap}px`
      popup.style.visibility =
        anchor.bottom <= 0 || anchor.top >= clientHeight ? 'hidden' : 'visible'
    }

    positionPopup()
    popup
      .querySelector<HTMLElement>('[data-popup-focus]')
      ?.focus({ preventScroll: true })
    window.addEventListener('resize', positionPopup)
    window.addEventListener('scroll', positionPopup, true)

    return () => {
      window.removeEventListener('resize', positionPopup)
      window.removeEventListener('scroll', positionPopup, true)
    }
  }, [centerOnMobile, trigger])

  useEffect(() => {
    const popup = popupRef.current
    const button = trigger.current

    function dismissOutside(event: Event) {
      const target = event.target
      if (
        target instanceof Node &&
        !popup?.contains(target) &&
        !button?.contains(target)
      ) {
        onDismiss()
      }
    }

    function dismissOnEscape(event: KeyboardEvent) {
      if (event.key !== 'Escape' || event.defaultPrevented) return
      event.preventDefault()
      button?.focus()
      onDismiss()
    }

    document.addEventListener('click', dismissOutside, true)
    document.addEventListener('focusin', dismissOutside)
    document.addEventListener('keydown', dismissOnEscape)

    return () => {
      document.removeEventListener('click', dismissOutside, true)
      document.removeEventListener('focusin', dismissOutside)
      document.removeEventListener('keydown', dismissOnEscape)
    }
  }, [onDismiss, trigger])

  return (
    <div id={id} ref={popupRef} className="ladder-bubble ladder-popup">
      <div ref={contentRef} className="ladder-popup__content">
        {children}
      </div>
    </div>
  )
}
