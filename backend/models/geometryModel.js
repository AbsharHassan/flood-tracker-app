const mongoose = require('mongoose')

const geometrySchema = mongoose.Schema(
  {
    districts: {
      type: [Object],
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('Geometry', geometrySchema)
