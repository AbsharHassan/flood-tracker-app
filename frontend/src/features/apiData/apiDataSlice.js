import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import apiDataService from './apiDataService'

import { districtNames } from '../../MapModification/districtNames'
import { geoFormattedPolygons } from '../../MapModification/geoFormattedPolygon'

const initialState = {
  dataDate: '2022-08-30',
  isLoadingPolygons: true,
  isLoadingFloodData: true,
  isLoading: true,
  geoFormattedPolygons: geoFormattedPolygons,
  districtNames: districtNames,
  selectedPeriod: 8,
  completeFloodData: [],
  selectedFloodData: null,
  prevPeriodFloodData: null,
  globalSelectedDistrictName: null,
  globalSelectedDistrict: null,
  prevPeriodGlobalSelectedDistrict: null,
  globalSelectedGeometry: null,
  tryAgain: false,
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
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFloodData.pending, (state) => {
        state.isLoadingFloodData = true
        state.tryAgain = false
      })
      .addCase(getFloodData.fulfilled, (state, { payload }) => {
        console.log(payload)
        // const formattedFloodData = formatFloodData(payload)
        // state.completeFloodData = formattedFloodData
        // state.selectedFloodData = formattedFloodData[state.selectedPeriod]
        // state.prevPeriodFloodData = formattedFloodData[state.selectedPeriod - 1]

        // const test = singlePeriodProcessor(payload)

        // console.log(test)

        state.selectedFloodData = singlePeriodProcessor(payload.current)
        state.prevPeriodFloodData = singlePeriodProcessor(payload.prev)

        state.isLoadingFloodData = false
      })
    // .addCase(getFloodData.rejected, (state, { payload }) => {
    //   state.completeFloodData = []
    //   state.selectedFloodData = {}
    //   state.prevPeriodFloodData = {}
    //   state.tryAgain = true
    //   console.log(payload)
    // })
  },
})

export default apiDataSlice.reducer

export const { selectDistrict, setSelectedPeriod } = apiDataSlice.actions
