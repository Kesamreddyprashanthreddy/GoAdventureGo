import express from 'express'
import { body, validationResult } from 'express-validator'
import User from '../models/User.js'
import { protect } from '../middleware/auth.js'
import { asyncHandler } from '../middleware/errorHandler.js'
const router = express.Router()
const getCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: parseInt(process.env.JWT_COOKIE_EXPIRE) * 24 * 60 * 60 * 1000 // Convert days to milliseconds
})
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.generateAuthToken()
  const refreshToken = user.generateRefreshToken()
  user.save({ validateBeforeSave: false })
  const cookieOptions = getCookieOptions()
  res.status(statusCode)
    .cookie('authToken', token, cookieOptions)
    .cookie('refreshToken', refreshToken, {
      ...cookieOptions,
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    })
    .json({
      success: true,
      message: statusCode === 201 ? 'User registered successfully' : 'Login successful',
      data: {
        token,
        refreshToken,
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          isEmailVerified: user.isEmailVerified,
          preferences: user.preferences,
          createdAt: user.createdAt
        }
      }
    })
}
export const register = asyncHandler(async (req, res) => {
  await body('firstName')
    .notEmpty()
    .withMessage('First name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters')
    .run(req)
  await body('lastName')
    .notEmpty()
    .withMessage('Last name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters')
    .run(req)
  await body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail()
    .run(req)
  await body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number')
    .run(req)
  await body('phoneNumber')
    .optional()
    .matches(/^[\+]?[1-9][\d]{0,15}$/)
    .withMessage('Please provide a valid phone number')
    .run(req)
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    })
  }
  const { firstName, lastName, email, password, phoneNumber } = req.body
  const existingUser = await User.findOne({ email })
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: 'User already exists with this email'
    })
  }
  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
    phoneNumber
  })
  sendTokenResponse(user, 201, res)
})
export const login = asyncHandler(async (req, res) => {
  console.log('🔐 Login attempt:', { email: req.body.email, hasPassword: !!req.body.password })
  await body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail()
    .run(req)
  await body('password')
    .notEmpty()
    .withMessage('Password is required')
    .run(req)
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    console.log('❌ Validation errors:', errors.array())
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    })
  }
  const { email, password } = req.body
  try {
    console.log('🔍 Looking up user:', email)
    const user = await User.findByCredentials(email, password)
    console.log('✅ User found, sending token response')
    sendTokenResponse(user, 200, res)
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message
    })
  }
})
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .populate('bookings')
    .select('-password')
  res.status(200).json({
    success: true,
    data: user
  })
})
export const updateProfile = asyncHandler(async (req, res) => {
  await body('firstName')
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters')
    .run(req)
  await body('lastName')
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters')
    .run(req)
  await body('phoneNumber')
    .optional()
    .matches(/^[\+]?[1-9][\d]{0,15}$/)
    .withMessage('Please provide a valid phone number')
    .run(req)
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    })
  }
  const fieldsToUpdate = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    phoneNumber: req.body.phoneNumber,
    dateOfBirth: req.body.dateOfBirth,
    address: req.body.address,
    preferences: req.body.preferences
  }
  Object.keys(fieldsToUpdate).forEach(key => 
    fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
  )
  const user = await User.findByIdAndUpdate(req.user._id, fieldsToUpdate, {
    new: true,
    runValidators: true
  }).select('-password')
  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: user
  })
})
export const updatePassword = asyncHandler(async (req, res) => {
  await body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required')
    .run(req)
  await body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('New password must contain at least one lowercase letter, one uppercase letter, and one number')
    .run(req)
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    })
  }
  const { currentPassword, newPassword } = req.body
  const user = await User.findById(req.user._id).select('+password')
  const isCurrentPasswordCorrect = await user.comparePassword(currentPassword)
  if (!isCurrentPasswordCorrect) {
    return res.status(400).json({
      success: false,
      message: 'Current password is incorrect'
    })
  }
  user.password = newPassword
  await user.save()
  sendTokenResponse(user, 200, res)
})
export const logout = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
  user.refreshTokens = []
  await user.save()
  res.cookie('authToken', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  })
  res.cookie('refreshToken', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  })
  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  })
})
export const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.cookies
  if (!refreshToken) {
    return res.status(401).json({
      success: false,
      message: 'Refresh token not found'
    })
  }
  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET + 'refresh')
    const user = await User.findById(decoded.userId)
    if (!user || !user.refreshTokens.some(token => token.token === refreshToken)) {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token'
      })
    }
    const newToken = user.generateAuthToken()
    const newRefreshToken = user.generateRefreshToken()
    user.refreshTokens = user.refreshTokens.filter(token => token.token !== refreshToken)
    await user.save()
    const cookieOptions = getCookieOptions()
    res.cookie('authToken', newToken, cookieOptions)
      .cookie('refreshToken', newRefreshToken, {
        ...cookieOptions,
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
      })
      .json({
        success: true,
        message: 'Token refreshed successfully',
        data: {
          token: newToken,
          refreshToken: newRefreshToken
        }
      })
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid refresh token'
    })
  }
})
router.post('/register', register)
router.post('/login', login)
router.get('/me', protect, getMe)
router.put('/profile', protect, updateProfile)
router.put('/password', protect, updatePassword)
router.post('/logout', protect, logout)
router.post('/refresh', refreshToken)
export default router
