import { Link } from 'react-router'

export default function About() {
  return (
    <main>
      <h1>About ADHD Ladder</h1>
      <p>
        ADHD Ladder aims to make daily routines easier to start and progress
        easier to see.
      </p>
      <p>
        This app is a final project for the TripleTen web development program.
      </p>
      <Link to="/">Back to home</Link>
    </main>
  )
}
