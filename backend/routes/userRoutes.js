const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/authMiddleware')
const {
  getApiKey,
  userExists,
  registerUser,
  loginUser,
  refresh,
  logoutUser,
  deleteUser,
} = require('../controllers/userController')

// GET Google Maps API key (POST FOR SECURITY)
router.post('/key', getApiKey)

// Check if admin exists
router.get('/check-user', userExists)

// Create a new admin
router.post('/create-user', registerUser)

// Login admin in
router.post('/login', loginUser)

// Send client a new access token if refresh token valid
router.get('/refresh', refresh)

// Log admin out
router.post('/logout', logoutUser)

// Delete admin
router.delete('/delete-user', protect, deleteUser)

module.exports = router
