const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')

const protect = asyncHandler(async (req, res, next) => {
  let accessToken

  const authHeader = req.headers.authorization || req.headers.Authorization

  if (authHeader?.startsWith('Bearer')) {
    try {
      // Get accessToken from header
      accessToken = authHeader.split(' ')[1]

      // Verify accessToken
      const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)

      // Get user from the accessToken
      req.user = await User.findById(decoded.id).select('-password')

      next()
    } catch (error) {
      //console.log(error)
      res.status(401)
      throw new Error('Not authorized')
    }
  }

  if (!accessToken) {
    res.status(403)
    throw new Error('Not authorized, no accessToken')
  }
})

module.exports = { protect }
