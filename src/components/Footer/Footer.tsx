import { Link } from 'react-router'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="site-footer">
      <small>ADHD Ladder © 2026</small>
      <Link to="/about">About</Link>
    </footer>
  )
}
