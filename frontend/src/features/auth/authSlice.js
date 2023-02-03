import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import authService from './authService'

const user = JSON.parse(sessionStorage.getItem('user'))
const registerAllowed = JSON.parse(sessionStorage.getItem('registerAllowed'))
const isLoggedIn = JSON.parse(sessionStorage.getItem('isLoggedIn'))

const initialState = {
  isLoggedIn: isLoggedIn ? true : false,
  user: user ? user : null,
  isAdminLoading: true,
  isAuthLoading: false,
  registerAllowed: registerAllowed || false,
  isAuthSuccess: false,
  isAuthError: false,
  isAuthRefresh: false,
  isAuthRefreshError: false,
  authRefreshError: false,
  authMessage: '',
  accessToken: null,
}

export const checkAdmin = createAsyncThunk(
  'auth/checkAdmin',
  async (args, thunkAPI) => {
    try {
      return await authService.checkAdmin()
    } catch (error) {
      console.log(error)
    }
  }
)

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (formData, thunkAPI) => {
    try {
      return await authService.registerUser(formData)
    } catch (error) {
      if (error.response.status === 422) {
        return thunkAPI.rejectWithValue(error.response.data.message)
      }
    }
  }
)

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (formData, thunkAPI) => {
    try {
      return await authService.loginUser(formData)
    } catch (error) {
      if (error.response.status === 422 || error.response.status === 401) {
        return thunkAPI.rejectWithValue(error.response.data.message)
      }
    }
  }
)

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (args, thunkAPI) => {
    try {
      return await authService.logoutUser()
    } catch (error) {
      console.log(error)
    }
  }
)

export const deleteUser = createAsyncThunk(
  'auth/deleteUser',
  async (formData, thunkAPI) => {
    try {
      const accessToken = thunkAPI.getState().auth.accessToken
      return await authService.deleteUser(formData, accessToken)
    } catch (error) {
      if (error.response.status === 422 || error.response.status === 401) {
        return thunkAPI.rejectWithValue(error.response.data.message)
      }
    }
  }
)

export const refresh = createAsyncThunk(
  'auth/refresh',
  async (args, thunkAPI) => {
    try {
      return await authService.refresh()
    } catch (error) {
      console.log(error)
    }
  }
)

export const persistLogin = createAsyncThunk(
  'auth/persistLogin',
  async (args, thunkAPI) => {
    try {
      // const isLoggedIn = thunkAPI.getState().auth.isLoggedIn
      const user = thunkAPI.getState().auth.user

      // console.log(user)

      if (user) {
        return await authService.refresh()
      } else {
        return thunkAPI.rejectWithValue()
      }
    } catch (error) {
      return thunkAPI.rejectWithValue()
    }
  }
)

export const testFunc = createAsyncThunk(
  'auth/testFunc',
  async (formData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.accessToken
      return await authService.testFunc(token)
    } catch (error) {
      console.log(error)
    }
  }
)

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset: (state) => {
      state.isAuthLoading = false
      state.isAuthError = false
      state.authMessage = ''
      state.isAuthSuccess = false
    },
    toggleRegisterAllowed: (state, { payload }) => {
      state.registerAllowed = payload
      sessionStorage.setItem('registerAllowed', payload)
    },
    setAuthMessage: (state, { payload }) => {
      state.authMessage = payload
    },
    setAccessToken: (state, { payload }) => {
      state.accessToken = payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkAdmin.pending, (state) => {
        state.isAdminLoading = true
        // state.isAuthSuccess = false
      })
      .addCase(checkAdmin.fulfilled, (state, action) => {
        state.registerAllowed = !action.payload.exists
        sessionStorage.setItem('registerAllowed', !action.payload.exists)
        state.isAdminLoading = false
        // state.isAuthSuccess = true
      })
      .addCase(registerUser.pending, (state) => {
        state.isAuthLoading = true
        state.isAuthSuccess = false
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        const { _id, email } = action.payload
        state.user = { _id, email }
        state.accessToken = action.payload.accessToken
        state.isAuthLoading = false
        state.isAuthSuccess = true
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isAuthLoading = false
        state.isAuthError = true
        state.authMessage = action.payload
        state.user = null
      })
      .addCase(loginUser.pending, (state) => {
        state.isAuthLoading = true
        state.isAuthSuccess = false
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        const { _id, email } = action.payload
        state.user = { _id, email }
        state.accessToken = action.payload.accessToken
        state.isAuthLoading = false
        state.isAuthSuccess = true
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isAuthLoading = false
        state.isAuthError = true
        state.authMessage = action.payload
        state.user = null
      })
      .addCase(deleteUser.pending, (state) => {
        state.isAuthLoading = true
        state.isAuthSuccess = false
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.user = null
        state.registerAllowed = true
        sessionStorage.setItem('registerAllowed', true)
        state.isAuthLoading = false
        state.isAuthSuccess = true
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.isAuthLoading = false
        state.isAuthError = true
        state.authMessage = action.payload
      })
      .addCase(refresh.pending, (state) => {
        state.isAuthRefresh = true
      })
      .addCase(refresh.fulfilled, (state, action) => {
        console.log(action)
        state.accessToken = action.payload?.accessToken
        state.isAuthRefresh = false
      })
      .addCase(refresh.rejected, (state, action) => {
        state.isAuthRefresh = false
        state.isAuthRefreshError = true
        state.authRefreshError = action.payload
        // state.user = null
      })
      .addCase(persistLogin.pending, (state) => {
        state.isAuthRefresh = true
      })
      .addCase(persistLogin.fulfilled, (state, action) => {
        state.accessToken = action.payload?.accessToken
        state.isAuthRefresh = false
      })
      .addCase(persistLogin.rejected, (state, action) => {
        state.isAuthRefresh = false
        state.isAuthRefreshError = true
        state.authRefreshError = action.payload
        state.user = null
        sessionStorage.removeItem('user')
        sessionStorage.setItem('isLoggedIn', JSON.stringify(false))
      })
      .addCase(testFunc.fulfilled, (state, action) => {
        console.log(action.payload)
      })
      .addCase(logoutUser.pending, (state) => {
        state.isAuthLoading = true
        state.isAuthSuccess = false
      })
      .addCase(logoutUser.fulfilled, (state, action) => {
        state.user = null
        state.accessToken = null
        state.isLoggedIn = false
        state.isAuthLoading = false
        state.isAuthSuccess = true
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isAuthLoading = false
        state.isAuthError = true
        state.authMessage = action.payload
        console.log(action)
      })
  },
})

export const { reset, toggleRegisterAllowed, setAuthMessage, setAccessToken } =
  authSlice.actions

export default authSlice.reducer
