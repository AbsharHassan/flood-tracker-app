const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/authMiddleware')
const {
  storeGeometries,
  deleteAllGeometry,
  getMapID,
  getDatafromMongo,
  getPolygons,
  rando,
  someFunc,
} = require('../controllers/geometryController')

// Store polygons for all districts
router.post(
  '/ee-api/create-polygons',
  // protect,
  storeGeometries
)

// Get all polygons
router.get('/polygons', getPolygons)

router.delete(
  '/delete',
  // protect,
  deleteAllGeometry
)

module.exports = router
