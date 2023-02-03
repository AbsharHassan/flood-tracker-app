const express = require('express')
const path = require('path')
const colors = require('colors')
const dotenv = require('dotenv').config()
const { errorHandler } = require('./middleware/errorMiddleware')
const cors = require('cors')
const corsOptions = require('./config/corsOptions')
const cookieParser = require('cookie-parser')
const connectDB = require('./config/db')
const { urlencoded } = require('express')
const port = process.env.PORT

connectDB()

const app = express()

app.use(cors(corsOptions))
// app.use(cors())

app.use(cookieParser())
app.use(express.json())
app.use(urlencoded({ extended: false }))

// app.use(express.static('public'))

// app.get('*', (req, res) => {
//   // res.sendFile(path.join(__dirname, 'public', 'index.html'))
//   res.send()
// })

// app.use('/api', require('./routes/floodDataRoutes'))
app.use('/api', require('./routes/userRoutes'))
app.use('/api', require('./routes/earthEngineRoutes'))

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')))

  app.get('*', (req, res) =>
    res.sendFile(
      path.resolve(__dirname, '../', 'frontend', 'build', 'index.html')
    )
  )
} else {
  app.get('/', (req, res) => res.send('Please set to production'))
}

app.use(errorHandler)

// app.get('*', (req, res) => {
//   res.sendFile(path.resolve(__dirname, 'index.html'))
// })

app.listen(port, () =>
  console.log(`Server started. Listening on port ${port}.`.bgGreen)
)
