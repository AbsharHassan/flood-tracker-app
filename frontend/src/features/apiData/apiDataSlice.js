import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import apiDataService from './apiDataService'

import { districtNames } from '../../MapModification/districtNames'
import { geoFormattedPolygons } from '../../MapModification/geoFormattedPolygon'
import dayjs from 'dayjs'

const initialState = {
  isLoadingMainData: true,
  isLoadingTotalFlooded: true,
  geoFormattedPolygons,
  districtNames,
  selectedFloodData: null,
  prevPeriodFloodData: null,
  globalSelectedDistrict: null,
  prevPeriodGlobalSelectedDistrict: null,
  globalSelectedGeometry: null,
  selectedDate: '2022-03-01',
  defaultDateValue: '2022-08-01',
  totalFloodedArray: [],
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

// Get an array containing total flooded percentages
export const getTotalFloodedArray = createAsyncThunk(
  'apiData/getTotalFloodedArray',
  async (thunkAPI) => {
    try {
      return await apiDataService.getTotalFloodedArray()
    } catch (error) {
      const errorMessage = 'API failed to respond with array of totalFlooded'
      return thunkAPI.rejectWithValue(errorMessage)
    }
  }
)

export const apiDataSlice = createSlice({
  name: 'apiData',
  initialState,
  reducers: {
    selectDistrict: (state, { payload }) => {
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
  },
  extraReducers: (builder) => {
    builder
      // getFloodData
      .addCase(getFloodData.pending, (state) => {
        state.isLoadingMainData = true
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

        state.isLoadingMainData = false
      })
      .addCase(getFloodData.rejected, (state, { payload }) => {
        state.selectedFloodData = {}
        state.prevPeriodFloodData = {}
        state.isLoadingMainData = false
        console.log(payload)
      })

      // GetTotalFloodedArray
      .addCase(getTotalFloodedArray.pending, (state) => {
        state.isLoadingTotalFlooded = true
      })
      .addCase(getTotalFloodedArray.fulfilled, (state, { payload }) => {
        state.totalFloodedArray = payload
        state.isLoadingTotalFlooded = false
      })
      .addCase(getTotalFloodedArray.rejected, (state, { payload }) => {
        state.totalFloodedArray = []
        state.isLoadingTotalFlooded = false

        console.log(payload)
      })
  },
})

export default apiDataSlice.reducer

export const { selectDistrict, setSelectedPeriod } = apiDataSlice.actions
