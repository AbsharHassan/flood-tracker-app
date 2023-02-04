import axios from 'axios'

const API_URL = '/api/'
// const API_URL = 'https://flood-tracker-app-api.onrender.com/api/'

// Get districts' flood data
const getFloodData = async (date) => {
  const response = await axios.get(API_URL + 'flood-data')

  // console.log(response)
  return response.data
}

const apiDataService = {
  getFloodData,
}

export default apiDataService
