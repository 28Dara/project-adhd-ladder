import { Link } from 'react-router-dom'

export default function Landing() {
  return (
    <main>
      <h1>ADHD Ladder</h1>
      <p>Break everyday tasks into small steps and see your progress over time.</p>
      <Link to="/about">About ADHD Ladder</Link>
    </main>
  )
}
