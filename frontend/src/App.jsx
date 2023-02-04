import { useEffect } from 'react'
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
import BackgroundSVG from './components/BackgroundSVG'

function App() {
  const location = useLocation()
  const dispatch = useDispatch()
  const { tryAgain } = useSelector((state) => state.apiData)

  useEffect(() => {
    // console.log('some stupid change happened')
  })

  useEffect(() => {
    console.log(process.env.NODE_ENV)
  }, [])

  useEffect(() => {
    dispatch(getApiKey())
    dispatch(checkAdmin())
    dispatch(persistLogin())
    dispatch(getFloodData())
  }, [dispatch])

  useEffect(() => {
    if (tryAgain) dispatch(getFloodData())
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

      <BackgroundSVG />
    </>
  )
}

export default App
