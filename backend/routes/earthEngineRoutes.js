const express = require('express')
const router = express.Router()
const ee = require('@google/earthengine')
// const privateKey = require('../../EarthEngine/ee.json')
const { protect } = require('../middleware/authMiddleware')
const {
  getMapID,
  landClassificationDataGenerator,
  getEEdata,
  storeDistrictData,
} = require('../controllers/earthEngineController')

console.log('Authenticating Earth Engine API using private key...'.bgYellow)
ee.data.authenticateViaPrivateKey(
  // privateKey,
  JSON.parse(process.env.EE_PRIVATE_KEY),
  () => {
    console.log('Authentication successful.'.bgYellow)
    ee.initialize(
      null,
      null,
      () => {
        console.log('Earth Engine client library initialized.'.bgYellow)
        // router.get('/temp', tempF)
        // router.get('/flood-pixels', protect, getMapID)
        // router.post(
        //   '/ee-api/landcover-statistics',
        //   // protect,
        //   landClassificationDataGenerator
        // )
        // router.get('/ee-api/data', protect, getEEdata)
        // router.post('/geometeries', protect, storeDistrictData)
        router.use('/flood-data', require('./floodDataRoutes'))
        router.use('/geometry', require('./geometryRoutes'))
      },
      (err) => {
        console.log(err)
      }
    )
  },
  (err) => {
    console.log(err)
  }
)

module.exports = router
