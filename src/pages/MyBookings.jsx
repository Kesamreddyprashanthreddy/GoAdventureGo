import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Calendar, 
  Users, 
  MapPin, 
  Clock,
  CreditCard,
  Package,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Download,
  Loader2,
  RefreshCw,
  Filter,
  Search,
  ArrowRight,
  Plane,
  Star,
  ChevronDown,
  Hotel,
  Building,
  X
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import api from '../services/api'
import { bookingService } from '../services/bookingService'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
import toast from 'react-hot-toast'
const MyBookings = () => {
  const { user } = useAuth()
  const [bookings, setBookings] = useState([])
  const [filteredBookings, setFilteredBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterType, setFilterType] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [showDetails, setShowDetails] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [bookingToCancel, setBookingToCancel] = useState(null)
  useEffect(() => {
    fetchBookings()
  }, [])
  useEffect(() => {
    filterBookings()
  }, [bookings, filterStatus, filterType, searchTerm])
  const fetchBookings = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('authToken')
      if (token) {
        try {
          const response = await api.get('/bookings', {
            headers: { Authorization: `Bearer ${token}` }
          })
          const bookingsData = response.data.data || response.data
          if (Array.isArray(bookingsData) && bookingsData.length > 0) {
            setBookings(bookingsData)
            setLoading(false)
            return
          }
        } catch (apiError) {
          console.log('API bookings not available, using local storage')
        }
      }
      const localBookings = bookingService.getBookings()
      if (localBookings.length === 0 && user) {
        console.log('Creating demo bookings for user:', user.firstName)
        bookingService.createDemoBookings()
        const newBookings = bookingService.getBookings()
        setBookings(newBookings)
      } else {
        setBookings(localBookings)
      }
    } catch (error) {
      console.error('Error fetching bookings:', error)
      setBookings([])
    }
    setLoading(false)
  }
  const filterBookings = () => {
    let filtered = bookings
    if (filterStatus !== 'all') {
      filtered = filtered.filter(booking => booking.status === filterStatus)
    } else {
      filtered = filtered.filter(booking => booking.status !== 'cancelled')
    }
    if (filterType !== 'all') {
      filtered = filtered.filter(booking => (booking.type || 'package') === filterType)
    }
    if (searchTerm) {
      filtered = filtered.filter(booking => 
        booking.bookingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.package?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.package?.destination?.city.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    setFilteredBookings(filtered)
  }
  const getBookingTypeIcon = (type) => {
    switch (type) {
      case 'flight': return <Plane className="w-5 h-5 text-blue-400" />
      case 'hotel': return <Building className="w-5 h-5 text-green-400" />
      default: return <Package className="w-5 h-5 text-purple-400" />
    }
  }
  const getBookingTypeColor = (type) => {
    switch (type) {
      case 'flight': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'hotel': return 'bg-green-500/20 text-green-400 border-green-500/30'
      default: return 'bg-purple-500/20 text-purple-400 border-purple-500/30'
    }
  }
  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'text-green-400 bg-green-400/20'
      case 'pending': return 'text-yellow-400 bg-yellow-400/20'
      case 'cancelled': return 'text-red-400 bg-red-400/20'
      case 'completed': return 'text-blue-400 bg-blue-400/20'
      default: return 'text-gray-400 bg-gray-400/20'
    }
  }
  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-400'
      case 'pending': return 'text-yellow-400'
      case 'failed': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }
  const handleCancelBooking = async (bookingId) => {
    const booking = bookings.find(b => b._id === bookingId);
    setBookingToCancel(booking);
    setShowCancelModal(true);
  }
  const confirmCancelBooking = async () => {
    if (!bookingToCancel) return;
    try {
      const token = localStorage.getItem('authToken')
      if (token) {
        try {
          await api.put(`/bookings/${bookingToCancel._id}/cancel`, 
            { reason: 'Cancelled by user' },
            { headers: { Authorization: `Bearer ${token}` } }
          )
        } catch (apiError) {
          console.log('API cancel failed, using local storage')
        }
      }
      if (bookingToCancel.bookingId) {
        bookingService.cancelBooking(bookingToCancel.bookingId)
      }
      toast.success('Booking cancelled successfully')
      setShowCancelModal(false);
      setBookingToCancel(null);
      fetchBookings()
    } catch (error) {
      console.error('Failed to cancel booking:', error)
      toast.error('Failed to cancel booking. Please try again.')
      setShowCancelModal(false);
      setBookingToCancel(null);
    }
  }
  const cancelCancelBooking = () => {
    setShowCancelModal(false);
    setBookingToCancel(null);
  }
  const BookingCard = ({ booking }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-dark rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all"
    >
      <div className="flex flex-col md:flex-row gap-4">
        {}
        <div className="md:w-48 h-32 rounded-xl overflow-hidden">
          <img
            src={booking.package?.images?.[0] || '/css/images/package.jpg'}
            alt={booking.package?.name}
            className="w-full h-full object-cover"
          />
        </div>
        {}
        <div className="flex-1">
          <div className="flex flex-col md:flex-row md:items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                {getBookingTypeIcon(booking.type)}
                <h3 className="text-xl font-bold text-white">
                  {booking.package?.name}
                </h3>
                <span className={`px-2 py-1 rounded-lg text-xs font-medium border ${getBookingTypeColor(booking.type)}`}>
                  {booking.type === 'flight' ? 'Flight' : booking.type === 'hotel' ? 'Hotel' : 'Package'}
                </span>
              </div>
              <p className="text-gray-400 mb-2">
                Booking ID: {booking.bookingId}
              </p>
              <div className="flex items-center text-gray-300 text-sm mb-2">
                <MapPin className="w-4 h-4 mr-1" />
                <span>
                  {booking.package?.destination?.city}, {booking.package?.destination?.country}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
              </span>
              <p className="text-white font-bold text-lg mt-2">
                ₹{booking.pricing?.totalPrice?.toLocaleString()}
              </p>
            </div>
          </div>
          {}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-300 mb-4">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              <div>
                <p className="text-xs">Start Date</p>
                <p className="font-medium">
                  {new Date(booking.travelDates?.startDate).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              <div>
                <p className="text-xs">End Date</p>
                <p className="font-medium">
                  {new Date(booking.travelDates?.endDate).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-2" />
              <div>
                <p className="text-xs">Travelers</p>
                <p className="font-medium">{booking.travelers?.length} person(s)</p>
              </div>
            </div>
            <div className="flex items-center">
              <CreditCard className="w-4 h-4 mr-2" />
              <div>
                <p className="text-xs">Payment</p>
                <p className={`font-medium ${getPaymentStatusColor(booking.payment?.status)}`}>
                  {booking.payment?.status?.charAt(0).toUpperCase() + booking.payment?.status?.slice(1)}
                </p>
              </div>
            </div>
          </div>
          {}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                setSelectedBooking(booking)
                setShowDetails(true)
              }}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              <Eye className="w-4 h-4" />
              <span>View Details</span>
            </button>
            {booking.payment?.status === 'pending' && (
              <Link
                to={`/checkout?booking=${booking._id}`}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
              >
                <CreditCard className="w-4 h-4" />
                <span>Pay Now</span>
              </Link>
            )}
            {booking.status === 'confirmed' && (
              <button className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm">
                <Download className="w-4 h-4" />
                <span>Download</span>
              </button>
            )}
            {(booking.status === 'pending' || booking.status === 'confirmed') && (
              <button
                onClick={() => handleCancelBooking(booking._id)}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
              >
                <XCircle className="w-4 h-4" />
                <span>Cancel</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-400 mx-auto mb-4" />
          <p className="text-white text-lg">Loading your bookings...</p>
        </div>
      </div>
    )
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-20">
        {}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            My Bookings
          </h1>
          <p className="text-xl text-gray-300">
            Manage your travel bookings and adventures
          </p>
        </div>
        {}
        <div className="glass-dark rounded-2xl p-6 border border-white/10 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search bookings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            {}
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 bg-slate-800/80 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400 appearance-none cursor-pointer"
                style={{ 
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                  backgroundPosition: 'right 0.5rem center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '1.5em 1.5em',
                  paddingRight: '2.5rem'
                }}
              >
                <option value="all" className="bg-slate-800 text-white">All Status</option>
                <option value="pending" className="bg-slate-800 text-white">Pending</option>
                <option value="confirmed" className="bg-slate-800 text-white">Confirmed</option>
                <option value="completed" className="bg-slate-800 text-white">Completed</option>
                <option value="cancelled" className="bg-slate-800 text-white">Cancelled</option>
              </select>
            </div>
            {}
            <div className="flex items-center space-x-2">
              <Package className="w-5 h-5 text-gray-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-3 bg-slate-800/80 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400 appearance-none cursor-pointer"
                style={{ 
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                  backgroundPosition: 'right 0.5rem center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '1.5em 1.5em',
                  paddingRight: '2.5rem'
                }}
              >
                <option value="all" className="bg-slate-800 text-white">All Types</option>
                <option value="package" className="bg-slate-800 text-white">Packages</option>
                <option value="hotel" className="bg-slate-800 text-white">Hotels</option>
                <option value="flight" className="bg-slate-800 text-white">Flights</option>
              </select>
            </div>
            {}
            <button
              onClick={fetchBookings}
              className="flex items-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
              <span>Refresh</span>
            </button>
          </div>
        </div>
        {}
        {filteredBookings.length === 0 ? (
          <div className="text-center py-20">
            <Package className="w-20 h-20 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">No Bookings Found</h3>
            <p className="text-gray-400 mb-6">
              {bookings.length === 0 
                ? "You haven't made any bookings yet. Start exploring our amazing packages!"
                : "No bookings match your current filters."
              }
            </p>
            <Link
              to="/packages"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all"
            >
              <span>Explore Packages</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredBookings.map((booking) => (
              <BookingCard key={booking._id} booking={booking} />
            ))}
          </div>
        )}
      </div>
      {}
      <AnimatePresence>
        {showDetails && selectedBooking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowDetails(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-white/10">
                <h2 className="text-2xl font-bold text-white">Booking Details</h2>
                <p className="text-gray-400">ID: {selectedBooking.bookingId}</p>
              </div>
              <div className="p-6 space-y-6">
                {}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Package Information</h3>
                  <div className="bg-white/5 rounded-xl p-4">
                    <h4 className="font-semibold text-white">{selectedBooking.package?.name}</h4>
                    <p className="text-gray-300">
                      {selectedBooking.package?.destination?.city}, {selectedBooking.package?.destination?.country}
                    </p>
                  </div>
                </div>
                {}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Travelers</h3>
                  <div className="space-y-2">
                    {selectedBooking.travelers?.map((traveler, index) => (
                      <div key={index} className="bg-white/5 rounded-xl p-4">
                        <p className="font-medium text-white">
                          {traveler.firstName} {traveler.lastName}
                        </p>
                        <p className="text-gray-300 text-sm">
                          {traveler.gender} • Born: {traveler.dateOfBirth ? new Date(traveler.dateOfBirth).toLocaleDateString() : 'N/A'}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
                {}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Travel Dates</h3>
                  <div className="bg-white/5 rounded-xl p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-300 text-sm">Start Date</p>
                        <p className="font-medium text-white">
                          {new Date(selectedBooking.travelDates?.startDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-300 text-sm">End Date</p>
                        <p className="font-medium text-white">
                          {new Date(selectedBooking.travelDates?.endDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                {}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Payment Information</h3>
                  <div className="bg-white/5 rounded-xl p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-300 text-sm">Total Amount</p>
                        <p className="font-bold text-white text-lg">
                          ₹{selectedBooking.pricing?.totalPrice?.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-300 text-sm">Payment Status</p>
                        <p className={`font-medium ${getPaymentStatusColor(selectedBooking.payment?.status)}`}>
                          {selectedBooking.payment?.status?.charAt(0).toUpperCase() + selectedBooking.payment?.status?.slice(1)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6 border-t border-white/10">
                <button
                  onClick={() => setShowDetails(false)}
                  className="w-full bg-gray-700 text-white py-3 rounded-xl hover:bg-gray-600 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {}
      <AnimatePresence>
        {showCancelModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={cancelCancelBooking}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                  <X className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Cancel Booking
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  Are you sure you want to cancel your booking for{' '}
                  <span className="font-semibold">{bookingToCancel?.package?.name || bookingToCancel?.title}</span>?
                  This action cannot be undone and may incur cancellation charges.
                </p>
                <div className="flex gap-3">
                  <button
                    type="button"
                    className="flex-1 inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                    onClick={cancelCancelBooking}
                  >
                    Keep Booking
                  </button>
                  <button
                    type="button"
                    className="flex-1 inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                    onClick={confirmCancelBooking}
                  >
                    Cancel Booking
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
export default MyBookings
