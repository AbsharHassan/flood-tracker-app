import axios from 'axios'
import jwtDecode from 'jwt-decode'
import dayjs from 'dayjs'
// import { setAccessToken } from '../features/auth/authSlice'

import useAxios from '../../utils/useAxios'

// let privAxios = useAxios()

const API_URL = '/api/'
// const API_URL = 'https://flood-tracker-app-api.onrender.com/api/'

// Check if admin exits
const checkAdmin = async () => {
  const response = await axios.get(API_URL + 'check-user')

  return response.data
}

// Register user
const registerUser = async (formData) => {
  const response = await axios.post(API_URL + 'create-user', formData)

  if (response.data) {
    const { _id, email } = response.data
    sessionStorage.setItem('user', JSON.stringify({ _id, email }))
    sessionStorage.setItem('isLoggedIn', true)
  }

  return response.data
}

// Log in user
const loginUser = async (formData) => {
  const response = await axios.post(API_URL + 'login', formData)

  if (response.data) {
    const { _id, email } = response.data
    sessionStorage.setItem('user', JSON.stringify({ _id, email }))
    sessionStorage.setItem('isLoggedIn', true)
  }

  return response.data
}

// Log out the user
const logoutUser = async () => {
  const response = await axios.post(API_URL + 'logout')

  if (response) {
    sessionStorage.removeItem('user')
    sessionStorage.setItem('isLoggedIn', false)
  }

  return response
}

// Delete user
const deleteUser = async (formData, accessToken) => {
  const response = await axios.post(API_URL + 'delete-user', formData, {
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
  })

  if (response.data.success) {
    sessionStorage.removeItem('user')
  }

  return response.data
}

// Get new accessToken
const refresh = async () => {
  const response = await axios.get(API_URL + 'refresh')

  return response.data
}

const testFunc = async (accessToken) => {
  axios.interceptors.request.use(async (req) => {
    const user = jwtDecode(accessToken)
    const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1

    console.log('intercepted')

    if (!isExpired) return req

    console.log('interceptor made a call to the refresh endpoint')

    const response = await axios.get(API_URL + 'refresh')

    // setAccessToken(response.data)

    req.headers.authorization = `Bearer ${response.data}`

    return { req, response }
  })
  const response = await axios.get(API_URL + 'testo', {
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
  })

  return response
}

const authService = {
  checkAdmin,
  registerUser,
  loginUser,
  deleteUser,
  refresh,
  testFunc,
  logoutUser,
}

export default authService
