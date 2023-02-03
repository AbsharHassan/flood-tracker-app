import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import apiDataService from './apiDataService'

const initialState = {
  dataDate: '2022-08-30',
  isLoadingPolygons: true,
  isLoadingFloodData: true,
  isLoading: true,
  geoFormattedPolygons: null,
  districtNames: null,
  selectedPeriod: 7,
  completeFloodData: null,
  selectedFloodData: null,
  prevPeriodFloodData: null,
  globalSelectedDistrictName: null,
  globalSelectedDistrict: null,
  prevPeriodGlobalSelectedDistrict: null,
  globalSelectedGeometry: null,

  maxFlood: null,
  totalArea: null,
  totalFlooded: null,
  totalFarmlandAffected: null,
  totalUrbanAffected: null,
  totalRoadsAffected: null,
}

// Prepare API polygons for Google Maps API
const formatPolygonData = (data) => {
  if (data[0].districts.length) {
    const geoDataArray = data[0].districts.map((innerObject) => {
      if (innerObject.geometry.type === 'Polygon') {
        const coordinates = innerObject.geometry.coordinates[0].map(
          (coords) => {
            return { lat: coords[1], lng: coords[0] }
          }
        )
        const centerCoords = {
          lat: innerObject.center.coordinates[1],
          lng: innerObject.center.coordinates[0],
        }
        return {
          name: innerObject.district,
          center: centerCoords,
          coordinates: coordinates,
        }
      } else if (innerObject.geometry.type === 'MultiPolygon') {
        const coordinates = innerObject.geometry.coordinates[
          innerObject.geometry.coordinates.length - 1
        ][0].map((coords) => {
          return { lat: coords[1], lng: coords[0] }
        })
        const centerCoords = {
          lat: innerObject.center.coordinates[1],
          lng: innerObject.center.coordinates[0],
        }
        return {
          name: innerObject.district,
          center: centerCoords,
          coordinates: coordinates,
        }
      } else if (innerObject.geometry.type === 'GeometryCollection') {
        if (
          !(
            innerObject.geometry.geometries[
              innerObject.geometry.geometries.length - 1
            ].coordinates.length > 1
          )
        ) {
          const coordinates = innerObject.geometry.geometries[
            innerObject.geometry.geometries.length - 1
          ].coordinates[0].map((coords) => {
            return { lat: coords[1], lng: coords[0] }
          })
          const centerCoords = {
            lat: innerObject.center.coordinates[1],
            lng: innerObject.center.coordinates[0],
          }
          return {
            name: innerObject.district,
            center: centerCoords,
            coordinates: coordinates,
          }
        } else {
          const coordinates = innerObject.geometry.geometries[
            innerObject.geometry.geometries.length - 1
          ].coordinates[0].map((coords) => {
            return { lat: coords[1], lng: coords[0] }
          })
          const centerCoords = {
            lat: innerObject.center.coordinates[1],
            lng: innerObject.center.coordinates[0],
          }
          return {
            name: innerObject.district,
            center: centerCoords,
            coordinates: coordinates,
          }
        }
      }
    })

    const districtNames = data[0].districts.map((innerObject) => {
      // return innerObject.district.split(' District')[0]
      return innerObject.district
    })

    return {
      geoDataArray,
      districtNames,
    }
  }
}

// Prepare API flood data for Google Maps API

const formatFloodData = (data) => {
  const singlePeriodProcessor = (periodObj) => {
    const totalArea = periodObj.districts.reduce((sum, curObj) => {
      return sum + curObj.results.total
    }, 0)
    // console.log((totalArea / 1e6).toFixed(1))
    // console.log(totalArea)

    const intermediateArray = periodObj.districts.map((innerObject) => {
      const roadCoords = innerObject.results.roads.map((coords) => {
        return { lat: coords[1], lng: coords[0] }
      })
      innerObject.results.roads = roadCoords
      return {
        name: innerObject.name,
        results: innerObject.results,
        ratio: innerObject.results.total / totalArea,
      }
    })

    // const totalObject = intermediateArray.reduce(())

    let totalFlooded = 0
    let totalFarmlandAffected = 0
    let totalUrbanAffected = 0
    let totalRoadsAffected = 0

    for (let index = 0; index < intermediateArray.length; index++) {
      totalFlooded +=
        intermediateArray[index].results.after.floodWater *
        intermediateArray[index].ratio

      totalFarmlandAffected +=
        (intermediateArray[index].results.before.farmland -
          intermediateArray[index].results.after.farmland) *
        intermediateArray[index].ratio

      totalUrbanAffected +=
        (intermediateArray[index].results.before.urban -
          intermediateArray[index].results.after.urban) *
        intermediateArray[index].ratio

      totalRoadsAffected += intermediateArray[index].results.roads.length
    }

    const floodValuesArray = intermediateArray.map((district) => {
      return district.results.after.floodWater
        ? district.results.after.floodWater
        : 0
    })

    const maxFlood = Math.max(...floodValuesArray)

    return {
      resultsArray: intermediateArray,
      maxFlood,
      totalArea,
      totalFlooded,
      totalFarmlandAffected,
      totalUrbanAffected,
      totalRoadsAffected,
    }
  }

  const formattedData = data.map((periodObj, index) => {
    const results = singlePeriodProcessor(periodObj)

    return {
      results,
      after_START: periodObj.after_START,
      after_END: periodObj.after_END,
    }
  })

  return formattedData
}

// Get districts' polygon data
export const getPolygons = createAsyncThunk(
  'apiData/getPolygons',
  async (thunkAPI) => {
    try {
      return await apiDataService.getPolygons()
    } catch (error) {
      const errorMessage = 'Failed to get geometries'
      return thunkAPI.rejectWithValue(errorMessage)
    }
  }
)

// Get districts' flood data
export const getFloodData = createAsyncThunk(
  'apiData/getFloodData',
  async (date, thunkAPI) => {
    try {
      return await apiDataService.getFloodData()
    } catch (error) {
      const errorMessage = 'API failed to respond with flood data'
      return thunkAPI.rejectWithValue(errorMessage)
    }
  }
)

export const apiDataSlice = createSlice({
  name: 'apiData',
  initialState,
  reducers: {
    selectDistrict: (state, { payload }) => {
      state.globalSelectedDistrictName = payload
      state.globalSelectedDistrict = payload
        ? state.selectedFloodData.results.resultsArray.find(
            (floodObj) => floodObj.name === payload
          )
        : null

      state.prevPeriodGlobalSelectedDistrict = payload
        ? state.prevPeriodFloodData.results.resultsArray.find(
            (floodObj) => floodObj.name === payload
          )
        : null

      state.globalSelectedGeometry = payload
        ? state.geoFormattedPolygons.find(
            (geoObject) => geoObject.name === payload
          )
        : null
    },
    selectDate: (state, date) => {
      state.dataDate = date.payload
    },
    setSelectedPeriod: (state, { payload }) => {
      state.selectedPeriod = payload
      state.selectedFloodData = state.completeFloodData[payload]
      state.prevPeriodFloodData = state.completeFloodData[payload - 1]

      state.globalSelectedDistrict = state.globalSelectedDistrictName
        ? state.completeFloodData[payload].results.resultsArray.find(
            (floodObj) => floodObj.name === state.globalSelectedDistrictName
          )
        : null

      if (payload > 0) {
        state.prevPeriodGlobalSelectedDistrict =
          state.globalSelectedDistrictName
            ? state.completeFloodData[payload - 1].results.resultsArray.find(
                (floodObj) => floodObj.name === state.globalSelectedDistrictName
              )
            : null
      } else if (payload === 0) {
        state.prevPeriodGlobalSelectedDistrict =
          state.globalSelectedDistrictName
            ? state.completeFloodData[payload].results.resultsArray.find(
                (floodObj) => floodObj.name === state.globalSelectedDistrictName
              )
            : null
      }

      // state.prevPeriodGlobalSelectedDistrict =
      //   state.prevPeriodFloodData.results.resultsArray.find(
      //     (floodObj) => floodObj.name === payload
      //   )
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPolygons.pending, (state) => {
        state.isLoadingPolygons = true
      })
      .addCase(getPolygons.fulfilled, (state, { payload }) => {
        const formattedPolygonsData = payload.length
          ? formatPolygonData(payload)
          : null

        state.geoFormattedPolygons = payload.length
          ? formattedPolygonsData.geoDataArray
          : null

        state.districtNames = payload.length
          ? formattedPolygonsData.districtNames
          : null

        state.isLoadingPolygons = false
      })
      .addCase(getFloodData.pending, (state) => {
        state.isLoadingFloodData = true
      })
      .addCase(getFloodData.fulfilled, (state, { payload }) => {
        const formattedFloodData = formatFloodData(payload)
        state.completeFloodData = formattedFloodData
        state.selectedFloodData = formattedFloodData[state.selectedPeriod]
        state.prevPeriodFloodData = formattedFloodData[state.selectedPeriod - 1]
        // console.log(formattedFloodData)
        // state.floodData = formattedFloodData.resultsArray
        // state.maxFlood = formattedFloodData.maxFlood
        // state.totalArea = formattedFloodData.totalArea
        // state.totalFlooded = formattedFloodData.totalFlooded
        // state.totalFarmlandAffected = formattedFloodData.totalFarmlandAffected
        // state.totalUrbanAffected = formattedFloodData.totalUrbanAffected
        // state.totalRoadsAffected = formattedFloodData.totalRoadsAffected
        state.isLoadingFloodData = false
      })
  },
})

export default apiDataSlice.reducer

export const { selectDistrict, setSelectedPeriod } = apiDataSlice.actions
