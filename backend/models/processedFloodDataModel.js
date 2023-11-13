const mongoose = require('mongoose')

const processedFloodDataSchema = mongoose.Schema(
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
    maxFlood: { type: Number },
    totalArea: { type: Number },
    totalFlooded: { type: Number },
    totalFarmlandAffected: { type: Number },
    totalRoadsAffected: { type: Number },
    totalUrbanAffected: { type: Number },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('ProcessedFloodData', processedFloodDataSchema)
