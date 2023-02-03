import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'

const ProtectLogin = () => {
  const location = useLocation()

  const { registerAllowed, user } = useSelector((state) => state.auth)

  const guard = () => {
    if (!user) {
      return <Outlet />
    } else {
      return (
        <Navigate
          to="/control-panel"
          state={{ from: location }}
          replace
        />
      )
    }
  }

  return guard()
}

export default ProtectLogin
