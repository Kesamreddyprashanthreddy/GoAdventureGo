import express from 'express'
import { protect } from '../middleware/auth.js'
import { asyncHandler } from '../middleware/errorHandler.js'
import { getPaymentService, stripeService, razorpayService } from '../services/paymentService.js'
import { emailService } from '../services/emailService.js'
import Booking from '../models/Booking.js'
const router = express.Router()
export const createPaymentIntent = asyncHandler(async (req, res) => {
  const { bookingId, paymentProvider = 'razorpay', currency = 'INR' } = req.body
  if (!bookingId) {
    return res.status(400).json({
      success: false,
      message: 'Booking ID is required'
    })
  }
  const booking = await Booking.findById(bookingId).populate('package user')
  if (!booking) {
    return res.status(404).json({
      success: false,
      message: 'Booking not found'
    })
  }
  if (booking.user._id.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to make payment for this booking'
    })
  }
  if (booking.payment.status === 'completed') {
    return res.status(400).json({
      success: false,
      message: 'Payment already completed for this booking'
    })
  }
  const paymentService = getPaymentService(paymentProvider)
  let result
  if (paymentProvider === 'stripe') {
    result = await paymentService.createPaymentIntent(
      booking.pricing.totalPrice,
      currency.toLowerCase(),
      {
        bookingId: booking._id.toString(),
        userId: req.user._id.toString(),
        packageName: booking.package.name
      }
    )
  } else {
    result = await paymentService.createOrder(
      booking.pricing.totalPrice,
      currency.toUpperCase(),
      `booking_${booking._id}`
    )
  }
  if (result.success) {
    booking.payment.provider = paymentProvider
    booking.payment.currency = currency
    if (paymentProvider === 'stripe') {
      booking.payment.paymentIntentId = result.paymentIntentId
    } else {
      booking.payment.orderId = result.orderId
    }
    await booking.save()
    res.status(200).json({
      success: true,
      data: {
        ...result,
        bookingDetails: {
          bookingId: booking.bookingId,
          packageName: booking.package.name,
          amount: booking.pricing.totalPrice,
          currency: currency
        }
      }
    })
  } else {
    res.status(400).json({
      success: false,
      message: result.error
    })
  }
})
export const completePayment = asyncHandler(async (req, res) => {
  const { bookingId, paymentProvider = 'razorpay' } = req.body
  const booking = await Booking.findById(bookingId).populate('package user')
  if (!booking) {
    return res.status(404).json({
      success: false,
      message: 'Booking not found'
    })
  }
  if (booking.user._id.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to complete payment for this booking'
    })
  }
  let result
  if (paymentProvider === 'stripe') {
    const { paymentIntentId } = req.body
    result = await stripeService.confirmPayment(paymentIntentId)
  } else {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body
    result = await razorpayService.verifyPayment(razorpayOrderId, razorpayPaymentId, razorpaySignature)
  }
  if (result.success && (result.status === 'succeeded' || result.status === 'captured')) {
    booking.payment.status = 'completed'
    booking.payment.transactionId = paymentProvider === 'stripe' ? result.paymentIntentId : result.paymentId
    booking.payment.paidAmount = result.amount
    booking.payment.paidAt = new Date()
    booking.status = 'confirmed'
    booking.payment.paymentHistory.push({
      amount: result.amount,
      method: booking.payment.provider,
      transactionId: booking.payment.transactionId,
      status: 'completed',
      timestamp: new Date()
    })
    await booking.save()
    try {
      await emailService.sendBookingConfirmation(booking)
      await emailService.sendPaymentConfirmation(booking, {
        transactionId: booking.payment.transactionId,
        amount: result.amount,
        method: booking.payment.provider
      })
    } catch (error) {
      console.error('Failed to send confirmation emails:', error)
    }
    res.status(200).json({
      success: true,
      message: 'Payment completed successfully',
      data: {
        bookingId: booking.bookingId,
        transactionId: booking.payment.transactionId,
        amount: result.amount,
        status: booking.status
      }
    })
  } else {
    booking.payment.status = 'failed'
    await booking.save()
    res.status(400).json({
      success: false,
      message: 'Payment verification failed',
      error: result.error
    })
  }
})
export const processRefund = asyncHandler(async (req, res) => {
  const { bookingId, amount, reason = 'requested_by_customer' } = req.body
  const booking = await Booking.findById(bookingId).populate('user')
  if (!booking) {
    return res.status(404).json({
      success: false,
      message: 'Booking not found'
    })
  }
  if (booking.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to process refund for this booking'
    })
  }
  if (booking.payment.status !== 'completed') {
    return res.status(400).json({
      success: false,
      message: 'Cannot refund unpaid booking'
    })
  }
  const paymentService = getPaymentService(booking.payment.provider)
  let result
  if (booking.payment.provider === 'stripe') {
    result = await paymentService.createRefund(booking.payment.transactionId, amount, reason)
  } else {
    result = await paymentService.createRefund(booking.payment.transactionId, amount, { reason })
  }
  if (result.success) {
    booking.payment.refunds = booking.payment.refunds || []
    booking.payment.refunds.push({
      refundId: result.refundId,
      amount: result.amount,
      status: result.status,
      reason,
      processedAt: new Date()
    })
    if (!amount || amount === booking.payment.paidAmount) {
      booking.cancellation = {
        ...booking.cancellation,
        refundAmount: result.amount,
        refundStatus: 'processed'
      }
      booking.status = 'refunded'
    }
    await booking.save()
    res.status(200).json({
      success: true,
      message: 'Refund processed successfully',
      data: {
        refundId: result.refundId,
        amount: result.amount,
        status: result.status
      }
    })
  } else {
    res.status(400).json({
      success: false,
      message: 'Refund processing failed',
      error: result.error
    })
  }
})
export const getPaymentStatus = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.bookingId).populate('user')
  if (!booking) {
    return res.status(404).json({
      success: false,
      message: 'Booking not found'
    })
  }
  if (booking.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to view payment status'
    })
  }
  res.status(200).json({
    success: true,
    data: {
      bookingId: booking.bookingId,
      paymentStatus: booking.payment.status,
      totalAmount: booking.pricing.totalPrice,
      paidAmount: booking.payment.paidAmount,
      currency: booking.payment.currency,
      paymentMethod: booking.payment.provider,
      transactionId: booking.payment.transactionId,
      paymentHistory: booking.payment.paymentHistory,
      refunds: booking.payment.refunds || []
    }
  })
})
export const getPaymentMethods = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      methods: [
        {
          provider: 'razorpay',
          name: 'Razorpay',
          currencies: ['INR'],
          methods: ['card', 'netbanking', 'wallet', 'upi'],
          description: 'Secure payments powered by Razorpay'
        },
        {
          provider: 'stripe',
          name: 'Stripe',
          currencies: ['USD', 'EUR', 'GBP'],
          methods: ['card', 'apple_pay', 'google_pay'],
          description: 'International payments powered by Stripe'
        }
      ]
    }
  })
})
router.post('/create-intent', protect, createPaymentIntent)
router.post('/complete', protect, completePayment)
router.post('/refund', protect, processRefund)
router.get('/status/:bookingId', protect, getPaymentStatus)
router.get('/methods', getPaymentMethods)
export default router
