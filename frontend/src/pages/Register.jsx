import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { motion } from 'framer-motion'

import { registerUser, reset } from '../features/auth/authSlice'

import Input from '../components/Input'
import SubmitButton from '../components/SubmitButton'
import { BiArrowBack } from 'react-icons/bi'

const Register = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { isAuthLoading, isAuthSuccess, isAuthError, authMessage } =
    useSelector((state) => state.auth)

  const { isDarkMode } = useSelector((state) => state.sidebar)

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
    }

    dispatch(reset())
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="flex items-center justify-center w-screen h-screen relative">
        <div className="absolute top-5 left-5 text-gradient text-2xl sm:text-5xl">
          <Link to="/">
            <BiArrowBack className="hover:cursor-pointer text-sky-700 hover:text-sky-600 duration-200" />
          </Link>
        </div>
        <div className="w-[90vw] max-w-md ">
          <h1
            className={`mb-1.5 text-4xl font-bold tracking-tighter text-center sm:text-5xl ${
              isDarkMode ? 'text-slate-300' : 'text-slate-800'
            }`}
          >
            Flood <span className="text-gradient">Tracker</span>
          </h1>
          <h3 className="text-xs tracking-tighter mb-6 font-medium  text-center text-sky-500">
            Powered by Google Earth Engine
          </h3>
          <div
            className={` w-full px-5 py-5 ${
              isDarkMode
                ? 'login text-slate-300'
                : 'text-slate-800 bg-themeCardColorLight border border-themeBorderColorLight'
            }`}
          >
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

            <div className="text-center text-xs font-medium uppercase ">
              <span className="text-sky-700 hover:cursor-pointer hover:text-sky-600 duration-200">
                <Link to="/"> click here to return</Link>
              </span>
            </div>
          </div>
          <div
            className={`mx-auto mt-6 text-xs max-w-sm text-center ${
              isDarkMode ? 'text-slate-400' : 'text-slate-800'
            }`}
          >
            The control panel is for admin use only and is used to manage the
            backend configurations of this application.
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default Register
