const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/authMiddleware')
const {
  landClassificationDataGenerator,
  getAllFloodData,
  getMapID,
  checkNullEntries,
  deleteAllFloodData,
} = require('../controllers/floodDataController')

// GET all the flood data
router.get('/', getAllFloodData)

// GET mapId for flood pixels of district
router.post('/district', getMapID)

// Compute add/update flood data for given date
router.post(
  '/ee-api/landcover-statistics',
  // protect,
  landClassificationDataGenerator
)

router.get(
  '/check-null',
  // protect
  checkNullEntries
)

// DELETE all flood data
router.delete(
  '/delete',
  // protect,
  deleteAllFloodData
)

module.exports = router
