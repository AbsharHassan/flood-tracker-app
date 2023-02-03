const express = require('express')
const router = express.Router()
const {
  userExists,
  registerUser,
  loginUser,
  refresh,
  logoutUser,
  deleteUser,
  randomTest,
  getApiKey,
} = require('../controllers/userController')
const { protect } = require('../middleware/authMiddleware')

// GET Google Maps API key
router.post('/key', getApiKey)

router.get('/check-user', userExists)
router.post('/create-user', registerUser)
router.post('/login', loginUser)
router.get('/refresh', refresh)
router.post('/logout', logoutUser)
router.delete('/delete-user', protect, deleteUser)

router.get('/test', protect, randomTest)

module.exports = router
