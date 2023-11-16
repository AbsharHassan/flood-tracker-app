import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './app/store'
import { BrowserRouter as Router } from 'react-router-dom'
import { disableReactDevTools } from '@fvilers/disable-react-devtools'
import App from './App'
import './index.css'

if (process.env.NODE_ENV === 'production') disableReactDevTools()

const root = createRoot(document.getElementById('root'))

root.render(
  <Router>
    <Provider store={store}>
      <App />
    </Provider>
  </Router>
)
