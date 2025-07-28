import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  CreditCard, 
  Shield, 
  ArrowLeft, 
  ArrowRight, 
  User, 
  Mail, 
  Phone,
  CheckCircle,
  Loader2,
  Lock,
  Calendar,
  MapPin,
  Star,
  Package,
  Smartphone,
  Wallet,
  Building
} from 'lucide-react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { bookingService } from '../services/bookingService'
import toast from 'react-hot-toast'
const QuickPayment = () => {
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedPackage, setSelectedPackage] = useState(null)
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
    upiId: '',
    phoneNumber: ''
  })
  const [errors, setErrors] = useState({})

  const packages = {
    seas: [
      {
        id: 'andaman',
        name: 'Andaman and Nicobar',
        image: '/css/images/andaman.jpg',
        description: 'The most beautiful blue spread of eastern oceans. Famous for serene, white sandy beaches and delicious sea food of port blair.',
        gallery: '/andaman',
        price: 25000,
        duration: '5 Days',
        rating: 4.8,
        category: 'seas'
      },
      {
        id: 'reef',
        name: 'The Great Barrier Reef',
        image: '/css/images/reef.jpg',
        description: 'One of the planet\'s most extraordinary natural wonders. Famous for only living organism that could be seen from space, "The coral reef"',
        gallery: '/reef',
        price: 45000,
        duration: '7 Days',
        rating: 4.9,
        category: 'seas'
      },
      {
        id: 'caves',
        name: 'Caves Beach',
        image: '/css/images/caves.jpg',
        description: 'Shady yet bright experience of Australian seas. Highly popular for spearfishing, with the premier target species being the elusive red morwong.',
        gallery: '/caves',
        price: 35000,
        duration: '4 Days',
        rating: 4.6,
        category: 'seas'
      }
    ],
    mountains: [
      {
        id: 'antelope',
        name: 'Antelope Canyon',
        image: '/css/images/antelope.jpg',
        description: 'The canvas of nature with fine strokes and smooth finish with beautiful color grade. The antelope canyons are the sacred site of Navajo nation.',
        gallery: '/antelope',
        price: 55000,
        duration: '6 Days',
        rating: 4.9,
        category: 'mountains'
      },
      {
        id: 'fuji',
        name: 'Mount Fuji',
        image: '/css/images/fuji.jpg',
        description: 'The splendid snow covered volcano which has seen a gargantuan development of my most favourite culture in the world, Japan.',
        gallery: '/fuji',
        price: 65000,
        duration: '8 Days',
        rating: 4.8,
        category: 'mountains'
      },
      {
        id: 'himalaya',
        name: 'The Himalayas',
        image: '/css/images/himalaya.jpg',
        description: 'What does it feel like to look down to the most advanced civilization in the entire known universe? well ask The Great Mount Everest.',
        gallery: '/himalaya',
        price: 85000,
        duration: '12 Days',
        rating: 5.0,
        category: 'mountains'
      }
    ],
    landscapes: [
      {
        id: 'azores',
        name: 'Azores',
        image: '/css/images/azores.jpg',
        description: 'The Azores are known for their vibrantly-colored blue green lakes, fertile prairies, colorful hydrangeas, 15th century churches, and manor houses.',
        gallery: '/azores',
        price: 40000,
        duration: '6 Days',
        rating: 4.7,
        category: 'landscapes'
      },
      {
        id: 'iceland',
        name: 'Iceland',
        image: '/css/images/iceland.jpg',
        description: 'Land of the vikings and beautiful waterfalls, also widely known as "The Land of Fire and Ice". Iceland is home to some of the largest glaciers in Europe.',
        gallery: '/iceland',
        price: 75000,
        duration: '10 Days',
        rating: 4.9,
        category: 'landscapes'
      },
      {
        id: 'amazon',
        name: 'Amazon',
        image: '/css/images/amazon.jpg',
        description: 'The biggest rainforest in the world with the largest number of living species. Only bravest people choose this as their adventure destiny.',
        gallery: '/amazon',
        price: 55000,
        duration: '9 Days',
        rating: 4.8,
        category: 'landscapes'
      }
    ]
  }
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please login to continue')
      navigate('/signin')
      return
    }
    const packageId = searchParams.get('package')
    const bookingType = searchParams.get('type')
    const itemId = searchParams.get('id')
    if (packageId) {

      const allPackages = [...packages.seas, ...packages.mountains, ...packages.landscapes]
      const pkg = allPackages.find(p => p.id === packageId)
      if (pkg) {
        setSelectedPackage(pkg)
      } else {
        toast.error('Package not found')
        navigate('/packages')
      }
    } else if (bookingType === 'hotel') {

      const hotelData = localStorage.getItem('tempHotelBooking')
      if (hotelData) {
        setSelectedPackage(JSON.parse(hotelData))
      } else {
        toast.error('Hotel booking data not found')
        navigate('/hotels')
      }
    } else if (bookingType === 'flight') {

      const flightData = localStorage.getItem('tempFlightBooking')
      if (flightData) {
        setSelectedPackage(JSON.parse(flightData))
      } else {
        toast.error('Flight booking data not found')
        navigate('/flight')
      }
    } else {
      navigate('/packages')
    }
  }, [isAuthenticated, searchParams, navigate])
  const validatePaymentData = () => {
    const newErrors = {}
    if (paymentMethod === 'card') {
      if (!paymentData.cardNumber || paymentData.cardNumber.length < 16) {
        newErrors.cardNumber = 'Valid card number required'
      }
      if (!paymentData.expiryDate) {
        newErrors.expiryDate = 'Expiry date required'
      }
      if (!paymentData.cvv || paymentData.cvv.length < 3) {
        newErrors.cvv = 'Valid CVV required'
      }
      if (!paymentData.cardName.trim()) {
        newErrors.cardName = 'Cardholder name required'
      }
    } else if (paymentMethod === 'upi') {
      if (!paymentData.upiId || !paymentData.upiId.includes('@')) {
        newErrors.upiId = 'Valid UPI ID required'
      }
    } else if (paymentMethod === 'wallet') {
      if (!paymentData.phoneNumber || paymentData.phoneNumber.length < 10) {
        newErrors.phoneNumber = 'Valid phone number required'
      }
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  const handlePayment = async () => {
    if (!validatePaymentData()) return
    setIsProcessing(true)
    try {

      await new Promise(resolve => setTimeout(resolve, 3000))

      const bookingType = searchParams.get('type')
      let booking
      if (bookingType === 'hotel' || bookingType === 'flight') {

        booking = bookingService.createBooking(selectedPackage)

        localStorage.removeItem('tempHotelBooking')
        localStorage.removeItem('tempFlightBooking')
      } else {

        booking = bookingService.createBooking(selectedPackage)
      }
      setCurrentStep(3) // Success step

      const bookingTypeText = bookingType === 'hotel' ? 'Hotel' : 
                             bookingType === 'flight' ? 'Flight' : 'Package'
      toast.success(`🎉 ${bookingTypeText} Booking Successful! 
Booking ID: ${booking.bookingId}
${bookingTypeText}: ${selectedPackage.name}
Amount Paid: ₹${Math.round(selectedPackage.price * 1.18).toLocaleString()}
Your ${bookingTypeText.toLowerCase()} is confirmed!`)

      setTimeout(() => {
        navigate('/bookings')
      }, 3000)
    } catch (error) {
      toast.error('Payment failed. Please try again.')
      console.error('Payment error:', error)
    }
    setIsProcessing(false)
  }
  const getBackButtonText = () => {
    const bookingType = searchParams.get('type')
    if (bookingType === 'hotel') return 'Back to Hotels'
    if (bookingType === 'flight') return 'Back to Flights'
    return 'Back to Packages'
  }
  const getBackButtonPath = () => {
    const bookingType = searchParams.get('type')
    if (bookingType === 'hotel') return '/hotels'
    if (bookingType === 'flight') return '/flight'
    return '/packages'
  }
  const getBookingTypeText = () => {
    const bookingType = searchParams.get('type')
    if (bookingType === 'hotel') return 'Hotel'
    if (bookingType === 'flight') return 'Flight'
    return 'Package'
  }
  const formatCardNumber = (value) => {
    return value.replace(/\s+/g, '').replace(/[^0-9]/gi, '').replace(/(.{4})/g, '$1 ').trim()
  }
  const handleInputChange = (field, value) => {
    if (field === 'cardNumber') {
      value = formatCardNumber(value)
      if (value.replace(/\s/g, '').length > 16) return
    }
    if (field === 'cvv' && value.length > 4) return
    if (field === 'phoneNumber' && value.length > 10) return
    setPaymentData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }
  if (!selectedPackage) {
    return (
      <div className="min-h-screen bg-modern-dark flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    )
  }
  const steps = [
    { id: 1, name: 'Review Package' },
    { id: 2, name: 'Payment' },
    { id: 3, name: 'Confirmation' }
  ]
  const paymentMethods = [
    { id: 'card', name: 'Credit/Debit Card', icon: CreditCard },
    { id: 'upi', name: 'UPI Payment', icon: Smartphone },
    { id: 'wallet', name: 'Digital Wallet', icon: Wallet }
  ]
  return (
    <div className="min-h-screen bg-modern-dark pt-20">
      {}
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <button
            onClick={() => navigate(getBackButtonPath())}
            className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>{getBackButtonText()}</span>
          </button>
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-green-500" />
            <span className="text-green-500 text-sm font-medium">Secure Payment</span>
          </div>
        </motion.div>
        {}
        <div className="flex items-center justify-center mb-12">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                currentStep >= step.id 
                  ? 'bg-blue-600 border-blue-600 text-white' 
                  : 'border-gray-600 text-gray-400'
              }`}>
                {currentStep > step.id ? (
                  <CheckCircle className="w-6 h-6" />
                ) : (
                  <span className="text-sm font-semibold">{step.id}</span>
                )}
              </div>
              <span className={`ml-3 text-sm font-medium ${
                currentStep >= step.id ? 'text-white' : 'text-gray-400'
              }`}>
                {step.name}
              </span>
              {index < steps.length - 1 && (
                <div className={`w-16 h-0.5 mx-4 ${
                  currentStep > step.id ? 'bg-blue-600' : 'bg-gray-600'
                }`} />
              )}
            </div>
          ))}
        </div>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-dark rounded-2xl p-6 border border-white/10 h-fit"
            >
              <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                <Package className="w-5 h-5 mr-2" />
                {getBookingTypeText()} Booking Summary
              </h3>
              <div className="space-y-4">
                {}
                <div className="relative h-48 rounded-xl overflow-hidden">
                  <img 
                    src={selectedPackage.image} 
                    alt={selectedPackage.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = '/css/images/package.jpg'
                    }}
                  />
                  <div className="absolute top-4 left-4 bg-blue-500/90 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {selectedPackage.duration}
                  </div>
                  <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full flex items-center space-x-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{selectedPackage.rating}</span>
                  </div>
                </div>
                {}
                <div>
                  <h4 className="text-2xl font-bold text-white mb-2">{selectedPackage.name}</h4>
                  <p className="text-gray-300 text-sm mb-4">{selectedPackage.description}</p>
                  <div className="flex items-center space-x-4 text-gray-400 text-sm mb-6">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{selectedPackage.duration}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span className="capitalize">
                        {selectedPackage.location || selectedPackage.category}
                      </span>
                    </div>
                  </div>
                  {}
                  {selectedPackage.dates && (
                    <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4 mb-4">
                      <h5 className="text-white font-medium mb-2">Booking Details</h5>
                      {selectedPackage.dates.checkIn && (
                        <div className="space-y-1 text-sm text-gray-300">
                          <div>Check-in: {new Date(selectedPackage.dates.checkIn).toLocaleDateString()}</div>
                          <div>Check-out: {new Date(selectedPackage.dates.checkOut).toLocaleDateString()}</div>
                          {selectedPackage.guests && <div>Guests: {selectedPackage.guests}</div>}
                        </div>
                      )}
                      {selectedPackage.dates.departure && (
                        <div className="space-y-1 text-sm text-gray-300">
                          <div>Departure: {new Date(selectedPackage.dates.departure).toLocaleDateString()}</div>
                          {selectedPackage.dates.return && (
                            <div>Return: {new Date(selectedPackage.dates.return).toLocaleDateString()}</div>
                          )}
                          {selectedPackage.passengers && <div>Passengers: {selectedPackage.passengers}</div>}
                          {selectedPackage.class && <div>Class: {selectedPackage.class.charAt(0).toUpperCase() + selectedPackage.class.slice(1)}</div>}
                        </div>
                      )}
                    </div>
                  )}
                  {}
                  <div className="bg-white/5 rounded-xl p-4 space-y-2">
                    <div className="flex justify-between text-gray-300">
                      <span>{getBookingTypeText()} Cost</span>
                      <span>₹{selectedPackage.price.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-gray-300">
                      <span>Taxes & Fees</span>
                      <span>₹{Math.round(selectedPackage.price * 0.18).toLocaleString()}</span>
                    </div>
                    <div className="border-t border-white/10 pt-2 flex justify-between text-white font-bold text-lg">
                      <span>Total Amount</span>
                      <span>₹{Math.round(selectedPackage.price * 1.18).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
            {}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-dark rounded-2xl p-6 border border-white/10"
            >
              <AnimatePresence mode="wait">
                {currentStep === 1 && (
                  <motion.div
                    key="review"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <h3 className="text-xl font-bold text-white mb-6">Review Your Booking</h3>
                    <div className="space-y-4 mb-8">
                      <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                        <div className="flex items-start space-x-3">
                          <User className="w-5 h-5 text-blue-400 mt-1" />
                          <div>
                            <h4 className="text-white font-medium">Traveler Information</h4>
                            <p className="text-gray-300 text-sm">
                              {user?.firstName} {user?.lastName}<br />
                              {user?.email}<br />
                              Quick booking for 1 traveler
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
                        <div className="flex items-start space-x-3">
                          <Calendar className="w-5 h-5 text-purple-400 mt-1" />
                          <div>
                            <h4 className="text-white font-medium">Travel Dates</h4>
                            <p className="text-gray-300 text-sm">
                              Flexible dates - Our team will contact you<br />
                              to finalize your preferred travel schedule
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setCurrentStep(2)}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-xl flex items-center justify-center space-x-2 transition-all duration-300"
                    >
                      <span>Proceed to Payment</span>
                      <ArrowRight className="w-5 h-5" />
                    </motion.button>
                  </motion.div>
                )}
                {currentStep === 2 && (
                  <motion.div
                    key="payment"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                      <Lock className="w-5 h-5 mr-2" />
                      Secure Payment
                    </h3>
                    {}
                    <div className="mb-6">
                      <label className="block text-white font-medium mb-3">Choose Payment Method</label>
                      <div className="grid grid-cols-1 gap-3">
                        {paymentMethods.map(method => (
                          <motion.button
                            key={method.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setPaymentMethod(method.id)}
                            className={`p-4 rounded-xl border-2 flex items-center space-x-3 transition-all ${
                              paymentMethod === method.id
                                ? 'border-blue-500 bg-blue-500/10'
                                : 'border-white/20 bg-white/5 hover:bg-white/10'
                            }`}
                          >
                            <method.icon className="w-5 h-5 text-blue-400" />
                            <span className="text-white font-medium">{method.name}</span>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                    {}
                    <div className="space-y-4 mb-8">
                      {paymentMethod === 'card' && (
                        <>
                          <div>
                            <label className="block text-white font-medium mb-2">Card Number</label>
                            <input
                              type="text"
                              placeholder="1234 5678 9012 3456"
                              value={paymentData.cardNumber}
                              onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                              className={`w-full p-3 bg-white/10 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                                errors.cardNumber ? 'border-red-500' : 'border-white/20'
                              }`}
                            />
                            {errors.cardNumber && <p className="text-red-400 text-sm mt-1">{errors.cardNumber}</p>}
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-white font-medium mb-2">Expiry Date</label>
                              <input
                                type="month"
                                value={paymentData.expiryDate}
                                onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                                className={`w-full p-3 bg-white/10 border rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                                  errors.expiryDate ? 'border-red-500' : 'border-white/20'
                                }`}
                              />
                              {errors.expiryDate && <p className="text-red-400 text-sm mt-1">{errors.expiryDate}</p>}
                            </div>
                            <div>
                              <label className="block text-white font-medium mb-2">CVV</label>
                              <input
                                type="password"
                                placeholder="123"
                                maxLength="4"
                                value={paymentData.cvv}
                                onChange={(e) => handleInputChange('cvv', e.target.value)}
                                className={`w-full p-3 bg-white/10 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                                  errors.cvv ? 'border-red-500' : 'border-white/20'
                                }`}
                              />
                              {errors.cvv && <p className="text-red-400 text-sm mt-1">{errors.cvv}</p>}
                            </div>
                          </div>
                          <div>
                            <label className="block text-white font-medium mb-2">Cardholder Name</label>
                            <input
                              type="text"
                              placeholder="John Doe"
                              value={paymentData.cardName}
                              onChange={(e) => handleInputChange('cardName', e.target.value)}
                              className={`w-full p-3 bg-white/10 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                                errors.cardName ? 'border-red-500' : 'border-white/20'
                              }`}
                            />
                            {errors.cardName && <p className="text-red-400 text-sm mt-1">{errors.cardName}</p>}
                          </div>
                        </>
                      )}
                      {paymentMethod === 'upi' && (
                        <div>
                          <label className="block text-white font-medium mb-2">UPI ID</label>
                          <input
                            type="text"
                            placeholder="yourname@paytm"
                            value={paymentData.upiId}
                            onChange={(e) => handleInputChange('upiId', e.target.value)}
                            className={`w-full p-3 bg-white/10 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                              errors.upiId ? 'border-red-500' : 'border-white/20'
                            }`}
                          />
                          {errors.upiId && <p className="text-red-400 text-sm mt-1">{errors.upiId}</p>}
                        </div>
                      )}
                      {paymentMethod === 'wallet' && (
                        <div>
                          <label className="block text-white font-medium mb-2">Phone Number</label>
                          <input
                            type="tel"
                            placeholder="9876543210"
                            value={paymentData.phoneNumber}
                            onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                            className={`w-full p-3 bg-white/10 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                              errors.phoneNumber ? 'border-red-500' : 'border-white/20'
                            }`}
                          />
                          {errors.phoneNumber && <p className="text-red-400 text-sm mt-1">{errors.phoneNumber}</p>}
                        </div>
                      )}
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handlePayment}
                      disabled={isProcessing}
                      className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-4 px-6 rounded-xl flex items-center justify-center space-x-2 transition-all duration-300"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Processing Payment...</span>
                        </>
                      ) : (
                        <>
                          <span>Pay ₹{Math.round(selectedPackage.price * 1.18).toLocaleString()}</span>
                          <ArrowRight className="w-5 h-5" />
                        </>
                      )}
                    </motion.button>
                  </motion.div>
                )}
                {currentStep === 3 && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center"
                  >
                    <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="w-12 h-12 text-green-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">Payment Successful!</h3>
                    <p className="text-gray-300 mb-8">
                      Your booking has been confirmed. You'll receive a confirmation email shortly.
                    </p>
                    <div className="space-y-4">
                      <Link
                        to="/bookings"
                        className="block w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300"
                      >
                        View My Bookings
                      </Link>
                      <Link
                        to="/packages"
                        className="block w-full bg-white/10 hover:bg-white/20 text-white font-medium py-3 px-6 rounded-xl border border-white/20 transition-all duration-300"
                      >
                        Browse More Packages
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default QuickPayment
