import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'
import { 
  Search, 
  MapPin, 
  Calendar, 
  Users, 
  Plane, 
  Clock, 
  ArrowUpDown,
  Filter,
  Star,
  Wifi,
  Coffee,
  Monitor,
  Utensils,
  Zap,
  Loader2,
  ArrowRight,
  Heart,
  AlertCircle
} from 'lucide-react'
import PageBackground from '../components/PageBackground'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
const FlightCard = React.memo(({ flight, index, onBooking, amenityIcons }) => (
  <motion.div
    key={flight.id}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.05, duration: 0.3 }}
    className="glass-dark rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300"
  >
    <div className="flex flex-col md:flex-row items-center justify-between">
      {}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
        {}
        <div className="text-center md:text-left">
          <h3 className="text-xl font-bold text-white">{flight.airline}</h3>
          <p className="text-gray-400">{flight.flightNumber}</p>
          <p className="text-sm text-gray-500">{flight.aircraft}</p>
        </div>
        {}
        <div className="flex items-center space-x-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-white">{flight.departure.time}</p>
            <p className="text-gray-400">{flight.departure.airport}</p>
          </div>
          <div className="flex-1 flex flex-col items-center">
            <Plane className="w-6 h-6 text-blue-400 mb-1" />
            <div className="w-full h-px bg-gray-600"></div>
            <p className="text-sm text-gray-400 mt-1">{flight.duration}</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-white">{flight.arrival.time}</p>
            <p className="text-gray-400">{flight.arrival.airport}</p>
          </div>
        </div>
        {}
        <div className="text-center">
          <p className="text-white font-semibold">{flight.stops}</p>
          <p className="text-gray-400">{flight.class}</p>
          <div className="flex items-center justify-center mt-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
            <span className="text-yellow-400">{flight.rating}</span>
          </div>
        </div>
        {}
        <div className="text-center">
          <p className="text-3xl font-bold text-white">₹{flight.price.toLocaleString()}</p>
          <p className="text-gray-400 text-sm">per person</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onBooking(flight)}
            className="neon-button px-6 py-2 rounded-xl mt-2 w-full"
          >
            Select Flight
          </motion.button>
        </div>
      </div>
    </div>
    {}
    <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-white/10">
      {flight.amenities.map((amenity) => (
        <div 
          key={amenity}
          className="flex items-center space-x-1 bg-white/10 px-3 py-1 rounded-full text-sm text-gray-300"
        >
          {amenityIcons[amenity]}
          <span className="capitalize">{amenity}</span>
        </div>
      ))}
    </div>
  </motion.div>
))
const Flight = React.memo(() => {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    departure: '',
    arrival: '',
    departureDate: '',
    returnDate: '',
    passengers: 1,
    class: 'economy',
    tripType: 'roundtrip'
  })
  const [searchResults, setSearchResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [error, setError] = useState(null)
  const [favorites, setFavorites] = useState([])
  const [selectedFilter, setSelectedFilter] = useState('all')
  const airports = useMemo(() => [
    { code: 'DEL', name: 'New Delhi', city: 'Delhi' },
    { code: 'BOM', name: 'Mumbai', city: 'Mumbai' },
    { code: 'BLR', name: 'Bangalore', city: 'Bangalore' },
    { code: 'MAA', name: 'Chennai', city: 'Chennai' },
    { code: 'CCU', name: 'Kolkata', city: 'Kolkata' },
    { code: 'HYD', name: 'Hyderabad', city: 'Hyderabad' },
    { code: 'PNQ', name: 'Pune', city: 'Pune' },
    { code: 'GOI', name: 'Goa', city: 'Goa' }
  ], [])
  const sampleFlights = useMemo(() => [
    {
      id: 1,
      airline: 'Air India',
      flightNumber: 'AI 131',
      departure: { time: '06:30', airport: 'DEL', city: 'Delhi' },
      arrival: { time: '08:45', airport: 'BOM', city: 'Mumbai' },
      duration: '2h 15m',
      price: 8500,
      stops: 'Non-stop',
      class: 'Economy',
      amenities: ['wifi', 'meal', 'entertainment'],
      rating: 4.2,
      aircraft: 'Boeing 737'
    },
    {
      id: 2,
      airline: 'IndiGo',
      flightNumber: '6E 345',
      departure: { time: '09:15', airport: 'BOM', city: 'Mumbai' },
      arrival: { time: '12:30', airport: 'BLR', city: 'Bangalore' },
      duration: '1h 45m',
      price: 6200,
      stops: 'Non-stop',
      class: 'Economy',
      amenities: ['wifi', 'snack'],
      rating: 4.5,
      aircraft: 'Airbus A320'
    }
  ], [])
  const amenityIcons = useMemo(() => ({
    wifi: <Wifi className="w-4 h-4" />,
    meal: <Utensils className="w-4 h-4" />,
    entertainment: <Monitor className="w-4 h-4" />,
    snack: <Coffee className="w-4 h-4" />,
    priority: <Zap className="w-4 h-4" />
  }), [])
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }, [])
  const swapAirports = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      departure: prev.arrival,
      arrival: prev.departure
    }))
  }, [])
  const handleSearch = useCallback(async (e) => {
    e.preventDefault()
    if (!formData.departure || !formData.arrival || !formData.departureDate) {
      toast.error('Please fill in all required fields.')
      return
    }
    setIsLoading(true)
    setTimeout(() => {
      setSearchResults(sampleFlights)
      setIsLoading(false)
      toast.success(`Found ${sampleFlights.length} flights!`)
    }, 1000) // Reduced from 2000ms to 1000ms
  }, [formData.departure, formData.arrival, formData.departureDate, sampleFlights])
  const handleBooking = useCallback((flight) => {
    if (!isAuthenticated) {
      toast.error('Please login to book flights')
      navigate('/signin')
      return
    }
    try {
      const flightBookingData = {
        id: `flight-${flight.flightNumber}`,
        name: `${flight.airline} ${flight.flightNumber}`,
        price: flight.price,
        originalPrice: flight.price,
        duration: flight.duration,
        category: 'flights',
        from: formData.departure,
        to: formData.arrival,
        image: 'https://via.placeholder.com/400x300/1e293b/64748b?text=Flight+Booking',
        description: `${flight.airline} flight from ${formData.departure} to ${formData.arrival}`,
        rating: 4.5,
        dates: {
          departure: formData.departureDate,
          return: formData.tripType === 'roundtrip' ? formData.returnDate : null
        },
        passengers: formData.passengers,
        class: formData.class,
        airline: flight.airline,
        flightNumber: flight.flightNumber,
        departureTime: flight.departure.time,
        arrivalTime: flight.arrival.time
      }
      localStorage.setItem('tempFlightBooking', JSON.stringify(flightBookingData))
      navigate(`/quick-payment?type=flight&id=${flight.flightNumber}`)
    } catch (error) {
      console.error('Error preparing flight booking:', error)
      toast.error('Failed to prepare booking. Please try again.')
    }
  }, [isAuthenticated, navigate, formData])
  useEffect(() => {
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(today.getDate() + 1)
    const nextWeek = new Date(today)
    nextWeek.setDate(today.getDate() + 7)
    setFormData(prev => ({
      ...prev,
      departureDate: tomorrow.toISOString().split('T')[0],
      returnDate: nextWeek.toISOString().split('T')[0]
    }))
  }, [])
  return (
    <PageBackground variant="flights" className="pt-20">
      {}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative py-20 px-4"
      >
        <div className="container mx-auto text-center">
          <motion.h1 
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-5xl md:text-7xl font-bold text-white mb-6 bg-gradient-to-r from-teal-400 to-orange-400 bg-clip-text text-transparent"
          >
            Flight Booking
          </motion.h1>
          <motion.p 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto"
          >
            Find the best flights at unbeatable prices
          </motion.p>
        </div>
      </motion.section>
      {}
      <motion.section 
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="px-4 mb-8"
      >
        <div className="container mx-auto">
          <form onSubmit={handleSearch} className="glass-dark rounded-3xl p-8 border border-white/10">
            {}
            <div className="flex gap-4 mb-6">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="tripType"
                  value="roundtrip"
                  checked={formData.tripType === 'roundtrip'}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <span className="text-white">Round Trip</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="tripType"
                  value="oneway"
                  checked={formData.tripType === 'oneway'}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <span className="text-white">One Way</span>
              </label>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {}
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  name="departure"
                  value={formData.departure}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                >
                  <option value="" className="bg-slate-800">From</option>
                  {airports.map(airport => (
                    <option key={airport.code} value={airport.code} className="bg-slate-800">
                      {airport.city} ({airport.code})
                    </option>
                  ))}
                </select>
              </div>
              {}
              <div className="flex justify-center items-center lg:order-none order-5">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={swapAirports}
                  className="w-10 h-10 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center transition-colors"
                >
                  <ArrowUpDown className="w-5 h-5 text-white" />
                </motion.button>
              </div>
              {}
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  name="arrival"
                  value={formData.arrival}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                >
                  <option value="" className="bg-slate-800">To</option>
                  {airports.map(airport => (
                    <option key={airport.code} value={airport.code} className="bg-slate-800">
                      {airport.city} ({airport.code})
                    </option>
                  ))}
                </select>
              </div>
              {}
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="date"
                  name="departureDate"
                  value={formData.departureDate}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>
              {}
              {formData.tripType === 'roundtrip' && (
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="date"
                    name="returnDate"
                    value={formData.returnDate}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              )}
            </div>
            {}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  name="passengers"
                  value={formData.passengers}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  {[1,2,3,4,5,6,7,8,9].map(num => (
                    <option key={num} value={num} className="bg-slate-800">
                      {num} Passenger{num > 1 ? 's' : ''}
                    </option>
                  ))}
                </select>
              </div>
              <div className="relative">
                <select
                  name="class"
                  value={formData.class}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="economy" className="bg-slate-800">Economy</option>
                  <option value="premium" className="bg-slate-800">Premium Economy</option>
                  <option value="business" className="bg-slate-800">Business</option>
                  <option value="first" className="bg-slate-800">First Class</option>
                </select>
              </div>
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="neon-button flex items-center justify-center space-x-2 px-6 py-3 rounded-xl disabled:opacity-50"
              >
                <Search className="w-5 h-5" />
                <span>{isLoading ? 'Searching...' : 'Search Flights'}</span>
              </motion.button>
            </div>
          </form>
        </div>
      </motion.section>
      {}
      {searchResults.length > 0 && (
        <section className="px-4 pb-20">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-white mb-8">
              {searchResults.length} Flights Found
            </h2>
            <div className="space-y-6">
              {searchResults.map((flight, index) => (
                <FlightCard
                  key={flight.id}
                  flight={flight}
                  index={index}
                  onBooking={handleBooking}
                  amenityIcons={amenityIcons}
                />
              ))}
            </div>
          </div>
        </section>
      )}
      {}
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="glass-dark p-8 rounded-2xl text-center">
            <div className="animate-spin w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-white">Searching flights...</p>
          </div>
        </div>
      )}
    </PageBackground>
  )
})
export default Flight
