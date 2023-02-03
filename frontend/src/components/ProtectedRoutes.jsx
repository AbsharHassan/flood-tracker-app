import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'

const ProtectedRoutes = () => {
  const location = useLocation()
  const dispatch = useDispatch()

  const { registerAllowed, user } = useSelector((state) => state.auth)

  const guard = () => {
    console.log(location)

    if (location.pathname === '/register') {
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
    } else if (location.pathname === '/control-panel') {
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

  // return (
  //   <>
  //     {location.pathname === '/register' ? (
  //       registerAllowed ? (
  //         <Outlet />
  //       ) : (
  //         <Navigate
  //           to="/login"
  //           state={{ from: location }}
  //           replace
  //         />
  //       )
  //     ) : user ? (
  //       <Outlet />
  //     ) : (
  //       <Navigate
  //         to="/login"
  //         state={{ from: location }}
  //         replace
  //       />
  //     )}
  //   </>
  // )
}

// const ProtectedRoutes = ({ registerLink, controlLink, loginLink }) => {
//   const location = useLocation()

//   const { registerAllowed, user } = useSelector((state) => state.auth)

//   const guard = () => {
//     console.log(registerAllowed)
//     if (registerAllowed && registerLink) {
//       return <Outlet />
//     } else if (!registerAllowed && user && controlLink) {
//       console.log('yahan tak')
//       return <Outlet />
//     } else {
//       return (
//         <Navigate
//           to="/login"
//           state={{ from: location }}
//           replace
//         />
//       )
//     }
//   }

//   return guard()
// }

// ProtectedRoutes.defaultProps = {
//   registerLink: false,
//   controlLink: false,
//   loginLink: false,
// }

export default ProtectedRoutes
