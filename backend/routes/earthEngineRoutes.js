const express = require('express')
const router = express.Router()
const ee = require('@google/earthengine')
const cron = require('node-cron')
const { updateDbFunction } = require('../controllers/floodDataController')

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

        // Cron job to run at 12:01 AM, on day 1 of every month to update the database with more flood data
        cron.schedule('1 0 1 * *', () => {
          console.log('Cron job running at 00:01 on the first of every month')
          updateDbFunction()
        })
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
