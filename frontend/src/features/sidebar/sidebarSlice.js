import { createSlice } from '@reduxjs/toolkit'

export const sidebarSlice = createSlice({
  name: 'sidebar',
  initialState: {
    sidebarIsOpen: window.innerWidth > 1024 ? true : false,
    isScreenLg: window.innerWidth > 1024 ? true : false,
  },
  reducers: {
    openSidebar: (state) => {
      state.sidebarIsOpen = true
    },
    closeSidebar: (state) => {
      state.sidebarIsOpen = false
    },
    toggleSidebar: (state) => {
      state.sidebarIsOpen = !state.sidebarIsOpen
    },
    toggleIsScreenLg: (state, { payload }) => {
      state.isScreenLg = payload
    },
  },
})

export const { openSidebar, closeSidebar, toggleSidebar, toggleIsScreenLg } =
  sidebarSlice.actions

export default sidebarSlice.reducer
