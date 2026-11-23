import { Link, useMatch } from 'react-router'
import './LadderSelector.css'

const destinations = {
  life: 'Life Ladder',
  health: 'Health Ladder',
  activities: 'Activities Ladder',
  learning: 'Learning Ladder',
}

export default function LadderSelector() {
  const match = useMatch('/:ladder')
  const slug = match?.params.ladder?.toLowerCase()

  if (slug !== 'life' && slug !== 'activities' && slug !== 'learning')
    return null

  return (
    <details
      key={slug}
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
