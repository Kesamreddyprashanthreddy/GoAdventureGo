import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  CreditCard, 
  Shield, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  ArrowLeft,
  Lock,
  Smartphone,
  Wallet
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../contexts/AuthContext'
const PaymentGateway = ({ booking, onPaymentSuccess, onCancel }) => {
  const { user } = useAuth()
  const [paymentProvider, setPaymentProvider] = useState('razorpay')
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentStep, setPaymentStep] = useState('method') // method, processing, success, failed
  const [paymentMethods, setPaymentMethods] = useState([])
  useEffect(() => {
    fetchPaymentMethods()
  }, [])
  const fetchPaymentMethods = async () => {
    try {
      const response = await fetch('/api/payments/methods')
      const data = await response.json()
      if (data.success) {
        setPaymentMethods(data.data.methods)
      }
    } catch (error) {
      console.error('Error fetching payment methods:', error)
    }
  }
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }
  const loadStripeScript = () => {
    return new Promise((resolve) => {
      if (window.Stripe) {
        resolve(true)
        return
      }
      const script = document.createElement('script')
      script.src = 'https://js.stripe.com/v3/'
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.head.appendChild(script)
    })
  }
  const handlePayment = async () => {
    setIsProcessing(true)
    setPaymentStep('processing')
    try {
      const response = await fetch('/api/payments/create-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          bookingId: booking._id,
          paymentProvider,
          currency: paymentProvider === 'razorpay' ? 'INR' : 'USD'
        })
      })
      const data = await response.json()
      if (!data.success) {
        throw new Error(data.message)
      }
      if (paymentProvider === 'razorpay') {
        await processRazorpayPayment(data.data)
      } else {
        await processStripePayment(data.data)
      }
    } catch (error) {
      console.error('Payment error:', error)
      setPaymentStep('failed')
      toast.error(error.message || 'Payment failed')
    }
    setIsProcessing(false)
  }
  const processRazorpayPayment = async (paymentData) => {
    const isLoaded = await loadRazorpayScript()
    if (!isLoaded) {
      throw new Error('Razorpay SDK failed to load')
    }
    const options = {
      key: process.env.REACT_APP_RAZORPAY_KEY_ID || 'rzp_test_demo', // Use demo key for testing
      amount: paymentData.amount * 100,
      currency: paymentData.currency,
      name: 'GoAdventureGo',
      description: `Booking for ${paymentData.bookingDetails.packageName}`,
      image: '/logo.png',
      order_id: paymentData.orderId,
      handler: async (response) => {
        try {
          await completePayment({
            bookingId: booking._id,
            paymentProvider: 'razorpay',
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature
          })
        } catch (error) {
          setPaymentStep('failed')
          toast.error('Payment verification failed')
        }
      },
      prefill: {
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        contact: user.phoneNumber || ''
      },
      theme: {
        color: '#667eea'
      },
      modal: {
        ondismiss: () => {
          setPaymentStep('method')
          setIsProcessing(false)
        }
      }
    }
    const razorpay = new window.Razorpay(options)
    razorpay.open()
  }
  const processStripePayment = async (paymentData) => {
    const isLoaded = await loadStripeScript()
    if (!isLoaded) {
      throw new Error('Stripe SDK failed to load')
    }
    const stripe = window.Stripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY)
    const { error, paymentIntent } = await stripe.confirmCardPayment(paymentData.clientSecret, {
      payment_method: {
        card: {
        },
        billing_details: {
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
        },
      }
    })
    if (error) {
      throw new Error(error.message)
    }
    await completePayment({
      bookingId: booking._id,
      paymentProvider: 'stripe',
      paymentIntentId: paymentIntent.id
    })
  }
  const completePayment = async (paymentData) => {
    const response = await fetch('/api/payments/complete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(paymentData)
    })
    const data = await response.json()
    if (data.success) {
      setPaymentStep('success')
      toast.success('Payment completed successfully!')
      setTimeout(() => {
        onPaymentSuccess(data.data)
      }, 2000)
    } else {
      throw new Error(data.message)
    }
  }
  const paymentMethodsConfig = {
    razorpay: {
      name: 'Razorpay',
      icon: Wallet,
      description: 'Pay with UPI, Cards, Netbanking',
      features: ['UPI', 'Credit/Debit Cards', 'Net Banking', 'Wallets']
    },
    stripe: {
      name: 'Stripe',
      icon: CreditCard,
      description: 'International payments',
      features: ['Credit Cards', 'Apple Pay', 'Google Pay']
    }
  }
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
      >
        {}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Secure Payment</h2>
            <button
              onClick={onCancel}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
          </div>
          <div className="flex items-center space-x-2 mt-2">
            <Shield className="w-5 h-5" />
            <span className="text-sm">256-bit SSL Encrypted</span>
          </div>
        </div>
        {}
        <div className="p-6 bg-gray-50 border-b">
          <h3 className="font-semibold text-gray-900 mb-3">Booking Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Package:</span>
              <span className="font-medium">{booking.package?.name}</span>
            </div>
            <div className="flex justify-between">
              <span>Travelers:</span>
              <span className="font-medium">{booking.travelers?.length} person(s)</span>
            </div>
            <div className="flex justify-between">
              <span>Dates:</span>
              <span className="font-medium">
                {new Date(booking.travelDates?.startDate).toLocaleDateString()} - 
                {new Date(booking.travelDates?.endDate).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between text-lg font-bold text-blue-600 pt-2 border-t">
              <span>Total Amount:</span>
              <span>₹{booking.pricing?.totalPrice.toLocaleString()}</span>
            </div>
          </div>
        </div>
        {}
        <div className="p-6">
          <AnimatePresence mode="wait">
            {paymentStep === 'method' && (
              <motion.div
                key="method"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h3 className="font-semibold text-gray-900 mb-4">Select Payment Method</h3>
                <div className="space-y-3 mb-6">
                  {Object.entries(paymentMethodsConfig).map(([key, method]) => (
                    <label
                      key={key}
                      className={`block cursor-pointer p-4 border-2 rounded-xl transition-all ${
                        paymentProvider === key
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentProvider"
                        value={key}
                        checked={paymentProvider === key}
                        onChange={(e) => setPaymentProvider(e.target.value)}
                        className="hidden"
                      />
                      <div className="flex items-center space-x-4">
                        <method.icon className="w-8 h-8 text-blue-600" />
                        <div className="flex-1">
                          <div className="font-medium">{method.name}</div>
                          <div className="text-sm text-gray-500">{method.description}</div>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {method.features.map((feature) => (
                              <span
                                key={feature}
                                className="text-xs bg-gray-100 px-2 py-1 rounded-full"
                              >
                                {feature}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  <Lock className="w-5 h-5" />
                  <span>Pay ₹{booking.pricing?.totalPrice.toLocaleString()}</span>
                </motion.button>
              </motion.div>
            )}
            {paymentStep === 'processing' && (
              <motion.div
                key="processing"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center py-8"
              >
                <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Processing Payment...</h3>
                <p className="text-gray-600">Please don't close this window</p>
              </motion.div>
            )}
            {paymentStep === 'success' && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="text-center py-8"
              >
                <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-green-600">Payment Successful!</h3>
                <p className="text-gray-600">Your booking has been confirmed</p>
              </motion.div>
            )}
            {paymentStep === 'failed' && (
              <motion.div
                key="failed"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="text-center py-8"
              >
                <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-red-600">Payment Failed</h3>
                <p className="text-gray-600 mb-4">Please try again or contact support</p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setPaymentStep('method')}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Try Again
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {}
        {paymentStep === 'method' && (
          <div className="p-4 bg-gray-50 rounded-b-2xl">
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Shield className="w-4 h-4" />
                <span>SSL Secured</span>
              </div>
              <div className="flex items-center space-x-1">
                <Lock className="w-4 h-4" />
                <span>PCI Compliant</span>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}
export default PaymentGateway
