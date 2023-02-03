import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import sidebarReducer from '../features/sidebar/sidebarSlice'
import districtReducer from '../features/apiData/apiDataSlice'
import mapReducer from '../features/map/mapSlice'
import authReducer from '../features/auth/authSlice'

export const store = configureStore({
  reducer: {
    apiData: districtReducer,
    map: mapReducer,
    sidebar: sidebarReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }),

  devTools: process.env.NODE_ENV === 'production' ? false : true,
})
