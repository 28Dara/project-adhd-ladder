import { Route, Routes } from 'react-router'
import Footer from '../components/Footer/Footer'
import About from '../pages/About/About'
import Health from '../pages/Health/Health'
import LadderPage from '../pages/LadderPage/LadderPage'
import Landing from '../pages/Landing/Landing'
import Life from '../pages/Life/Life'
import LogIn from '../pages/LogIn/LogIn'
import SignUp from '../pages/SignUp/SignUp'
import { AuthSessionBoundary, GuestRoute, ProtectedRoute } from './AuthRoutes'

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/about" element={<About />} />
        <Route element={<AuthSessionBoundary />}>
          <Route element={<GuestRoute />}>
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<LogIn />} />
          </Route>
          <Route element={<ProtectedRoute publicHome={<Landing />} />}>
            <Route index element={<Life />} />
            <Route path="/life" element={<Life />} />
            <Route path="/health" element={<Health />} />
            <Route
              path="/activities"
              element={<LadderPage ladder="activities" />}
            />
            <Route
              path="/learning"
              element={<LadderPage ladder="learning" />}
            />
          </Route>
        </Route>
      </Routes>
      <Footer />
    </>
  )
}
