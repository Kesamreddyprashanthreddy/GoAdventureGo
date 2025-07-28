import Stripe from 'stripe'
import Razorpay from 'razorpay'
import dotenv from 'dotenv'
dotenv.config()
let stripe = null
try {
  if (process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY !== 'sk_test_your_stripe_secret_key_here') {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
    console.log('✅ Stripe initialized successfully')
  } else {
    console.log('⚠️ Stripe API key not configured, payment service will be limited')
  }
} catch (error) {
  console.error('❌ Error initializing Stripe:', error.message)
}
let razorpay = null
try {
  if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_ID !== 'rzp_test_your_key_id_here') {
    razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    })
    console.log('✅ Razorpay initialized successfully')
  } else {
    console.log('⚠️ Razorpay API keys not configured, payment service will be limited')
  }
} catch (error) {
  console.error('❌ Error initializing Razorpay:', error.message)
}
export const stripeService = {
  createPaymentIntent: async (amount, currency = 'usd', metadata = {}) => {
    try {
      if (!stripe) {
        return {
          success: false,
          error: 'Stripe payment service is not configured'
        }
      }
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency,
        metadata,
        automatic_payment_methods: {
          enabled: true,
        },
      })
      return {
        success: true,
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  },
  confirmPayment: async (paymentIntentId) => {
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
      return {
        success: true,
        status: paymentIntent.status,
        amount: paymentIntent.amount / 100, // Convert back from cents
        currency: paymentIntent.currency
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  },
  createRefund: async (paymentIntentId, amount = null, reason = 'requested_by_customer') => {
    try {
      const refund = await stripe.refunds.create({
        payment_intent: paymentIntentId,
        amount: amount ? Math.round(amount * 100) : undefined,
        reason
      })
      return {
        success: true,
        refundId: refund.id,
        amount: refund.amount / 100,
        status: refund.status
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  }
}
export const razorpayService = {
  createOrder: async (amount, currency = 'INR', receipt = null) => {
    try {
      if (!razorpay) {
        return {
          success: false,
          error: 'Razorpay payment service is not configured'
        }
      }
      const order = await razorpay.orders.create({
        amount: Math.round(amount * 100), // Convert to paise
        currency,
        receipt: receipt || `order_${Date.now()}`,
      })
      return {
        success: true,
        orderId: order.id,
        amount: order.amount / 100,
        currency: order.currency
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  },
  verifyPayment: async (razorpayOrderId, razorpayPaymentId, razorpaySignature) => {
    try {
      const crypto = await import('crypto')
      const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(razorpayOrderId + '|' + razorpayPaymentId)
        .digest('hex')
      const isValidSignature = expectedSignature === razorpaySignature
      if (isValidSignature) {
        const payment = await razorpay.payments.fetch(razorpayPaymentId)
        return {
          success: true,
          paymentId: payment.id,
          amount: payment.amount / 100,
          status: payment.status
        }
      } else {
        return {
          success: false,
          error: 'Invalid payment signature'
        }
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  },
  createRefund: async (paymentId, amount = null, notes = {}) => {
    try {
      const refund = await razorpay.payments.refund(paymentId, {
        amount: amount ? Math.round(amount * 100) : undefined,
        notes
      })
      return {
        success: true,
        refundId: refund.id,
        amount: refund.amount / 100,
        status: refund.status
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  }
}
export const getPaymentService = (provider = 'razorpay') => {
  switch (provider.toLowerCase()) {
    case 'stripe':
      return stripeService
    case 'razorpay':
      return razorpayService
    default:
      return razorpayService // Default to Razorpay for Indian market
  }
}
