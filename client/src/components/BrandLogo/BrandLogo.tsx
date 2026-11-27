import { Link } from 'react-router'
import { useAuth } from '../../hooks/useAuth'
import './BrandLogo.css'

const wordmark = (
  <>
    A<span>D</span>H<span>D</span> La<span>d</span>
    <span>d</span>er
  </>
)

export default function BrandLogo() {
  const { isLoading, session, sessionError } = useAuth()

  if (isLoading || sessionError) {
    return <span className="brand-logo">{wordmark}</span>
  }

  return (
    <Link
      className="brand-logo"
      to={session ? '/life' : '/'}
      aria-label="ADHD Ladder"
    >
      {wordmark}
    </Link>
  )
}
