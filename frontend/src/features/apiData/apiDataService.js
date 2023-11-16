import axios from 'axios'

const API_URL = '/api/'

// Get districts flood data
const getFloodData = async (currentDate, prevDate) => {
  if (prevDate) {
    const currentPeriodReq = axios.get(`${API_URL}flood-data/${currentDate}`)
    const prevPeriodReq = axios.get(`${API_URL}flood-data/${prevDate}`)

    const response = await Promise.all([currentPeriodReq, prevPeriodReq])

    return { current: response[0].data, prev: response[1].data }
  } else {
    const response = await axios.get(`${API_URL}flood-data/${currentDate}`)

    return { current: response.data, prev: {} }
  }
}

// Get an array containing total flooded percentages
const getTotalFloodedArray = async () => {
  const response = await axios.get(API_URL + 'flood-data/totals/array')

  return response.data
}

const apiDataService = {
  getFloodData,
  getTotalFloodedArray,
}

export default apiDataService
