import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'
import jwt_decode from 'jwt-decode'
import dayjs from 'dayjs'

import { refresh, setAccessToken } from '../features/auth/authSlice'

const baseURL = 'https://flood-tracker-app-api.onrender.com/api/'

const useAxios = () => {
  const dispatch = useDispatch()
  const { accessToken } = useSelector((state) => state.auth)

  const [nativeAccessToken, setNativeAccessToken] = useState(accessToken)

  useEffect(() => {
    setNativeAccessToken(nativeAccessToken)
  }, [accessToken, nativeAccessToken, setNativeAccessToken])

  const privAxios = axios.create({
    baseURL,
    headers: { authorization: `Bearer ${nativeAccessToken}` },
  })

  privAxios.interceptors.request.use(async (req) => {
    console.log('intercepted')

    if (nativeAccessToken) {
      const user = jwt_decode(nativeAccessToken)
      const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1

      if (!isExpired) return req
    }

    console.log(nativeAccessToken)

    console.log('interceptor made a call to the refresh endpoint')

    const response = await axios.get(baseURL + 'refresh')

    console.log(response)

    dispatch(setAccessToken(response.data.accessToken))

    req.headers.authorization = `Bearer ${response.data.accessToken}`

    return req
  })

  return privAxios
}

export default useAxios
