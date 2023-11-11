const asyncHandler = require('express-async-handler')
const ee = require('@google/earthengine')
const moment = require('moment')
const FloodData = require('../models/floodDataModel')

// @desc    Returns first and last dates of previous month in YYYY-MM-DD format
// @route   N/A - Native Function
// @access  N/A - Internal
const getPreviousMonthDates = () => {
  // First date of the previous month
  const afterStartDate = moment()
    .subtract(1, 'months')
    .startOf('month')
    .format('YYYY-MM-DD')

  // Last date of the previous month
  const afterEndDate = moment()
    .subtract(1, 'months')
    .endOf('month')
    .format('YYYY-MM-DD')

  console.log(afterStartDate)
  console.log(afterEndDate)

  return { afterStartDate, afterEndDate }
}

// @desc    Adds new entries into the database. Used by the cron Job.
// @route   N/A - Native Function
// @access  N/A - Internal
const updateDbFunction = async () => {
  console.log('starting the updateDbFunction')

  const { afterStartDate, afterEndDate } = getPreviousMonthDates()

  const req = {
    body: {
      afterEndDate,
      afterStartDate,
      update: false,
      cron: true,
    },
  }
  const res = null

  landClassificationDataGenerator(req, res)

  let existingEntry = await FloodData.findOne({
    after_END: req.body.afterEndDate,
    after_START: req.body.afterStartDate,
  })

  let hasNullResult = true
  let isIncomplete = true

  if (existingEntry) {
    hasNullResult = existingEntry.districts.some(
      (district) => district.result === null
    )
    if (existingEntry.districts.length !== 119) {
      isIncomplete = true
    } else {
      isIncomplete = false
    }
  }

  let timeout

  if (hasNullResult || isIncomplete) {
    const delay = 20 * 60 * 1000

    timeout = setTimeout(() => {
      updateDbFunction()
    }, delay)
  } else {
    clearTimeout(timeout)
  }
}

// @desc    Get flood pixels map ID
// @route   POST /api/flood-data/district
// @access  Public
const getMapID = (req, res) => {
  console.log('req called')
  let s1 = ee.ImageCollection('COPERNICUS/S1_GRD')
  let admin2 = ee.FeatureCollection('FAO/GAUL_SIMPLIFIED_500m/2015/level2')

  const district = admin2
    .filter(ee.Filter.eq('ADM0_NAME', 'Pakistan'))
    .filter(ee.Filter.eq('ADM2_NAME', `${req.body.district}`))
    .geometry()

  let beforeStart = '2022-03-01'
  let beforeEnd = '2022-05-30'
  let afterStart = req.body.afterStart
  let afterEnd = req.body.afterEnd

  console.log(req.body)

  const floodPixels = getFloodPixels(
    district,
    beforeStart,
    beforeEnd,
    afterStart,
    afterEnd,
    s1
  )

  floodPixels.getMap({ min: 0, max: 1, palette: '#0099FF' }, ({ mapid }) => {
    res.send(mapid)
  })
}

// @desc    Get all flood-data
// @route   GET /api/flood-data/
// @access  Public
const getAllFloodData = asyncHandler(async (req, res) => {
  const districtData = await FloodData.find()

  res.send(districtData)
})

// @desc    Check to see if dates in the request are valid
// @route   N/A - Native Function
// @access  N/A - Internal
const validateFormDates = (req, res) => {
  const parsedStartDate = moment(req.body.afterStartDate, 'YYYY-MM-DD', true)
  const parsedEndDate = moment(req.body.afterEndDate, 'YYYY-MM-DD', true)

  // check date formats
  if (!parsedStartDate.isValid() || !parsedEndDate.isValid()) {
    if (res) {
      res.status(422)
    }
    throw new Error('invalid date format, enter in the format YYYY-MM-DD')
  }

  // check if dates are in the correct ranges
  const minDate = moment('2022-01-01')
  const maxDate = moment() // current date
  if (
    !(
      parsedStartDate.isAfter(minDate) &&
      parsedEndDate.isBefore(maxDate) &&
      parsedEndDate.isAfter(parsedStartDate)
    )
  ) {
    if (res) {
      res.status(422)
    }
    throw new Error(
      'Start date must be before end date and they must fall within the 2022-01-01 and present date'
    )
  }

  // check if the dates are of the same month
  if (parsedStartDate.month() !== parsedEndDate.month()) {
    if (res) {
      res.status(422)
    }
    throw new Error('currently, both dates must be of the same month')
  }

  // check if start date is the first of a month
  if (parsedStartDate.date() !== 1) {
    if (res) {
      res.status(422)
    }
    throw new Error('currently, start date must be the 1st of a month')
  }

  // check if end date is the last date of a month
  const lastDayOfMonth = parsedEndDate.clone().endOf('month')
  if (!parsedEndDate.isSame(lastDayOfMonth, 'day')) {
    if (res) {
      res.status(422)
    }
    throw new Error(
      'currently, the end date must be the last date of the month'
    )
  }

  return true
}

// @desc    Create or update flood data for each district using the EE api
// @route   POST /api/flood-data/ee-api/landcover-statistics
// @access  Private
const landClassificationDataGenerator = asyncHandler(async (req, res) => {
  if (
    !(req.body.afterStartDate && req.body.afterEndDate) ||
    req.body.update === undefined
  ) {
    if (res) {
      res.status(422)
      throw new Error('Incomplete/invalid data in POST body')
    } else {
      return false
    }
  }

  // Validate the dates in the request
  if (!validateFormDates(req, res)) return

  let s1 = ee.ImageCollection('COPERNICUS/S1_GRD')
  let s2 = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
  let ESAworldcover = ee.ImageCollection('ESA/WorldCover/v100')
  let admin2 = ee.FeatureCollection('FAO/GAUL_SIMPLIFIED_500m/2015/level2')
  let allDistricts = admin2.filter(ee.Filter.eq('ADM0_NAME', 'Pakistan'))
  let trainingTable = ee.FeatureCollection(
    'projects/flood-analyzer-241964/assets/TrainingPointsV1'
  )
  let roads = ee.FeatureCollection(
    'projects/flood-analyzer-241964/assets/gis_osm_roads_free_1'
  )

  let districts

  let existingEntry = await FloodData.findOne({
    after_END: req.body.afterEndDate,
    after_START: req.body.afterStartDate,
  })

  if (!existingEntry) {
    districts = allDistricts
  } else {
    let namesArray = existingEntry.districts
      .filter((obj) => obj.results === null)
      .map((obj) => obj.name)

    let filter = ee.Filter.inList('ADM2_NAME', namesArray)

    districts = allDistricts.filter(filter)
  }

  let beforeStartTraining = '2022-01-01'
  let beforeEndTraining = '2022-04-08'

  let beforeStart = '2022-03-01'
  let beforeEnd = '2022-05-30'

  let beforeFloodSat2 = s2
    .filterDate(beforeStartTraining, beforeEndTraining)
    .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 5))
    .mean()

  let trainingPoints = trainingTable
  let trainingLabel = 'class'
  let trainingBands = [
    'B2',
    'B3',
    'B4',
    'B5',
    'B6',
    'B7',
    'B8',
    'B11',
    'B12',
    // 'WVP',
  ]
  let trainingInput = beforeFloodSat2.select(trainingBands)
  let trainImage = trainingInput.sampleRegions({
    collection: trainingPoints,
    properties: [trainingLabel],
    scale: 35,
  })
  let trainingData = trainImage.randomColumn()
  let trainingSet = trainingData.filter(ee.Filter.lessThan('random', 0.8))
  let testingSet = trainingData.filter(
    ee.Filter.greaterThanOrEquals('random', 0.8)
  )

  let classifier = ee.Classifier.smileCart().train(
    trainingSet,
    trainingLabel,
    trainingBands
  )

  let confusionMatrix = ee.ConfusionMatrix(
    testingSet.classify(classifier).errorMatrix({
      actual: 'class',
      predicted: 'classification',
    })
  )

  let accuracyMl = ee.ConfusionMatrix(confusionMatrix).accuracy()

  //MAP OVER DISTRICTS TO YEILD STATS FOR EACH
  const districtLandcoverGeneralFunction = function (district) {
    const classifiedLayer = beforeFloodSat2.classify(classifier)

    const urbanPixelsESA = ESAworldcover.first().updateMask(
      ESAworldcover.first().eq(50)
    )

    let urbanImageESA = urbanPixelsESA
      .select('Map')
      .divide(urbanPixelsESA.select('Map'))
      .rename('class')

    urbanImageESA = urbanImageESA.cast({
      class: 'uint8',
    })

    const completeClassifiedBefore = urbanImageESA.unmask(classifiedLayer)

    let floodPixels = getFloodPixels(
      ee.Feature(district).geometry(),
      beforeStart,
      beforeEnd,
      // afterStart,
      req.body.afterStartDate,
      req.body.afterEndDate,
      // afterEnd,
      s1
    )

    floodPixels = floodPixels
      .select('FloodWater')
      .divide(floodPixels.select('FloodWater'))
      .multiply(6)
      .rename('class')
    floodPixels = floodPixels.cast({
      class: 'uint8',
    })

    const completeClassifiedAfter = floodPixels.unmask(completeClassifiedBefore)

    //Statistical Analaysis
    const beforeFloodClassObj = ee.Dictionary({
      1: 'urban',
      2: 'normalWater',
      3: 'farmland',
      4: 'snowClouds',
      5: 'barren',
    })

    const districtArea = ee.Feature(district).area()

    const beforeFloodAreaImage = ee.Image.pixelArea().addBands(
      completeClassifiedBefore
    )

    let classAreasBefore = beforeFloodAreaImage
      .reduceRegion({
        reducer: ee.Reducer.sum().group({
          groupField: 1,
          groupName: 'class',
        }),
        geometry: ee.Feature(district).geometry(),
        scale: 30,
        maxPixels: 1e20,
        tileScale: 4,
      })
      .get('groups')

    classAreasBefore = ee.List(classAreasBefore)

    const classAreasListBefore = classAreasBefore
      .map(function (entry) {
        const areaObj = ee.Dictionary(entry)
        const classNumber = ee.Number(areaObj.get('class')).format()
        const areaPercentage = ee
          .Number(areaObj.get('sum'))
          .divide(districtArea)
          .multiply(100)
        return ee.List([beforeFloodClassObj.get(classNumber), areaPercentage])
      })
      .flatten()

    const beforeFloodAreaResult = ee.Dictionary(classAreasListBefore)

    const afterFloodClassObj = ee.Dictionary({
      1: 'urban',
      2: 'normaWater',
      3: 'farmland',
      4: 'snowClouds',
      5: 'barren',
      6: 'floodWater',
    })

    const afterFloodAreaImage = ee.Image.pixelArea().addBands(
      completeClassifiedAfter.clip(ee.Feature(district).geometry())
    )

    let classAreasAfter = afterFloodAreaImage
      .reduceRegion({
        reducer: ee.Reducer.sum().group({
          groupField: 1,
          groupName: 'class',
        }),
        geometry: ee.Feature(district).geometry(),
        scale: 30,
        maxPixels: 1e20,
        tileScale: 4,
      })
      .get('groups')

    classAreasAfter = ee.List(classAreasAfter)

    const classAreasListAfter = classAreasAfter
      .map(function (entry) {
        const areaObj = ee.Dictionary(entry)
        const classNumber = ee.Number(areaObj.get('class')).format()
        const areaPercentage = ee
          .Number(areaObj.get('sum'))
          .divide(districtArea)
          .multiply(100)
        return ee.List([afterFloodClassObj.get(classNumber), areaPercentage])
      })
      .flatten()

    const afterFloodAreaResult = ee.Dictionary(classAreasListAfter)

    let floodedRoads = floodPixels.clip(roads)

    let var1 = ee.Algorithms.If(
      ee.String(ee.Feature(district).get('ADM1_NAME')).equals('Balochistan'),
      ee.Number(1),
      ee.Number(0)
    )

    let var2 = ee.Algorithms.If(
      ee
        .String(ee.Feature(district).get('ADM2_NAME'))
        .equals('Nasirabad District'),
      ee.Number(0),
      ee.Number(1)
    )

    let var3 = ee.Number(var1).and(ee.Number(var2))

    let customConnectedPixelCount = ee.Algorithms.If(
      var3,
      ee.Number(15),
      ee.Number(100)
    )
    let connectedPixelsThreshold = ee.Algorithms.If(
      var3,
      ee.Number(8),
      ee.Number(50)
    )
    const connections = floodedRoads.connectedPixelCount(
      ee.Number(customConnectedPixelCount)
    )
    floodedRoads = floodedRoads.updateMask(
      connections.gt(ee.Number(connectedPixelsThreshold))
    )

    let scale = ee.Algorithms.If(
      ee.String(ee.Feature(district).get('ADM1_NAME')).equals('Balochistan'),
      ee.Number(100),
      ee.Number(80)
    )

    const floodedRoadVectors = floodedRoads.reduceToVectors({
      geometry: ee.Feature(district).geometry(),
      scale: 120,
      eightConnected: true,
      maxPixels: 1e10,
      tileScale: 1,
    })

    const floodedRoadArray = floodedRoadVectors.toList(1e5)

    const getCenters = function (feature) {
      return ee
        .Feature(feature)
        .centroid({ maxError: 1 })
        .geometry()
        .coordinates()
    }

    const floodedRoadsCentroids = floodedRoadArray.map(getCenters)

    return {
      name: ee.Feature(district).get('ADM2_NAME'),
      results: {
        total: districtArea,
        before: beforeFloodAreaResult,
        after: afterFloodAreaResult,
        roads: floodedRoadsCentroids,
      },
    }
  }

  districts.evaluate(async (districtsCollection) => {
    let nullWarningCounter = 0
    let completenessCounter = 0
    let temporaryHoldingArray = []
    if (
      districtsCollection &&
      districtsCollection.features &&
      districtsCollection.features.length
    ) {
      for (
        var index = 0;
        index < districtsCollection.features.length;
        index++
      ) {
        districtsArray = districts.toList(1, parseInt(index))
        districtsFloodData = districtsArray.map(
          districtLandcoverGeneralFunction
        )
        districtsFloodData.evaluate(async (resultsObj) => {
          completenessCounter++
          console.log(completenessCounter)

          if (resultsObj) {
            temporaryHoldingArray.push(resultsObj[0])
          } else {
            temporaryHoldingArray.push({
              name: districtsCollection.features[completenessCounter - 1]
                .properties['ADM2_NAME'],
              results: null,
            })

            nullWarningCounter++
          }

          if (completenessCounter == districtsCollection.features.length) {
            if (!JSON.parse(req.body.update)) {
              await FloodData.create({
                after_END: req.body.afterEndDate,
                after_START: req.body.afterStartDate,
                districts: temporaryHoldingArray,
              })
            } else {
              let existingDistricts = existingEntry.districts
              let newDistricts = temporaryHoldingArray

              let combinedDistricts = existingDistricts.map((district) => {
                const districtInNewDistricts = newDistricts.find(
                  (newDistrict) => newDistrict.name === district.name
                )
                return districtInNewDistricts || district
              })

              await FloodData.findOneAndUpdate(
                {
                  after_END: req.body.afterEndDate,
                  after_START: req.body.afterStartDate,
                },
                {
                  districts: combinedDistricts,
                }
              )
            }
            console.log(nullWarningCounter)

            if (req.body.cron && !res) {
              if (nullWarningCounter) {
                req.body.update = true
                landClassificationDataGenerator(req, res)
              } else {
                console.log('Db update complete')
                return
              }
            } else {
              res.json({
                message: `Request fulfilled with ${nullWarningCounter} null responses`,
                nullCounts: nullWarningCounter,
              })
            }
          }
        })
      }
    } else {
      if (res) {
        res.status(500)
        res.send('Internal Server Error')
      }
    }
  })
})

// @desc    Check for any null/undefined entries in flood-data resource
// @route   GET /api/flood-data/check-null
// @access  Private
const checkNullEntries = asyncHandler(async (req, res) => {
  let nullEntriesArray = []

  const allEntries = await FloodData.find()

  allEntries.map((innerObject) => {
    let nullCounter = 0
    innerObject.districts.map((entry) => {
      if (entry === null) nullCounter++
    })
    if (nullCounter > 0) {
      nullEntriesArray.push([innerObject.after_START, innerObject.after_END])
    }
  })

  res.send(nullEntriesArray)
})

// @desc    Delete selected flood data entry based on after_START
// @route   DELETE /api/flood-data/delete/:after_START
// @access  Private
const deleteSpecificFloodData = asyncHandler(async (req, res) => {
  try {
    const deletedItem = await FloodData.findOneAndRemove({
      after_START: req.params.afterStartDate,
    })
    if (!deletedItem) {
      return res.status(404).send('Item not found')
    }
    res.json({
      entry: deletedItem,
      message: 'Successfully deleted this entry.',
    })
  } catch (error) {
    res.status(500).send('Error deleting the item')
  }
})

// @desc    Delete all flood data entries
// @route   DELETE /api/flood-data/delete
// @access  Private
const deleteAllFloodData = asyncHandler(async (req, res) => {
  await FloodData.deleteMany()

  res.json({
    message: 'Successfully deleted all floodData',
  })
})

module.exports = {
  updateDbFunction,
  getPreviousMonthDates,
  getMapID,
  getAllFloodData,
  landClassificationDataGenerator,
  checkNullEntries,
  deleteSpecificFloodData,
  deleteAllFloodData,
}

// @desc    General function to calculate flood pixels for a given region within a given time frame
// @route   N/A - Native function
// @access  N/A
const getFloodPixels = (geometry, dateBS, dateBE, dateAS, dateAE, satData) => {
  const filteredSatData = satData
    .filter(ee.Filter.eq('instrumentMode', 'IW'))
    .filter(ee.Filter.listContains('transmitterReceiverPolarisation', 'VH'))
    .filter(ee.Filter.eq('orbitProperties_pass', 'ASCENDING'))
    .filter(ee.Filter.eq('resolution_meters', 10))
    .filter(ee.Filter.bounds(geometry))
    .select(['VH'])

  const beforeFloodCollection = filteredSatData.filter(
    ee.Filter.date(dateBS, dateBE)
  )
  const afterFloodCollection = filteredSatData.filter(
    ee.Filter.date(dateAS, dateAE)
  )

  const beforeImage = beforeFloodCollection.mosaic().clip(geometry)
  const afterImage = afterFloodCollection.mosaic().clip(geometry)

  const beforeImageSmooth = toDB(RefinedLee(toNatural(beforeImage)))
  const afterImageSmooth = toDB(RefinedLee(toNatural(afterImage)))

  const differencePixels = afterImageSmooth.divide(beforeImageSmooth)
  const diffThreshold = 1.25
  const floodedPixels = differencePixels
    .gt(diffThreshold)
    .rename('FloodWater')
    .selfMask()

  return floodedPixels
}

// @desc    Function to convert image from dB to natural
// @route   N/A - Native function
// @access  N/A
const toNatural = (img) => {
  return ee.Image(10.0).pow(img.select(0).divide(10.0))
}

// @desc    Function to convert image from natural to dB
// @route   N/A - Native function
// @access  N/A
const toDB = (img) => {
  return ee.Image(img).log10().multiply(10.0)
}

// @desc    Apllying a Refined Lee Speckle filter as coded in the SNAP 3.0 S1TBX
// @route   N/A - Native function
// @access  N/A

//https://github.com/senbox-org/s1tbx/blob/master/s1tbx-op-sar-processing/src/main/java/org/esa/s1tbx/sar/gpf/filtering/SpeckleFilters/RefinedLee.java
//Adapted by Guido Lemoine
const RefinedLee = (img) => {
  // img must be in natural units, i.e. not in dB!
  // Set up 3x3 kernels
  var weights3 = ee.List.repeat(ee.List.repeat(1, 3), 3)
  var kernel3 = ee.Kernel.fixed(3, 3, weights3, 1, 1, false)

  var mean3 = img.reduceNeighborhood(ee.Reducer.mean(), kernel3)
  var variance3 = img.reduceNeighborhood(ee.Reducer.variance(), kernel3)

  // Use a sample of the 3x3 windows inside a 7x7 windows to determine gradients and directions
  var sample_weights = ee.List([
    [0, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 1, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 1, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 1, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 0],
  ])

  var sample_kernel = ee.Kernel.fixed(7, 7, sample_weights, 3, 3, false)

  // Calculate mean and variance for the sampled windows and store as 9 bands
  var sample_mean = mean3.neighborhoodToBands(sample_kernel)
  var sample_var = variance3.neighborhoodToBands(sample_kernel)

  // Determine the 4 gradients for the sampled windows
  var gradients = sample_mean.select(1).subtract(sample_mean.select(7)).abs()
  gradients = gradients.addBands(
    sample_mean.select(6).subtract(sample_mean.select(2)).abs()
  )
  gradients = gradients.addBands(
    sample_mean.select(3).subtract(sample_mean.select(5)).abs()
  )
  gradients = gradients.addBands(
    sample_mean.select(0).subtract(sample_mean.select(8)).abs()
  )

  // And find the maximum gradient amongst gradient bands
  var max_gradient = gradients.reduce(ee.Reducer.max())

  // Create a mask for band pixels that are the maximum gradient
  var gradmask = gradients.eq(max_gradient)

  // duplicate gradmask bands: each gradient represents 2 directions
  gradmask = gradmask.addBands(gradmask)

  // Determine the 8 directions
  var directions = sample_mean
    .select(1)
    .subtract(sample_mean.select(4))
    .gt(sample_mean.select(4).subtract(sample_mean.select(7)))
    .multiply(1)
  directions = directions.addBands(
    sample_mean
      .select(6)
      .subtract(sample_mean.select(4))
      .gt(sample_mean.select(4).subtract(sample_mean.select(2)))
      .multiply(2)
  )
  directions = directions.addBands(
    sample_mean
      .select(3)
      .subtract(sample_mean.select(4))
      .gt(sample_mean.select(4).subtract(sample_mean.select(5)))
      .multiply(3)
  )
  directions = directions.addBands(
    sample_mean
      .select(0)
      .subtract(sample_mean.select(4))
      .gt(sample_mean.select(4).subtract(sample_mean.select(8)))
      .multiply(4)
  )
  // The next 4 are the not() of the previous 4
  directions = directions.addBands(directions.select(0).not().multiply(5))
  directions = directions.addBands(directions.select(1).not().multiply(6))
  directions = directions.addBands(directions.select(2).not().multiply(7))
  directions = directions.addBands(directions.select(3).not().multiply(8))

  // Mask all values that are not 1-8
  directions = directions.updateMask(gradmask)

  // "collapse" the stack into a singe band image (due to masking, each pixel has just one value (1-8) in it's directional band, and is otherwise masked)
  directions = directions.reduce(ee.Reducer.sum())

  //var pal = ['ffffff','ff0000','ffff00', '00ff00', '00ffff', '0000ff', 'ff00ff', '000000'];
  //Map.addLayer(directions.reduce(ee.Reducer.sum()), {min:1, max:8, palette: pal}, 'Directions', false);

  var sample_stats = sample_var.divide(sample_mean.multiply(sample_mean))

  // Calculate localNoiseVariance
  var sigmaV = sample_stats
    .toArray()
    .arraySort()
    .arraySlice(0, 0, 5)
    .arrayReduce(ee.Reducer.mean(), [0])

  // Set up the 7*7 kernels for directional statistics
  var rect_weights = ee.List.repeat(ee.List.repeat(0, 7), 3).cat(
    ee.List.repeat(ee.List.repeat(1, 7), 4)
  )

  var diag_weights = ee.List([
    [1, 0, 0, 0, 0, 0, 0],
    [1, 1, 0, 0, 0, 0, 0],
    [1, 1, 1, 0, 0, 0, 0],
    [1, 1, 1, 1, 0, 0, 0],
    [1, 1, 1, 1, 1, 0, 0],
    [1, 1, 1, 1, 1, 1, 0],
    [1, 1, 1, 1, 1, 1, 1],
  ])

  var rect_kernel = ee.Kernel.fixed(7, 7, rect_weights, 3, 3, false)
  var diag_kernel = ee.Kernel.fixed(7, 7, diag_weights, 3, 3, false)

  // Create stacks for mean and variance using the original kernels. Mask with relevant direction.
  var dir_mean = img
    .reduceNeighborhood(ee.Reducer.mean(), rect_kernel)
    .updateMask(directions.eq(1))
  var dir_var = img
    .reduceNeighborhood(ee.Reducer.variance(), rect_kernel)
    .updateMask(directions.eq(1))

  dir_mean = dir_mean.addBands(
    img
      .reduceNeighborhood(ee.Reducer.mean(), diag_kernel)
      .updateMask(directions.eq(2))
  )
  dir_var = dir_var.addBands(
    img
      .reduceNeighborhood(ee.Reducer.variance(), diag_kernel)
      .updateMask(directions.eq(2))
  )

  // and add the bands for rotated kernels
  for (var i = 1; i < 4; i++) {
    dir_mean = dir_mean.addBands(
      img
        .reduceNeighborhood(ee.Reducer.mean(), rect_kernel.rotate(i))
        .updateMask(directions.eq(2 * i + 1))
    )
    dir_var = dir_var.addBands(
      img
        .reduceNeighborhood(ee.Reducer.variance(), rect_kernel.rotate(i))
        .updateMask(directions.eq(2 * i + 1))
    )
    dir_mean = dir_mean.addBands(
      img
        .reduceNeighborhood(ee.Reducer.mean(), diag_kernel.rotate(i))
        .updateMask(directions.eq(2 * i + 2))
    )
    dir_var = dir_var.addBands(
      img
        .reduceNeighborhood(ee.Reducer.variance(), diag_kernel.rotate(i))
        .updateMask(directions.eq(2 * i + 2))
    )
  }

  // "collapse" the stack into a single band image (due to masking, each pixel has just one value in it's directional band, and is otherwise masked)
  dir_mean = dir_mean.reduce(ee.Reducer.sum())
  dir_var = dir_var.reduce(ee.Reducer.sum())

  // A finally generate the filtered value
  var varX = dir_var
    .subtract(dir_mean.multiply(dir_mean).multiply(sigmaV))
    .divide(sigmaV.add(1.0))

  var b = varX.divide(dir_var)

  var result = dir_mean.add(b.multiply(img.subtract(dir_mean)))
  return result.arrayFlatten([['sum']])
}
