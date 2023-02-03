const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')

// GET GOOGLE MAPS API KEY
const getApiKey = (req, res) => {
  res.send(process.env.GMAPS_API_KEY)
}

const userExists = asyncHandler(async (req, res) => {
  const user = await User.findOne()

  if (user) {
    res.json({
      exists: true,
    })
  } else {
    res.json({
      exists: false,
    })
  }

  return user
})

const registerUser = asyncHandler(async (req, res) => {
  //Check if admin already exists
  const admin = await User.findOne()

  if (!admin) {
    // Check if body data exits
    if (!req.body.email || !req.body.password || !req.body.passwordConfirm) {
      res.status(422)
      throw new Error('Please add all fields.')
    }

    // Compare passwords
    if (req.body.password !== req.body.passwordConfirm) {
      res.status(422)
      throw new Error('Passwords do not match.')
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password, salt)

    // Create user
    const user = await User.create({
      email: req.body.email,
      password: hashedPassword,
    })

    // Respond
    if (user) {
      const { accessToken, refreshToken } = generateTokens(user._id)

      res.cookie('jwt', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        maxAge: 24 * 60 * 60 * 1000,
      })

      res.status(201).json({
        _id: user._id,
        email: user.email,
        accessToken,
      })
    } else {
      res.status(400)
      throw new Error('Invalid user data.')
    }
  } else {
    res.status(401).json({
      message: 'An admin already exits.',
    })
  }
})

const loginUser = asyncHandler(async (req, res) => {
  // Check if body data exits
  if (!req.body.email || !req.body.password) {
    res.status(422)
    throw new Error('Please add all fields.')
  }

  // Authenticate email and password
  const user = await User.findOne({ email: req.body.email })

  if (user && (await bcrypt.compare(req.body.password, user.password))) {
    const { accessToken, refreshToken } = generateTokens(user._id)

    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
      maxAge: 24 * 60 * 60 * 1000,
    })

    res.json({
      _id: user._id,
      email: user.email,
      accessToken,
    })
  } else {
    res.status(401).json({
      // success: false,
      message: 'Invalid credentials.',
    })
  }
})

// Check refreshToken and return new accessToken
const refresh = (req, res) => {
  console.log('a call was made to the refresh endpoint')
  const cookies = req.cookies
  console.log(cookies)

  if (cookies?.jwt) {
    const refreshToken = cookies.jwt

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      asyncHandler(async (err, decoded) => {
        if (err) {
          res.status(403)
          throw new Error('Forbidden')
        } else {
          const user = await User.findById(decoded.id)

          if (user) {
            const accessToken = generateAccessToken(user._id)
            res.json({ accessToken })
          } else {
            res.status(401)
            throw new Error('Not authorized')
          }
        }
      })
    )
  } else {
    res.status(401)
    throw new Error('Not authorized')
  }
}

const logoutUser = (req, res) => {
  const cookies = req.cookies
  console.log(cookies)

  if (cookies?.jwt) {
    res.clearCookie('jwt', {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
      maxAge: 24 * 60 * 60 * 1000,
    })

    res.json({
      message: 'Logged out',
    })
  } else {
    res.status(204).json({
      message: 'Already logged out',
    })
  }
}

const deleteUser = asyncHandler(async (req, res) => {
  // Check if body data exits
  if (!req.body.email || !req.body.password) {
    res.status(422)
    throw new Error('Please add all relevant information.')
  }

  // Authenticate email and password
  const user = await User.findOne({ email: req.body.email })

  if (user && (await bcrypt.compare(req.body.password, user.password))) {
    await User.deleteOne({ email: req.body.email })
    res.json({
      success: true,
      message: 'User has been deleted.',
    })
  } else {
    res.status(401).json({
      success: false,
      message: 'Invalid credentials/password.',
    })
  }
})

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  })
}

// Generate Access and Refresh Tokens
const generateTokens = (id) => {
  const accessToken = jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '20m',
  })

  const refreshToken = jwt.sign({ id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: '1d',
  })

  return {
    accessToken,
    refreshToken,
  }
}

// Generate only accessToken
const generateAccessToken = (id) => {
  return jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '20m',
  })
}

const randomTest = (req, res) => {
  res.json({
    message: 'hello world',
  })
}

module.exports = {
  userExists,
  registerUser,
  loginUser,
  refresh,
  logoutUser,
  deleteUser,
  randomTest,
  getApiKey,
}
