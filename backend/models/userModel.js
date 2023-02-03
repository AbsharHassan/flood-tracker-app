const mongoose = require('mongoose')

const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Please enter an email'],
      unique: [true, 'This email is already taken'],
    },
    password: {
      type: String,
      required: [true, 'Please set a password'],
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('User', userSchema)
