import { Route, Routes } from 'react-router'
import RoutePanel from '../components/RoutePanel/RoutePanel'
import { ladderPreviews } from '../config/ladderPreviews'
import About from '../pages/About/About'
import LadderPage from '../pages/LadderPage/LadderPage'
import Landing from '../pages/Landing/Landing'
import Life from '../pages/Life/Life'
import LogIn from '../pages/LogIn/LogIn'
import SignUp from '../pages/SignUp/SignUp'
import { AuthSessionBoundary, GuestRoute, ProtectedRoute } from './AuthRoutes'

export default function App() {
  return (
    <Routes>
      <Route path="/about" element={<About />} />
      <Route element={<AuthSessionBoundary />}>
        <Route element={<GuestRoute />}>
          <Route path="/" element={<Landing />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<LogIn />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route path="/life" element={<Life />} />
          <Route
            path="/health"
            element={<RoutePanel title="Health is coming soon" />}
          />
          <Route
            path="/activities"
            element={<LadderPage preview={ladderPreviews.activities} />}
          />
          <Route
            path="/learning"
            element={<LadderPage preview={ladderPreviews.learning} />}
          />
        </Route>
      </Route>
    </Routes>
  )
}
