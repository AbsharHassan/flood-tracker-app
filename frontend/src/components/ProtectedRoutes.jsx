import { useEffect, useState } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'

const ProtectedRoutes = () => {
  const location = useLocation()

  const { registerAllowed, user } = useSelector((state) => state.auth)

  const [isRegisterAllowed, setIsRegisterAllowed] = useState(registerAllowed)
  const [isUser, setIsUser] = useState(user)

  useEffect(() => {
    setIsRegisterAllowed(registerAllowed)
  }, [registerAllowed])

  useEffect(() => {
    setIsUser(user)
  }, [user])

  const guard = () => {
    if (location.pathname === '/register') {
      if (isRegisterAllowed) {
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
    } else if (location.pathname === '/control-panel') {
      if (isUser) {
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

export default ProtectedRoutes
