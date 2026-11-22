import { Link } from 'react-router'
import './BrandLogo.css'

export default function BrandLogo() {
  return (
    <Link className="brand-logo" to="/" aria-label="ADHD Ladder">
      A<span>D</span>H<span>D</span> La<span>d</span>
      <span>d</span>er
    </Link>
  )
}
