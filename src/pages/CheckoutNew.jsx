import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  User, 
  Mail, 
  Phone, 
  Calendar,
  Users,
  Check,
  AlertCircle,
  Loader2,
  ArrowLeft,
  ArrowRight,
  Package,
  Plus,
  Minus,
  CreditCard
} from 'lucide-react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../contexts/AuthContext'
import PaymentGateway from '../components/PaymentGateway'
import api from '../services/api'
const Checkout = () => {
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedPackage, setSelectedPackage] = useState(null)
  const [travelers, setTravelers] = useState([{ 
    firstName: '', 
    lastName: '', 
    dateOfBirth: '', 
    gender: 'male' 
  }])
  const [travelDates, setTravelDates] = useState({ startDate: '', endDate: '' })
  const [specialRequests, setSpecialRequests] = useState('')
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPayment, setShowPayment] = useState(false)
  const [createdBooking, setCreatedBooking] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please login to continue booking')
      navigate('/login')
      return
    }
    const packageId = searchParams.get('package')
    if (packageId) {
      fetchPackage(packageId)
    } else {
      fetchDefaultPackage()
    }
    if (user) {
      setTravelers([{
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        dateOfBirth: '',
        gender: 'male'
      }])
    }
  }, [user, isAuthenticated, searchParams, navigate])
  const fetchDefaultPackage = async () => {
    try {
      setIsLoading(true)
      const response = await api.get('/packages?limit=1')
      const packages = response.data.data || response.data
      if (packages && packages.length > 0) {
        setSelectedPackage(packages[0])
      } else {
        toast.error('No packages available')
        navigate('/')
      }
    } catch (error) {
      console.error('Error fetching default package:', error)
      toast.error('Failed to load packages')
      navigate('/')
    } finally {
      setIsLoading(false)
    }
  }
  const fetchPackage = async (packageId) => {
    try {
      setIsLoading(true)
      const response = await api.get(`/packages/${packageId}`)
      setSelectedPackage(response.data.data || response.data)
    } catch (error) {
      console.error('Package fetch error:', error)
      toast.error('Failed to load package details')
      navigate('/')
    } finally {
      setIsLoading(false)
    }
  }
  const addTraveler = () => {
    setTravelers([...travelers, { firstName: '', lastName: '', dateOfBirth: '', gender: 'male' }])
  }
  const removeTraveler = (index) => {
    if (travelers.length > 1) {
      const updated = travelers.filter((_, i) => i !== index)
      setTravelers(updated)
    }
  }
  const updateTraveler = (index, field, value) => {
    const updated = [...travelers]
    updated[index][field] = value
    setTravelers(updated)
  }
  const validateBookingData = () => {
    const newErrors = {}
    travelers.forEach((traveler, index) => {
      if (!traveler.firstName.trim()) {
        newErrors[`traveler_${index}_firstName`] = 'First name is required'
      }
      if (!traveler.lastName.trim()) {
        newErrors[`traveler_${index}_lastName`] = 'Last name is required'
      }
      if (!traveler.dateOfBirth) {
        newErrors[`traveler_${index}_dateOfBirth`] = 'Date of birth is required'
      }
    })
    if (!travelDates.startDate) {
      newErrors.startDate = 'Start date is required'
    }
    if (!travelDates.endDate) {
      newErrors.endDate = 'End date is required'
    }
    if (travelDates.startDate && travelDates.endDate && new Date(travelDates.startDate) >= new Date(travelDates.endDate)) {
      newErrors.endDate = 'End date must be after start date'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  const handleBookingSubmit = async () => {
    if (!validateBookingData()) return
    setIsSubmitting(true)
    try {
      const bookingData = {
        packageId: selectedPackage._id,
        travelers: travelers.map(t => ({
          ...t,
          dateOfBirth: new Date(t.dateOfBirth)
        })),
        travelDates: {
          startDate: new Date(travelDates.startDate),
          endDate: new Date(travelDates.endDate)
        },
        specialRequests
      }
      const response = await api.post('/bookings', bookingData)
      const booking = response.data.data || response.data
      setCreatedBooking({
        ...booking,
        package: selectedPackage,
        user: user,
        pricing: {
          totalPrice: calculateTotal()
        }
      })
      toast.success('Booking created successfully!')
      setCurrentStep(3) // Move to payment step
    } catch (error) {
      console.error('Booking error:', error)
      toast.error(error.response?.data?.message || 'Failed to create booking')
    }
    setIsSubmitting(false)
  }
  const handlePaymentSuccess = (paymentData) => {
    toast.success('Payment completed! Booking confirmed.')
    setTimeout(() => {
      navigate('/packages') // Redirect to packages for now
    }, 2000)
  }
  const calculateTotal = () => {
    if (!selectedPackage) return 0
    const basePrice = selectedPackage.pricing.basePrice * travelers.length
    const taxes = Math.round(basePrice * 0.18) // 18% GST
    const fees = 500 * travelers.length // Processing fees
    return basePrice + taxes + fees
  }
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-400 mx-auto mb-4" />
          <p className="text-white text-lg">Loading package details...</p>
        </div>
      </div>
    )
  }
  const steps = [
    { number: 1, title: 'Traveler Details', icon: User },
    { number: 2, title: 'Travel Dates', icon: Calendar },
    { number: 3, title: 'Payment', icon: CreditCard }
  ]
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          {}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Complete Your Booking
            </h1>
            <p className="text-xl text-gray-300">
              Just a few more steps to confirm your adventure
            </p>
          </div>
          {}
          <div className="flex justify-center mb-12">
            <div className="flex items-center space-x-8">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 ${
                    currentStep >= step.number
                      ? 'bg-blue-500 border-blue-500 text-white'
                      : 'border-gray-400 text-gray-400'
                  }`}>
                    {currentStep > step.number ? (
                      <Check className="w-6 h-6" />
                    ) : (
                      <step.icon className="w-6 h-6" />
                    )}
                  </div>
                  <span className={`ml-3 text-sm font-medium ${
                    currentStep >= step.number ? 'text-white' : 'text-gray-400'
                  }`}>
                    {step.title}
                  </span>
                  {index < steps.length - 1 && (
                    <div className={`w-16 h-0.5 ml-8 ${
                      currentStep > step.number ? 'bg-blue-500' : 'bg-gray-400'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {}
            <div className="lg:col-span-2">
              <div className="glass-dark rounded-3xl p-8 border border-white/10">
                <AnimatePresence mode="wait">
                  {}
                  {currentStep === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <h2 className="text-2xl font-bold text-white mb-6">Traveler Information</h2>
                      {travelers.map((traveler, index) => (
                        <div key={index} className="mb-8 p-6 bg-white/5 rounded-xl border border-white/10">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-white">
                              Traveler {index + 1}
                            </h3>
                            {travelers.length > 1 && (
                              <button
                                onClick={() => removeTraveler(index)}
                                className="text-red-400 hover:text-red-300 transition-colors"
                              >
                                <Minus className="w-5 h-5" />
                              </button>
                            )}
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2">
                                First Name *
                              </label>
                              <input
                                type="text"
                                value={traveler.firstName}
                                onChange={(e) => updateTraveler(index, 'firstName', e.target.value)}
                                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                placeholder="Enter first name"
                              />
                              {errors[`traveler_${index}_firstName`] && (
                                <p className="text-red-400 text-sm mt-1">
                                  {errors[`traveler_${index}_firstName`]}
                                </p>
                              )}
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2">
                                Last Name *
                              </label>
                              <input
                                type="text"
                                value={traveler.lastName}
                                onChange={(e) => updateTraveler(index, 'lastName', e.target.value)}
                                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                placeholder="Enter last name"
                              />
                              {errors[`traveler_${index}_lastName`] && (
                                <p className="text-red-400 text-sm mt-1">
                                  {errors[`traveler_${index}_lastName`]}
                                </p>
                              )}
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2">
                                Date of Birth *
                              </label>
                              <input
                                type="date"
                                value={traveler.dateOfBirth}
                                onChange={(e) => updateTraveler(index, 'dateOfBirth', e.target.value)}
                                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                              />
                              {errors[`traveler_${index}_dateOfBirth`] && (
                                <p className="text-red-400 text-sm mt-1">
                                  {errors[`traveler_${index}_dateOfBirth`]}
                                </p>
                              )}
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2">
                                Gender *
                              </label>
                              <select
                                value={traveler.gender}
                                onChange={(e) => updateTraveler(index, 'gender', e.target.value)}
                                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                              >
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      ))}
                      <button
                        onClick={addTraveler}
                        className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors mb-6"
                      >
                        <Plus className="w-5 h-5" />
                        <span>Add Another Traveler</span>
                      </button>
                      <button
                        onClick={() => setCurrentStep(2)}
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all flex items-center justify-center space-x-2"
                      >
                        <span>Continue to Travel Dates</span>
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    </motion.div>
                  )}
                  {}
                  {currentStep === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <h2 className="text-2xl font-bold text-white mb-6">Select Travel Dates</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Start Date *
                          </label>
                          <input
                            type="date"
                            value={travelDates.startDate}
                            onChange={(e) => setTravelDates(prev => ({ ...prev, startDate: e.target.value }))}
                            min={new Date().toISOString().split('T')[0]}
                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                          />
                          {errors.startDate && (
                            <p className="text-red-400 text-sm mt-1">{errors.startDate}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            End Date *
                          </label>
                          <input
                            type="date"
                            value={travelDates.endDate}
                            onChange={(e) => setTravelDates(prev => ({ ...prev, endDate: e.target.value }))}
                            min={travelDates.startDate || new Date().toISOString().split('T')[0]}
                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                          />
                          {errors.endDate && (
                            <p className="text-red-400 text-sm mt-1">{errors.endDate}</p>
                          )}
                        </div>
                      </div>
                      <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Special Requests (Optional)
                        </label>
                        <textarea
                          value={specialRequests}
                          onChange={(e) => setSpecialRequests(e.target.value)}
                          rows="4"
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                          placeholder="Any special requirements or dietary restrictions..."
                        />
                      </div>
                      <div className="flex space-x-4">
                        <button
                          onClick={() => setCurrentStep(1)}
                          className="flex-1 bg-gray-700 text-white py-4 rounded-xl font-semibold hover:bg-gray-600 transition-all flex items-center justify-center space-x-2"
                        >
                          <ArrowLeft className="w-5 h-5" />
                          <span>Back</span>
                        </button>
                        <button
                          onClick={handleBookingSubmit}
                          disabled={isSubmitting}
                          className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
                        >
                          {isSubmitting ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            <>
                              <span>Create Booking</span>
                              <ArrowRight className="w-5 h-5" />
                            </>
                          )}
                        </button>
                      </div>
                    </motion.div>
                  )}
                  {}
                  {currentStep === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <h2 className="text-2xl font-bold text-white mb-6">Complete Payment</h2>
                      <div className="text-center py-12">
                        <Package className="w-16 h-16 text-green-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-white mb-2">Booking Created Successfully!</h3>
                        <p className="text-gray-300 mb-6">
                          Your booking has been created. Complete payment to confirm.
                        </p>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setShowPayment(true)}
                          className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-green-600 hover:to-blue-700 transition-all"
                        >
                          Proceed to Payment
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            {}
            <div className="lg:col-span-1">
              <div className="glass-dark rounded-3xl p-6 border border-white/10 sticky top-8">
                <h3 className="text-xl font-bold text-white mb-4">Booking Summary</h3>
                {selectedPackage && (
                  <>
                    <div className="mb-4">
                      <img
                        src={selectedPackage.images?.[0] || '/css/images/package.jpg'}
                        alt={selectedPackage.name}
                        className="w-full h-32 object-cover rounded-xl mb-3"
                      />
                      <h4 className="font-semibold text-white">{selectedPackage.name}</h4>
                      <p className="text-gray-300 text-sm">
                        {selectedPackage.destination.city}, {selectedPackage.destination.country}
                      </p>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between text-gray-300">
                        <span>Base price per person:</span>
                        <span>₹{selectedPackage.pricing.basePrice.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-gray-300">
                        <span>Travelers:</span>
                        <span>{travelers.length} × ₹{selectedPackage.pricing.basePrice.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-gray-300">
                        <span>Taxes (18% GST):</span>
                        <span>₹{Math.round(selectedPackage.pricing.basePrice * travelers.length * 0.18).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-gray-300">
                        <span>Processing fees:</span>
                        <span>₹{(500 * travelers.length).toLocaleString()}</span>
                      </div>
                      <div className="border-t border-white/20 pt-2 mt-2">
                        <div className="flex justify-between text-lg font-bold text-white">
                          <span>Total:</span>
                          <span>₹{calculateTotal().toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    {travelDates.startDate && travelDates.endDate && (
                      <div className="mt-4 p-3 bg-white/5 rounded-lg">
                        <p className="text-sm text-gray-300">Travel Dates:</p>
                        <p className="font-medium text-white text-sm">
                          {new Date(travelDates.startDate).toLocaleDateString()} - {new Date(travelDates.endDate).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {}
      {showPayment && createdBooking && (
        <PaymentGateway
          booking={createdBooking}
          onPaymentSuccess={handlePaymentSuccess}
          onCancel={() => setShowPayment(false)}
        />
      )}
    </div>
  )
}
export default Checkout
