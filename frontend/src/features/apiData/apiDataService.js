import axios from 'axios'
import dayjs from 'dayjs'

const API_URL = '/api/'
// const API_URL = 'https://flood-tracker-app-api.onrender.com/api/'

// Get districts' flood data
const getFloodData = async (date) => {
  const parsedCurrentStartDate = dayjs(date)
  const previousStartDate = dayjs(parsedCurrentStartDate).subtract(1, 'month')

  if (parsedCurrentStartDate.isAfter(dayjs('2022-01-01'))) {
    // const currentPeriodReq = axios.get(
    //   `${API_URL}flood-data/${parsedCurrentStartDate.format('YYYY-MM-DD')}`
    // )
    // const prevPeriodReq = axios.get(
    //   `${API_URL}flood-data/${previousStartDate.format('YYYY-MM-DD')}`
    // )

    // const response = await Promise.all([currentPeriodReq, prevPeriodReq])

    // return { current: response[0].data, prev: response[1].data }

    const response1 = await axios.get(
      `${API_URL}flood-data/${parsedCurrentStartDate.format('YYYY-MM-DD')}`
    )

    const response2 = await axios.get(
      `${API_URL}flood-data/${previousStartDate.format('YYYY-MM-DD')}`
    )

    return { current: response1.data, prev: response2.data }
  } else {
    const response = await axios.get(
      `${API_URL}flood-data/${parsedCurrentStartDate.format('YYYY-MM-DD')}`
    )

    return { current: response.data, prev: {} }
  }
}

const apiDataService = {
  getFloodData,
}

export default apiDataService
