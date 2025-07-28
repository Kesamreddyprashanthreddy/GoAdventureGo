import express from 'express'
import Booking from '../models/Booking.js'
import Package from '../models/Package.js'
import { protect, authorize } from '../middleware/auth.js'
import { asyncHandler } from '../middleware/errorHandler.js'
import { emailService } from '../services/emailService.js'
const router = express.Router()
export const createBooking = asyncHandler(async (req, res) => {
  const { packageId, travelers, travelDates, specialRequests } = req.body
  if (!packageId || !travelers || !travelDates || !travelDates.startDate || !travelDates.endDate) {
    return res.status(400).json({
      success: false,
      message: 'Package ID, travelers, and travel dates are required'
    })
  }
  const packageData = await Package.findById(packageId)
  if (!packageData || !packageData.isActive) {
    return res.status(404).json({
      success: false,
      message: 'Package not found or not available'
    })
  }
  const availability = packageData.checkAvailability(
    travelDates.startDate, 
    travelDates.endDate, 
    travelers.length
  )
  if (!availability.available) {
    return res.status(400).json({
      success: false,
      message: availability.reason
    })
  }
  const basePrice = packageData.pricing.basePrice * travelers.length
  const taxes = basePrice * 0.18 // 18% GST
  const fees = 500 * travelers.length // Processing fees
  const totalPrice = basePrice + taxes + fees
  const booking = await Booking.create({
    user: req.user._id,
    package: packageId,
    travelers,
    travelDates,
    pricing: {
      basePrice,
      taxes,
      fees,
      discounts: 0,
      totalPrice,
      currency: packageData.pricing.currency
    },
    specialRequests,
    requiresPassport: packageData.destination.country !== 'India'
  })
  await booking.populate([
    { path: 'package', select: 'name destination duration images pricing' },
    { path: 'user', select: 'firstName lastName email' }
  ])
  try {
    await emailService.sendBookingConfirmation(booking)
  } catch (error) {
    console.error('Failed to send booking confirmation email:', error)
  }
  res.status(201).json({
    success: true,
    message: 'Booking created successfully',
    data: booking
  })
})
export const getMyBookings = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 10
  const status = req.query.status
  let query = { user: req.user._id }
  if (status) {
    query.status = status
  }
  const bookings = await Booking.find(query)
    .populate('package', 'name destination duration images pricing')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
  const total = await Booking.countDocuments(query)
  res.status(200).json({
    success: true,
    data: bookings,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  })
})
export const getBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate('package')
    .populate('user', 'firstName lastName email phoneNumber')
  if (!booking) {
    return res.status(404).json({
      success: false,
      message: 'Booking not found'
    })
  }
  if (booking.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to access this booking'
    })
  }
  res.status(200).json({
    success: true,
    data: booking
  })
})
export const updateBookingStatus = asyncHandler(async (req, res) => {
  const { status } = req.body
  const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed', 'refunded']
  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid status'
    })
  }
  const booking = await Booking.findById(req.params.id)
  if (!booking) {
    return res.status(404).json({
      success: false,
      message: 'Booking not found'
    })
  }
  booking.status = status
  booking.addCommunication(
    'system',
    `Booking Status Updated`,
    `Your booking status has been updated to: ${status}`
  )
  await booking.save()
  res.status(200).json({
    success: true,
    message: 'Booking status updated successfully',
    data: booking
  })
})
export const cancelBooking = asyncHandler(async (req, res) => {
  const { reason } = req.body
  const booking = await Booking.findById(req.params.id)
  if (!booking) {
    return res.status(404).json({
      success: false,
      message: 'Booking not found'
    })
  }
  if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to cancel this booking'
    })
  }
  if (['cancelled', 'completed', 'refunded'].includes(booking.status)) {
    return res.status(400).json({
      success: false,
      message: 'This booking cannot be cancelled'
    })
  }
  const cancellationInfo = booking.calculateCancellationCharges()
  booking.status = 'cancelled'
  booking.cancellation = {
    reason: reason || 'Cancelled by user',
    cancelledAt: new Date(),
    cancelledBy: req.user._id,
    refundAmount: cancellationInfo.refundAmount,
    refundStatus: cancellationInfo.refundAmount > 0 ? 'pending' : 'not_applicable'
  }
  booking.addCommunication(
    'system',
    'Booking Cancelled',
    `Your booking has been cancelled. ${cancellationInfo.refundAmount > 0 ? `Refund amount: ₹${cancellationInfo.refundAmount}` : 'No refund applicable.'}`
  )
  await booking.save()
  try {
    await emailService.sendCancellationConfirmation(booking)
  } catch (error) {
    console.error('Failed to send cancellation confirmation email:', error)
  }
  res.status(200).json({
    success: true,
    message: 'Booking cancelled successfully',
    data: {
      booking,
      cancellationInfo
    }
  })
})
export const updatePaymentStatus = asyncHandler(async (req, res) => {
  const { status, method, transactionId, amount } = req.body
  const booking = await Booking.findById(req.params.id)
  if (!booking) {
    return res.status(404).json({
      success: false,
      message: 'Booking not found'
    })
  }
  if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to update payment for this booking'
    })
  }
  booking.payment.status = status
  booking.payment.method = method
  booking.payment.transactionId = transactionId
  booking.payment.paidAmount += amount || 0
  booking.payment.paymentHistory.push({
    amount: amount || 0,
    method,
    transactionId,
    status,
    timestamp: new Date()
  })
  if (status === 'completed' && booking.status === 'pending') {
    booking.status = 'confirmed'
  }
  booking.addCommunication(
    'system',
    'Payment Update',
    `Payment status updated: ${status}. ${transactionId ? `Transaction ID: ${transactionId}` : ''}`
  )
  await booking.save()
  res.status(200).json({
    success: true,
    message: 'Payment status updated successfully',
    data: booking
  })
})
export const getAllBookings = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 10
  const status = req.query.status
  const packageId = req.query.package
  let query = {}
  if (status) query.status = status
  if (packageId) query.package = packageId
  const bookings = await Booking.find(query)
    .populate('user', 'firstName lastName email phoneNumber')
    .populate('package', 'name destination duration pricing')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
  const total = await Booking.countDocuments(query)
  res.status(200).json({
    success: true,
    data: bookings,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  })
})
export const getBookingStats = asyncHandler(async (req, res) => {
  const stats = await Booking.getBookingStats()
  const recentBookings = await Booking.countDocuments({
    createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
  })
  const upcomingTravels = await Booking.countDocuments({
    'travelDates.startDate': { $gte: new Date() },
    status: { $in: ['confirmed', 'pending'] }
  })
  res.status(200).json({
    success: true,
    data: {
      ...stats,
      recentBookings,
      upcomingTravels
    }
  })
})
router.route('/')
  .get(protect, getMyBookings)
  .post(protect, createBooking)
router.get('/admin/all', protect, authorize('admin'), getAllBookings)
router.get('/stats', protect, authorize('admin'), getBookingStats)
router.route('/:id')
  .get(protect, getBooking)
router.put('/:id/status', protect, authorize('admin'), updateBookingStatus)
router.put('/:id/cancel', protect, cancelBooking)
router.put('/:id/payment', protect, updatePaymentStatus)
export default router
