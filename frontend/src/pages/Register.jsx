import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {
  registerUser,
  reset,
  toggleRegisterAllowed,
  checkAdmin,
} from '../features/auth/authSlice'

import Input from '../components/Input'
import SubmitButton from '../components/SubmitButton'
import { BiArrowBack } from 'react-icons/bi'

const Login = () => {
  const dispatch = useDispatch()
  const location = useLocation()
  const navigate = useNavigate()

  const { isAuthLoading, isAuthSuccess, isAuthError, authMessage } =
    useSelector((state) => state.auth)

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

  useEffect(() => {
    if (isAuthError) {
      console.log(authMessage)
      if (authMessage === 'Please add all fields.') {
        setBorderRed({
          email: formData.email.length ? false : true,
          password: formData.password.length ? false : true,
          passwordConfirm: formData.passwordConfirm.length ? false : true,
        })
      } else if (authMessage === 'Passwords do not match.') {
        setBorderRed({
          email: false,
          password: true,
          passwordConfirm: true,
        })
      }

      setErrorMessage(authMessage)
    }
    if (isAuthSuccess) {
      navigate('/control-panel')

      // dispatch(checkAdmin())
      // dispatch(toggleRegisterAllowed(false))
    }

    dispatch(reset())
  }, [isAuthSuccess, isAuthError, authMessage, navigate, dispatch])

  const handleRegisterSubmit = async (e) => {
    e.preventDefault()
    setBorderRed({
      email: false,
      password: false,
      passwordConfirm: false,
    })

    dispatch(registerUser(formData))
  }

  const handleFormDataChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <>
      <div className="flex items-center justify-center w-screen h-screen relative">
        <div className="absolute top-5 left-5 text-gradient text-2xl sm:text-5xl">
          <Link to="/">
            <BiArrowBack className="hover:cursor-pointer text-sky-700 hover:text-sky-600 duration-200" />
          </Link>
        </div>
        <div className="w-[90vw] max-w-md ">
          <h1 className="mb-1.5 text-4xl font-bold tracking-tighter text-center text-slate-300 sm:text-5xl">
            Flood <span className="text-gradient">Tracker</span>
          </h1>
          <h3 className="text-xs tracking-tighter mb-6 font-medium  text-center text-sky-500">
            Powered by Google Earth Engine
          </h3>
          <div className="login text-slate-300 w-full px-5 py-5">
            <div className="flex items-baseline justify-between">
              <div className="text-sm font-medium mb-1">
                Create Your Admin Account
              </div>
              <button
                className={`flex items-center justify-center text-xs font-bold p-2 rounded text-black bg-sky-600/70 hover:bg-sky-600 duration-300 `}
                onClick={() => {
                  navigate('/login')
                }}
              >
                Back
              </button>
            </div>
            <div className="text-[10px] font-medium text-slate-500 ">
              Create an account to access control panel.
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
            <Input
              label="Re-enter Password"
              name="passwordConfirm"
              type="password"
              placeholder="Confirm password"
              value={formData.passwordConfirm}
              redBorder={borderRed.passwordConfirm}
              handleOnChange={handleFormDataChange}
            />
            <SubmitButton
              label="Sign Up"
              isLoading={isAuthLoading}
              handleClick={handleRegisterSubmit}
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
