const express = require('express')
const router = express.Router()
const ee = require('@google/earthengine')

console.log('Authenticating Earth Engine API using private key...'.bgYellow)
ee.data.authenticateViaPrivateKey(
  JSON.parse(process.env.EE_PRIVATE_KEY),
  () => {
    console.log('Authentication successful.'.bgYellow)
    ee.initialize(
      null,
      null,
      () => {
        console.log('Earth Engine client library initialized.'.bgYellow)

        // All routes for flood-data resourse including CRUD
        router.use('/flood-data', require('./floodDataRoutes'))
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
