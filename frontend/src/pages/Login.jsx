import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useNavigate, useLocation } from 'react-router-dom'

import { loginUser, reset, setAuthMessage } from '../features/auth/authSlice'

import Input from '../components/Input'
import SubmitButton from '../components/SubmitButton'
import { BiArrowBack } from 'react-icons/bi'

const Login = () => {
  const dispatch = useDispatch()
  const location = useLocation()
  const navigate = useNavigate()

  const {
    registerAllowed,
    user,
    isAuthLoading,
    isAuthSuccess,
    isAuthError,
    authMessage,
  } = useSelector((state) => state.auth)

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    passwordConfirm: '',
  })
  const [borderRed, setBorderRed] = useState({
    email: false,
    password: false,
    passwordConfirm: false,
  })
  const [errorMessage, setErrorMessage] = useState('')

  const handleFormDataChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }))
  }

  const handleLoginSubmit = async (e) => {
    e.preventDefault()
    setBorderRed({
      email: false,
      password: false,
    })

    if (formData.email === user?.email) {
      setBorderRed({
        email: true,
        password: false,
      })

      setErrorMessage('Already logged in as ' + formData.email)
    } else {
      dispatch(loginUser(formData))
    }
  }

  useEffect(() => {
    if (isAuthError) {
      if (authMessage === 'Please add all fields.') {
        setBorderRed({
          email: formData.email.length ? false : true,
          password: formData.password.length ? false : true,
        })
      } else if (authMessage === 'Invalid credentials.') {
        setBorderRed({
          email: true,
          password: true,
        })
      }

      setErrorMessage(authMessage)
    }
    if (isAuthSuccess) {
      navigate('/control-panel')
    }

    dispatch(reset())
  }, [isAuthSuccess, isAuthError, authMessage, navigate, dispatch])

  return (
    <>
      <div className="flex items-center justify-center w-screen h-screen relative">
        <div className="absolute top-5 left-5 text-gradient text-2xl  sm:text-5xl">
          <Link to="/">
            <BiArrowBack className="hover:cursor-pointer text-sky-700 hover:text-sky-600 duration-200" />
          </Link>
        </div>
        <div className="w-[90vw] max-w-md ">
          <Link to="/">
            <div>
              <h1 className="mb-1.5 text-4xl font-bold tracking-tighter  text-center text-slate-300 sm:text-5xl">
                Flood <span className="text-gradient">Tracker</span>
              </h1>
              <h3 className="text-xs tracking-tighter mb-12 font-medium  text-center text-sky-500">
                Powered by Google Earth Engine
              </h3>
            </div>
          </Link>
          <div className="login text-slate-300 w-full px-5 py-5">
            <div className="flex items-baseline justify-between">
              <div className="text-sm font-medium mb-1">
                Login into Admin Account
              </div>
              <button
                className={`flex items-center justify-center text-xs font-bold p-2 rounded ${
                  registerAllowed
                    ? 'text-black bg-sky-600/70 hover:bg-sky-600 duration-300'
                    : 'text-slate-500 cursor-not-allowed bg-slate-800'
                }`}
                onClick={() => {
                  if (registerAllowed) navigate('/register')
                }}
              >
                Register
              </button>
            </div>
            <div className="text-[10px] font-medium text-slate-500">
              Sign in to access control panel.
            </div>
            <div className="text-red-600 text-[12px] font-bold tracking-tight flex items-center mb-3 h-7">
              {errorMessage}
            </div>
            <Input
              label="Email"
              name="email"
              type="email"
              placeholder="Enter email"
              value={formData.email}
              redBorder={borderRed.email}
              handleOnChange={handleFormDataChange}
            />
            <Input
              label="Password"
              name="password"
              type="password"
              placeholder="Enter password"
              value={formData.password}
              redBorder={borderRed.password}
              handleOnChange={handleFormDataChange}
            />
            <SubmitButton
              label="Log In"
              isLoading={isAuthLoading}
              handleClick={handleLoginSubmit}
            />
            {/* <div className="text-center text-xs font-medium text-cyan-700">
            Or go <span>back?</span>
          </div> */}
            <div className="text-center text-xs font-medium uppercase ">
              <span className="text-sky-700 hover:cursor-pointer hover:text-sky-600 duration-200">
                <Link to="/"> click here to return</Link>
              </span>
            </div>
          </div>
          <div className="mx-auto mt-6 text-xs text-slate-400 max-w-sm text-center">
            The control panel is for admin use only and is used to manage the
            backend configurations of this application.
          </div>
        </div>
      </div>
    </>
  )
}

export default Login
