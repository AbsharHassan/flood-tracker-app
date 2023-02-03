import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'

const ProtectedRegisterRoute = () => {
  const location = useLocation()

  const { registerAllowed } = useSelector((state) => state.auth)

  const guard = () => {
    console.log(registerAllowed)
    if (registerAllowed) {
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
  return guard()
}

export default ProtectedRegisterRoute
