import axios from 'axios'

const API_URL = '/api/'

// Get Google Maps Api key
const getApiKey = async () => {
  const response = await axios.post(API_URL + 'key')

  return response.data
}

const mapService = {
  getApiKey,
}

export default mapService
