const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/authMiddleware')
const {
  getAllFloodData,
  getMapID,
  landClassificationDataGenerator,
  checkNullEntries,
  deleteSpecificFloodData,
  deleteAllFloodData,
} = require('../controllers/floodDataController')

// Create and return mapId for flood pixels of district
router.post('/district', getMapID)

// GET all the flood data
router.get('/', getAllFloodData)

// Compute add/update flood data for given time period
router.post(
  '/ee-api/landcover-statistics',
  protect,
  landClassificationDataGenerator
)

// Check if there are any null entries in flood-data resource
router.get('/check-null', protect, checkNullEntries)

// DELETE certain flood data based on after_START
router.delete('/delete/:after_START', protect, deleteSpecificFloodData)

// DELETE all flood data
router.delete('/delete', protect, deleteAllFloodData)

module.exports = router
