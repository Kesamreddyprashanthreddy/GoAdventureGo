import express from 'express'
import User from '../models/User.js'
import { protect, authorize } from '../middleware/auth.js'
import { asyncHandler } from '../middleware/errorHandler.js'
const router = express.Router()
export const getUsers = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 10
  const skip = (page - 1) * limit
  const users = await User.find()
    .select('-password -refreshTokens')
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 })
  const total = await User.countDocuments()
  res.status(200).json({
    success: true,
    data: users,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  })
})
export const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
    .populate('bookings')
    .select('-password -refreshTokens')
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    })
  }
  res.status(200).json({
    success: true,
    data: user
  })
})
export const updateUser = asyncHandler(async (req, res) => {
  const fieldsToUpdate = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    role: req.body.role,
    isEmailVerified: req.body.isEmailVerified
  }
  Object.keys(fieldsToUpdate).forEach(key => 
    fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
  )
  const user = await User.findByIdAndUpdate(req.params.id, fieldsToUpdate, {
    new: true,
    runValidators: true
  }).select('-password -refreshTokens')
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    })
  }
  res.status(200).json({
    success: true,
    message: 'User updated successfully',
    data: user
  })
})
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    })
  }
  await user.deleteOne()
  res.status(200).json({
    success: true,
    message: 'User deleted successfully'
  })
})
export const getUserStats = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments()
  const totalVerified = await User.countDocuments({ isEmailVerified: true })
  const totalAdmins = await User.countDocuments({ role: 'admin' })
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  const recentUsers = await User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } })
  const registrationTrend = await User.aggregate([
    {
      $match: {
        createdAt: { $gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) }
      }
    },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' }
        },
        count: { $sum: 1 }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } }
  ])
  res.status(200).json({
    success: true,
    data: {
      totalUsers,
      totalVerified,
      totalAdmins,
      recentUsers,
      verificationRate: totalUsers > 0 ? (totalVerified / totalUsers * 100).toFixed(2) : 0,
      registrationTrend
    }
  })
})
router.use(protect) // All routes below are protected
router.get('/stats', authorize('admin'), getUserStats)
router.route('/')
  .get(authorize('admin'), getUsers)
router.route('/:id')
  .get(authorize('admin'), getUser)
  .put(authorize('admin'), updateUser)
  .delete(authorize('admin'), deleteUser)
export default router
