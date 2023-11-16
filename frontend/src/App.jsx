import { useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'

import { getApiKey } from './features/map/mapSlice'
import { checkAdmin, persistLogin } from './features/auth/authSlice'
import {
  getFloodData,
  getTotalFloodedArray,
  selectDistrict,
} from './features/apiData/apiDataSlice'

import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import ControlPanel from './pages/ControlPanel'
import Register from './pages/Register'
import ProtectedRoutes from './components/ProtectedRoutes'
import About from './pages/About'

function App() {
  const location = useLocation()
  const dispatch = useDispatch()

  const { defaultDateValue } = useSelector((state) => state.apiData)
  const { isDarkMode } = useSelector((state) => state.sidebar)

  const bodyRef = useRef(document.body)

  useEffect(() => {
    if (bodyRef) {
      if (isDarkMode) {
        bodyRef.current.classList.remove('bg-themeBgColorLight')
        bodyRef.current.classList.add('bg-themeBgColorDark')
      } else {
        bodyRef.current.classList.remove('bg-themeBgColorDark')
        bodyRef.current.classList.add('bg-themeBgColorLight')
      }
    }
  }, [isDarkMode])

  useEffect(() => {
    dispatch(getApiKey())
    dispatch(checkAdmin())
    dispatch(persistLogin())
    dispatch(getFloodData(defaultDateValue))
    dispatch(getTotalFloodedArray())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    dispatch(selectDistrict(null))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location])

  return (
    <AnimatePresence mode="wait">
      <Routes
        location={location}
        key={location.pathname}
      >
        <Route
          path="/"
          element={<Dashboard />}
        />
        <Route
          path="/login"
          element={<Login />}
        />
        <Route
          path="/about"
          element={<About />}
        />

        <Route element={<ProtectedRoutes />}>
          <Route
            path="/register"
            element={<Register />}
          />
          <Route
            path="/control-panel"
            element={<ControlPanel />}
          />
        </Route>
      </Routes>
    </AnimatePresence>
  )
}

export default App
