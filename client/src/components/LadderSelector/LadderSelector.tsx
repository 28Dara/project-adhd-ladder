import { useEffect, useRef } from 'react'
import { Link, useMatch } from 'react-router'
import './LadderSelector.css'

const destinations = {
  life: 'Life Ladder',
  health: 'Health Ladder',
  activities: 'Activities Ladder',
  learning: 'Learning Ladder',
}

export default function LadderSelector() {
  const home = useMatch('/')
  const match = useMatch('/:ladder')
  const slug = home ? 'life' : match?.params.ladder?.toLowerCase()
  const selectorRef = useRef<HTMLDetailsElement>(null)

  useEffect(() => {
    function closeOnOutsideClick(event: MouseEvent) {
      const selector = selectorRef.current
      if (
        selector?.open &&
        event.target instanceof Node &&
        !selector.contains(event.target)
      ) {
        selector.open = false
      }
    }

    document.addEventListener('click', closeOnOutsideClick, true)
    return () =>
      document.removeEventListener('click', closeOnOutsideClick, true)
  }, [])

  if (
    slug !== 'life' &&
    slug !== 'health' &&
    slug !== 'activities' &&
    slug !== 'learning'
  )
    return null

  return (
    <details
      key={slug}
      ref={selectorRef}
      className="ladder-selector"
      onKeyDown={(event) => {
        const selector = event.currentTarget
        if (event.key === 'Escape' && selector.open) {
          selector.open = false
          selector.querySelector('summary')?.focus()
        }
      }}
    >
      <summary className="ladder-selector__summary">
        {destinations[slug]}
      </summary>
      <ul className="ladder-selector__options">
        {Object.entries(destinations)
          .filter(([destination]) => destination !== slug)
          .map(([destination, label]) => (
            <li key={destination}>
              <Link to={`/${destination}`}>{label}</Link>
            </li>
          ))}
      </ul>
    </details>
  )
}
