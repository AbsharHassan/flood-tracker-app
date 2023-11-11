const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/authMiddleware')
const {
  getFloodData,
  getMapID,
  landClassificationDataGenerator,
  checkNullEntries,
  deleteFloodData,
} = require('../controllers/floodDataController')

// Create and return mapId for flood pixels of district
router.post('/district', getMapID)

// GET flood data
router.get('/:after_START', getFloodData)

// Compute add/update flood data for given time period
router.post(
  '/ee-api/landcover-statistics',
  protect,
  landClassificationDataGenerator
)

// Check if there are any null entries in flood-data resource
router.get('/check-null', protect, checkNullEntries)

// DELETE flood data
router.delete('/delete/:after_START', protect, deleteFloodData)

module.exports = router
