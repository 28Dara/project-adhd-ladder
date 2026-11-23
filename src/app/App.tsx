import { Route, Routes } from 'react-router'
import About from '../pages/About/About'
import Landing from '../pages/Landing/Landing'
import Life from '../pages/Life/Life'
import LogIn from '../pages/LogIn/LogIn'
import SignUp from '../pages/SignUp/SignUp'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/about" element={<About />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<LogIn />} />
      <Route path="/life" element={<Life />} />
    </Routes>
  )
}
