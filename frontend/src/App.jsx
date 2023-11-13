import { useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Routes, Route, useLocation } from 'react-router-dom'
import { CSSTransition, SwitchTransition } from 'react-transition-group'

import { getApiKey } from './features/map/mapSlice'
import { checkAdmin, persistLogin } from './features/auth/authSlice'
import { getFloodData } from './features/apiData/apiDataSlice'

import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import ControlPanel from './pages/ControlPanel'
import Register from './pages/Register'
import ProtectedRoutes from './components/ProtectedRoutes'
import About from './pages/About'

import axios from 'axios'
import dayjs from 'dayjs'

function App() {
  const location = useLocation()
  const dispatch = useDispatch()
  const { tryAgain, selectedFloodData } = useSelector((state) => state.apiData)
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
    console.log(selectedFloodData)
  }, [selectedFloodData])

  useEffect(() => {
    dispatch(getApiKey())
    dispatch(checkAdmin())
    dispatch(persistLogin())
    dispatch(getFloodData('2022-01-01'))
  }, [dispatch])

  useEffect(() => {
    if (tryAgain) dispatch(getFloodData())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tryAgain])

  return (
    <>
      <SwitchTransition>
        <CSSTransition
          key={location.pathname}
          timeout={500}
          classNames="routing"
          appear={true}
        >
          <Routes location={location}>
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
        </CSSTransition>
      </SwitchTransition>
    </>
  )
}

export default App
