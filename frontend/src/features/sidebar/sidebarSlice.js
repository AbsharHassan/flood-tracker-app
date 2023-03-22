import { createSlice } from '@reduxjs/toolkit'

const darkMode = sessionStorage.getItem('darkMode')
  ? JSON.parse(sessionStorage.getItem('darkMode'))
  : true

export const sidebarSlice = createSlice({
  name: 'sidebar',
  initialState: {
    sidebarIsOpen: window.innerWidth > 1024 ? true : false,
    isScreenLg: window.innerWidth > 1024 ? true : false,
    isDarkMode: darkMode,
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
    toggleDarkMode: (state) => {
      sessionStorage.setItem('darkMode', !state.isDarkMode)
      state.isDarkMode = !state.isDarkMode
    },
  },
})

export const {
  openSidebar,
  closeSidebar,
  toggleSidebar,
  toggleIsScreenLg,
  toggleDarkMode,
} = sidebarSlice.actions

export default sidebarSlice.reducer
