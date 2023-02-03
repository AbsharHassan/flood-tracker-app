const allowedOrgins = require('./allowedOrigins')

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrgins.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(
        // console.log('failed')
        new Error('Not allowed by CORS')
      )
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
}

module.exports = corsOptions
