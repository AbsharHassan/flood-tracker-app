import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'

const ProtectedControlPanelRoute = () => {
  const location = useLocation()

  const { user } = useSelector((state) => state.auth)

  const guard = () => {
    if (location.pathname === '/control-panel') {
      console.log('control panel guard has been called')
      if (user) {
        return <Outlet />
      } else {
        return (
          <Navigate
            to="/login"
            state={{ from: location }}
            replace
          />
        )
      }
    }
  }
  return guard()
}

export default ProtectedControlPanelRoute
