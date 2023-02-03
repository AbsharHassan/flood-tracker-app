const asyncHandler = require('express-async-handler')
const ee = require('@google/earthengine')
const Geometry = require('../models/geometryModel')

// GET polygons
const getPolygons = async (req, res) => {
  const polygonData = await Geometry.find()
  res.send(polygonData)
}

// Create polygons using EE api
const storeGeometries = (req, res) => {
  const admin2 = ee.FeatureCollection('FAO/GAUL_SIMPLIFIED_500m/2015/level2')

  const districts = admin2.filter(ee.Filter.eq('ADM0_NAME', 'Pakistan'))

  const getGeometeries = (district) => {
    const centerPoint = ee
      .Feature(district)
      .centroid({ maxError: 1 })
      .geometry()
      .coordinates()

    return {
      district: ee.Feature(district).get('ADM2_NAME'),
      geometry: ee.Feature(district).geometry(),
      center: { coordinates: centerPoint },
    }
  }

  if (req.body.update === undefined) {
    res.status(422)
    throw new Error('Incomplete/invalid data in POST body')
  }

  districts.evaluate((featureCollection) => {
    let temporaryHoldingArray = []
    let nullWarningCounter = 0
    let completenessCounter = 0
    for (var index = 0; index < featureCollection.features.length; index++) {
      let districtsArray = districts.toList(1, parseInt(index))

      let districtsGeometricalData = districtsArray.map(getGeometeries)

      districtsGeometricalData.evaluate(async (dataObj) => {
        completenessCounter++
        console.log(completenessCounter)

        if (dataObj[0]) {
          temporaryHoldingArray.push(dataObj[0])
        } else {
          temporaryHoldingArray.push(null)
          nullWarningCounter++
        }

        if (completenessCounter === featureCollection.features.length) {
          if (!JSON.parse(req.body.update)) {
            await Geometry.create({
              districts: temporaryHoldingArray,
            })
          } else {
            await Geometry.findOneAndUpdate({
              districts: temporaryHoldingArray,
            })
          }

          res.json({
            message: `Request fulfilled with ${nullWarningCounter} null responses`,
            nullCounts: nullWarningCounter,
          })
        }
      })
    }
  })
}

// Delete all polygons
const deleteAllGeometry = asyncHandler(async (req, res) => {
  await Geometry.deleteMany()

  res.json({
    message: 'Successfully deleted all geometries',
  })
})

module.exports = {
  getPolygons,
  storeGeometries,
  deleteAllGeometry,
}
