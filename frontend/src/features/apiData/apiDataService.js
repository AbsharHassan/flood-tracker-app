import axios from 'axios'
import dayjs from 'dayjs'

const API_URL = '/api/'
// const API_URL = 'https://flood-tracker-app-api.onrender.com/api/'

// Get districts' flood data
const getFloodData = async (date) => {
  const parsedCurrentStartDate = dayjs(date).format('YYYY-MM-DD')
  const previousStartDate = dayjs(parsedCurrentStartDate)
    .subtract(1, 'month')
    .format('YYYY-MM-DD')

  const currentPeriodReq = axios.get(
    `${API_URL}flood-data/${parsedCurrentStartDate}`
  )
  const prevPeriodReq = axios.get(`${API_URL}flood-data/${previousStartDate}`)

  const response = await Promise.all([currentPeriodReq, prevPeriodReq])

  return { current: response[0].data, prev: response[1].data }
}

const apiDataService = {
  getFloodData,
}

export default apiDataService
