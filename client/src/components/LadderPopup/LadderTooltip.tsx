import { useEffect, useRef } from 'react'
import './LadderPopup.css'

export default function LadderTooltip({
  children,
  className = '',
}: {
  children: string
  className?: string
}) {
  const tooltipRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const tooltip = tooltipRef.current
    const anchor = tooltip?.parentElement
    if (!tooltip || !anchor) return

    const positionTooltip = () => {
      if (getComputedStyle(tooltip).visibility !== 'visible') return
      const { top, bottom } = anchor.getBoundingClientRect()
      const spaceBelow = document.documentElement.clientHeight - bottom
      tooltip.dataset.placement =
        spaceBelow < tooltip.offsetHeight + 10 && top > spaceBelow
          ? 'above'
          : 'below'
    }

    anchor.addEventListener('pointerenter', positionTooltip)
    anchor.addEventListener('focusin', positionTooltip)
    window.addEventListener('scroll', positionTooltip, true)
    window.addEventListener('resize', positionTooltip)

    return () => {
      anchor.removeEventListener('pointerenter', positionTooltip)
      anchor.removeEventListener('focusin', positionTooltip)
      window.removeEventListener('scroll', positionTooltip, true)
      window.removeEventListener('resize', positionTooltip)
    }
  }, [])

  return (
    <span
      ref={tooltipRef}
      className={`ladder-bubble ladder-tooltip ${className}`.trimEnd()}
      aria-hidden="true"
    >
      {children}
    </span>
  )
}
