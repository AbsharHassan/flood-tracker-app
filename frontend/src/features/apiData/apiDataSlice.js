import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import apiDataService from './apiDataService'

import { districtNames } from '../../MapModification/districtNames'
import { geoFormattedPolygons } from '../../MapModification/geoFormattedPolygon'
import dayjs from 'dayjs'

const initialState = {
  isLoadingPolygons: true,
  isFetchingApiData: true,
  geoFormattedPolygons: geoFormattedPolygons,
  districtNames: districtNames,
  // selectedPeriod: 8,
  completeFloodData: [],
  selectedFloodData: null,
  prevPeriodFloodData: null,
  globalSelectedDistrictName: null,
  globalSelectedDistrict: null,
  prevPeriodGlobalSelectedDistrict: null,
  globalSelectedGeometry: null,
  tryAgain: false,
  selectedDate: '2022-03-01',
  defaultDateValue: '2022-03-01',
}

// Prepare API flood data for Google Maps API
const formatFloodData = (data) => {
  const singlePeriodProcessor = (periodObj) => {
    const totalArea = periodObj.districts.reduce((sum, curObj) => {
      return sum + curObj.results.total
    }, 0)

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

const singlePeriodProcessor = (periodObj) => {
  const totalArea = periodObj.districts.reduce((sum, curObj) => {
    return sum + curObj.results.total
  }, 0)

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
    after_START: periodObj.after_START,
    after_END: periodObj.after_END,
  }
}

// Get districts' flood data
export const getFloodData = createAsyncThunk(
  'apiData/getFloodData',
  async (date, thunkAPI) => {
    try {
      return await apiDataService.getFloodData(date)
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
        ? state.selectedFloodData.resultsArray.find(
            (floodObj) => floodObj.name === payload
          )
        : null

      state.prevPeriodGlobalSelectedDistrict = payload
        ? state.prevPeriodFloodData.resultsArray.find(
            (floodObj) => floodObj.name === payload
          )
        : null

      state.globalSelectedGeometry = payload
        ? state.geoFormattedPolygons.find(
            (geoObject) => geoObject.name === payload
          )
        : null
    },
    // delete this and other unnceccesarry code

    setSelectedPeriod: (state, { payload }) => {
      console.log('set selected PERIOD called')
      // state.selectedPeriod = payload
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
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFloodData.pending, (state) => {
        state.isFetchingApiData = true
        // state.tryAgain = false
      })
      .addCase(getFloodData.fulfilled, (state, { payload }) => {
        state.selectedDate = dayjs(payload.current.after_START).format(
          'MMM YYYY'
        )
        state.selectedFloodData = payload.current
        state.selectedFloodData.resultsArray = state.selectedFloodData.districts
        // delete state.selectedFloodData.districts

        state.prevPeriodFloodData = payload.prev
        state.prevPeriodFloodData.resultsArray =
          state.prevPeriodFloodData.districts
        // delete state.prevPeriodFloodData.districts

        state.isFetchingApiData = false
      })
      .addCase(getFloodData.rejected, (state, { payload }) => {
        state.completeFloodData = []
        state.selectedFloodData = {}
        state.prevPeriodFloodData = {}
        // state.tryAgain = true
        console.log(payload)
      })
  },
})

export default apiDataSlice.reducer

export const { selectDistrict, setSelectedPeriod } = apiDataSlice.actions
