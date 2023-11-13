const mongoose = require('mongoose')

const floodDataSchema = mongoose.Schema(
  {
    after_START: {
      type: String,
      unique: true,
    },
    after_END: {
      type: String,
      unique: true,
    },
    districts: { type: [Object] },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('FloodData', floodDataSchema)
