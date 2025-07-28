import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
  MapPin, 
  Star, 
  Users, 
  Calendar, 
  Filter, 
  Heart,
  Wifi,
  Car,
  Utensils,
  Waves,
  Dumbbell,
  Coffee,
  Shield,
  Phone,
  Loader2,
  X,
  ArrowRight,
  SortAsc
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { BookingService } from '../services/bookingService'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
import PageBackground from '../components/PageBackground'
const HotelCard = React.memo(({ hotel, index, onToggleFavorite, onBooking, favorites, amenityIcons }) => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  const animationProps = useMemo(() => {
    return isMobile ? {} : {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { delay: Math.min(index * 0.01, 0.05), duration: 0.15 }
    };
  }, [isMobile, index]);
  const handleImageError = useCallback((e) => {
    e.target.src = 'https://via.placeholder.com/400x400/1e293b/64748b?text=Hotel+Image';
  }, []);
  const handleToggleFavorite = useCallback(() => {
    onToggleFavorite(hotel.id);
  }, [onToggleFavorite, hotel.id]);
  const handleBooking = useCallback(() => {
    onBooking(hotel);
  }, [onBooking, hotel]);
  const handleQuickView = useCallback(() => {
    toast.info(`Quick view for ${hotel.name}`);
  }, [hotel.name]);
  return (
    <motion.div
      key={hotel.id}
      {...animationProps}
      className="glass-dark rounded-2xl lg:rounded-3xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-200 group"
    >
      <div className="relative h-32 sm:h-36 lg:h-40 overflow-hidden">
        <img 
          src={hotel.image} 
          alt={hotel.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          onError={handleImageError}
        />
        {hotel.discount > 0 && (
          <div className="absolute top-2 left-2 lg:top-4 lg:left-4 bg-red-500 text-white px-2 py-1 lg:px-3 lg:py-1 rounded-full text-xs lg:text-sm font-semibold">
            {hotel.discount}% OFF
          </div>
        )}
        <button
          onClick={handleToggleFavorite}
          className="absolute top-2 right-2 lg:top-4 lg:right-4 w-8 h-8 lg:w-10 lg:h-10 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20 hover:scale-110 transition-transform duration-200"
        >
          <Heart 
            className={`w-4 h-4 lg:w-5 lg:h-5 transition-colors ${
              favorites.includes(hotel.id) 
                ? 'text-red-500 fill-current' 
                : 'text-white'
            }`} 
          />
        </button>
        <div className="absolute bottom-2 left-2 lg:bottom-4 lg:left-4 bg-black/50 backdrop-blur-sm text-white px-2 py-1 lg:px-3 lg:py-1 rounded-full flex items-center space-x-1">
          <Star className="w-3 h-3 lg:w-4 lg:h-4 fill-yellow-400 text-yellow-400" />
          <span className="font-semibold text-xs lg:text-sm">{hotel.rating}</span>
          <span className="text-xs text-gray-300 hidden sm:inline">({hotel.reviews})</span>
        </div>
      </div>
      <div className="p-3 lg:p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-sm lg:text-lg font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-1">
            {hotel.name}
          </h3>
        </div>
        <div className="flex items-center text-gray-400 mb-2 lg:mb-3">
          <MapPin className="w-3 h-3 lg:w-4 lg:h-4 mr-1" />
          <span className="text-xs lg:text-sm">{hotel.location}</span>
        </div>
        <p className="text-gray-300 mb-3 lg:mb-4 text-xs lg:text-sm line-clamp-2">
          {hotel.description}
        </p>
        <div className="flex flex-wrap gap-1 lg:gap-2 mb-3 lg:mb-4">
          {hotel.amenities.slice(0, 3).map((amenity) => (
            <div 
              key={amenity}
              className="flex items-center space-x-1 bg-white/10 px-1.5 py-0.5 lg:px-2 lg:py-1 rounded text-xs text-gray-300"
            >
              <span className="w-3 h-3 lg:w-4 lg:h-4">{amenityIcons[amenity]}</span>
              <span className="capitalize hidden sm:inline">{amenity}</span>
            </div>
          ))}
          {hotel.amenities.length > 3 && (
            <div className="flex items-center space-x-1 bg-white/10 px-1.5 py-0.5 lg:px-2 lg:py-1 rounded text-xs text-gray-300">
              <span>+{hotel.amenities.length - 3}</span>
            </div>
          )}
        </div>
        <div className="flex flex-col space-y-2 lg:space-y-3">
          <div className="flex items-center space-x-2">
            {hotel.discount > 0 && (
              <span className="text-gray-400 line-through text-xs lg:text-sm">
                ₹{(hotel.price / (1 - hotel.discount / 100)).toFixed(0)}
              </span>
            )}
            <span className="text-lg lg:text-2xl font-bold text-white">
              ₹{hotel.price.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-xs lg:text-sm">per night</span>
            <div className="flex gap-2">
              <button
                onClick={handleQuickView}
                className="glass-button px-2 py-1 lg:px-3 lg:py-1.5 rounded-lg text-xs hover:scale-105 transition-transform duration-200"
              >
                View
              </button>
              <button
                onClick={handleBooking}
                className="neon-button px-3 py-1.5 lg:px-4 lg:py-2 rounded-lg lg:rounded-xl text-xs lg:text-sm hover:scale-105 transition-transform duration-200"
              >
                Book Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.hotel.id === nextProps.hotel.id &&
    prevProps.index === nextProps.index &&
    JSON.stringify(prevProps.favorites) === JSON.stringify(nextProps.favorites)
  );
});
const Hotels = React.memo(() => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [priceFilter, setPriceFilter] = useState('');
  const [starFilter, setStarFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [checkinDate, setCheckinDate] = useState('');
  const [checkoutDate, setCheckoutDate] = useState('');
  const [guests, setGuests] = useState(2);
  const [showAll, setShowAll] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('recommended'); // price-low, price-high, rating, recommended
  const [viewMode, setViewMode] = useState('grid'); // grid, list
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState(null);
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);
  useEffect(() => {

    const timer = setTimeout(() => setIsLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  const locations = useMemo(() => [
    'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 
    'Hyderabad', 'Pune', 'Goa', 'Jaipur', 'Kerala'
  ], [])
  const hotels = useMemo(() => [
    {
      id: 1,
      name: "The Taj Mahal Palace",
      location: "Mumbai",
      rating: 5,
      price: 15000,
      image: "https://cf.bstatic.com/xdata/images/hotel/square600/69114336.webp?k=87e79c63ed38cd14e821b0d5795fab5b397fa600fc0d433843493e6c53cf2f9c&o=",
      amenities: ['wifi', 'pool', 'gym', 'restaurant', 'spa', 'parking'],
      description: "Luxury heritage hotel overlooking the Arabian Sea",
      reviews: 1247,
      discount: 20
    },
    {
      id: 2,
      name: "The Maxwell Hotel",
      location: "Delhi",
      rating: 5,
      price: 12000,
      image: "https://cf.bstatic.com/xdata/images/hotel/square600/286152231.webp?k=01e7a0c9762023e8462bf3b236bee23160837b0a05409da7f36e33cb74e977a3&o=",
      amenities: ['wifi', 'pool', 'gym', 'restaurant', 'spa'],
      description: "Contemporary luxury in the heart of New Delhi",
      reviews: 892,
      discount: 15
    },
    {
      id: 3,
      name: "Kimpton Hotel",
      location: "Bangalore",
      rating: 4,
      price: 8000,
      image: "https://cf.bstatic.com/xdata/images/hotel/square600/318640538.webp?k=868d99c7ffeee2e38a4e8a9730f4b9859ec7aa22520aee23f5fc617f84783c1d&o=",
      amenities: ['wifi', 'gym', 'restaurant', 'parking'],
      description: "Modern business hotel with excellent connectivity",
      reviews: 654,
      discount: 10
    },
    {
      id: 4,
      name: "Staybridge Hotels",
      location: "Chennai",
      rating: 4,
      price: 7500,
      image: "https://cf.bstatic.com/xdata/images/hotel/square600/244539770.webp?k=8bf3b5bd69e6347c88771921df4749677b5f327107bb009c9967933342817ae6&o=",
      amenities: ['wifi', 'pool', 'restaurant', 'spa'],
      description: "Beachfront resort with stunning ocean views",
      reviews: 543,
      discount: 25
    },
    {
      id: 5,
      name: "Hoshino Hotels",
      location: "Kolkata",
      rating: 4,
      price: 6000,
      image: "https://images.pexels.com/photos/1134176/pexels-photo-1134176.jpeg?cs=srgb&dl=dug-out-pool-hotel-pool-1134176.jpg&fm=jpg",
      amenities: ['wifi', 'gym', 'restaurant', 'parking'],
      description: "Boutique hotel in the cultural heart of Bengal",
      reviews: 432,
      discount: 12
    },
    {
      id: 6,
      name: "Taj Falaknuma Palace",
      location: "Hyderabad",
      rating: 5,
      price: 18000,
      image: "https://live.staticflickr.com/2672/3772148510_afec7bb14c_b.jpg",
      amenities: ['wifi', 'pool', 'gym', 'restaurant', 'spa', 'parking'],
      description: "Royal palace hotel with unparalleled luxury",
      reviews: 765,
      discount: 18
    },
    {
      id: 7,
      name: "The Ritz Carlton",
      location: "Pune",
      rating: 5,
      price: 16000,
      image: "https://images.pexels.com/photos/2506988/pexels-photo-2506988.jpeg",
      amenities: ['wifi', 'pool', 'gym', 'restaurant', 'spa', 'parking'],
      description: "Sophisticated luxury hotel with world-class amenities",
      reviews: 987,
      discount: 22
    },
    {
      id: 8,
      name: "Grand Goa Resort",
      location: "Goa",
      rating: 4,
      price: 9500,
      image: "https://images.pexels.com/photos/261101/pexels-photo-261101.jpeg",
      amenities: ['wifi', 'pool', 'restaurant', 'spa', 'parking'],
      description: "Beachfront paradise with stunning sunset views",
      reviews: 678,
      discount: 30
    },
    {
      id: 9,
      name: "Rajputana Palace",
      location: "Jaipur",
      rating: 5,
      price: 13500,
      image: "https://images.pexels.com/photos/3155666/pexels-photo-3155666.jpeg",
      amenities: ['wifi', 'pool', 'gym', 'restaurant', 'spa'],
      description: "Royal heritage property with traditional Rajasthani architecture",
      reviews: 834,
      discount: 18
    },
    {
      id: 10,
      name: "Kerala Backwaters Resort",
      location: "Kerala",
      rating: 4,
      price: 8500,
      image: "https://images.pexels.com/photos/1134176/pexels-photo-1134176.jpeg",
      amenities: ['wifi', 'pool', 'restaurant', 'spa'],
      description: "Serene waterfront resort amidst tropical backwaters",
      reviews: 567,
      discount: 20
    },
    {
      id: 11,
      name: "The Oberoi New Delhi",
      location: "Delhi",
      rating: 5,
      price: 20000,
      image: "https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg",
      amenities: ['wifi', 'pool', 'gym', 'restaurant', 'spa', 'parking'],
      description: "Ultra-luxury hotel in the diplomatic enclave",
      reviews: 1156,
      discount: 15
    },
    {
      id: 12,
      name: "Conrad Bangalore",
      location: "Bangalore",
      rating: 5,
      price: 14000,
      image: "https://images.pexels.com/photos/2507007/pexels-photo-2507007.jpeg",
      amenities: ['wifi', 'pool', 'gym', 'restaurant', 'spa', 'parking'],
      description: "Contemporary elegance in the IT capital of India",
      reviews: 743,
      discount: 25
    }
  ], [])
  const amenityIcons = useMemo(() => ({
    wifi: <Wifi className="w-4 h-4" />,
    pool: <Waves className="w-4 h-4" />,
    gym: <Dumbbell className="w-4 h-4" />,
    restaurant: <Utensils className="w-4 h-4" />,
    spa: <Coffee className="w-4 h-4" />,
    parking: <Car className="w-4 h-4" />
  }), [])
  const filteredHotels = useMemo(() => {
    let filtered = hotels.filter(hotel => {
      const matchesSearch = hotel.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
                           hotel.location.toLowerCase().includes(debouncedSearchQuery.toLowerCase());
      const matchesLocation = selectedLocation === '' || hotel.location === selectedLocation;
      const matchesPrice = priceFilter === '' || 
        (priceFilter === 'under-5000' && hotel.price < 5000) ||
        (priceFilter === '5000-10000' && hotel.price >= 5000 && hotel.price <= 10000) ||
        (priceFilter === '10000-15000' && hotel.price >= 10000 && hotel.price <= 15000) ||
        (priceFilter === 'above-15000' && hotel.price > 15000);
      const matchesStar = starFilter === '' || hotel.rating === parseInt(starFilter);
      return matchesSearch && matchesLocation && matchesPrice && matchesStar;
    });

    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'recommended':
      default:
        filtered.sort((a, b) => (b.rating * b.reviews) - (a.rating * a.reviews));
        break;
    }
    return filtered;
  }, [hotels, debouncedSearchQuery, selectedLocation, priceFilter, starFilter, sortBy]);

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const displayedHotels = useMemo(() => {
    if (isMobile && !showAll && filteredHotels.length > 4) {
      return filteredHotels.slice(0, 4);
    }
    return filteredHotels;
  }, [filteredHotels, showAll, isMobile]);
  const toggleFavorite = useCallback((hotelId) => {
    setFavorites(prev => 
      prev.includes(hotelId) 
        ? prev.filter(id => id !== hotelId)
        : [...prev, hotelId]
    );
    toast.success(
      favorites.includes(hotelId) 
        ? 'Removed from favorites' 
        : 'Added to favorites'
    );
  }, [favorites]);
  const handleBooking = useCallback((hotel) => {
    if (!isAuthenticated) {
      toast.error('Please login to book hotels')
      navigate('/signin')
      return
    }
    if (!checkinDate || !checkoutDate) {
      toast.error('Please select check-in and check-out dates')
      return
    }
    try {

      const checkIn = new Date(checkinDate)
      const checkOut = new Date(checkoutDate)
      const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24))
      if (nights <= 0) {
        toast.error('Check-out date must be after check-in date')
        return
      }
      const totalPrice = hotel.price * nights

      const hotelBookingData = {
        id: hotel.id,
        name: hotel.name,
        price: totalPrice,
        originalPrice: hotel.price,
        duration: `${nights} nights`,
        category: 'hotels',
        location: hotel.location,
        image: hotel.image,
        description: `${hotel.name} in ${hotel.location} for ${nights} nights`,
        rating: hotel.rating || 4.5,
        dates: {
          checkIn: checkinDate,
          checkOut: checkoutDate
        },
        guests: guests,
        amenities: hotel.amenities || []
      }

      localStorage.setItem('tempHotelBooking', JSON.stringify(hotelBookingData))
      navigate(`/quick-payment?type=hotel&id=${hotel.id}`)
    } catch (error) {
      console.error('Error preparing hotel booking:', error)
      toast.error('Failed to prepare booking. Please try again.')
    }
  }, [isAuthenticated, navigate, checkinDate, checkoutDate, guests])
  const handleCancelBooking = useCallback((booking) => {
    setBookingToCancel(booking);
    setShowCancelModal(true);
  }, []);
  const confirmCancelBooking = useCallback(() => {
    if (bookingToCancel) {

      toast.success(`Booking for ${bookingToCancel.name} has been cancelled`);

      const savedBookings = JSON.parse(localStorage.getItem('userBookings') || '[]');
      const updatedBookings = savedBookings.filter(b => b.id !== bookingToCancel.id);
      localStorage.setItem('userBookings', JSON.stringify(updatedBookings));
      setShowCancelModal(false);
      setBookingToCancel(null);
    }
  }, [bookingToCancel]);
  const cancelCancelBooking = useCallback(() => {
    setShowCancelModal(false);
    setBookingToCancel(null);
  }, []);
  useEffect(() => {

    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(today.getDate() + 1)
    const dayAfter = new Date(today)
    dayAfter.setDate(today.getDate() + 2)
    setCheckinDate(tomorrow.toISOString().split('T')[0])
    setCheckoutDate(dayAfter.toISOString().split('T')[0])
  }, [])
  return (
    <PageBackground variant="hotels" className="pt-20">
      {}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative py-12 lg:py-20 px-4"
      >
        <div className="container mx-auto text-center relative z-10">
          <motion.h1 
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-5xl md:text-7xl font-bold text-white mb-6 bg-gradient-to-r from-teal-400 to-orange-400 bg-clip-text text-transparent"
          >
            Luxury Hotels
          </motion.h1>
          <motion.p 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto"
          >
            Discover exceptional accommodations that redefine comfort and elegance
          </motion.p>
        </div>
      </motion.section>
      {}
      <motion.section 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="px-4 mb-8"
      >
        <div className="container mx-auto">
          <div className="glass-dark rounded-3xl p-8 border border-white/10">
            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {}
              <div className="md:col-span-2 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search hotels or locations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                />
              </div>
              {}
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="date"
                  value={checkinDate}
                  onChange={(e) => setCheckinDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                />
              </div>
              {}
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="date"
                  value={checkoutDate}
                  onChange={(e) => setCheckoutDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                />
              </div>
              {}
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={guests}
                  onChange={(e) => setGuests(parseInt(e.target.value))}
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent appearance-none"
                >
                  {[1,2,3,4,5,6].map(num => (
                    <option key={num} value={num} className="bg-slate-800">
                      {num} Guest{num > 1 ? 's' : ''}
                    </option>
                  ))}
                </select>
              </div>
              {}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="neon-button flex items-center justify-center space-x-2 px-4 py-3 rounded-xl hover:scale-105 transition-transform duration-200"
              >
                <Filter className="w-5 h-5" />
                <span>Filters</span>
              </button>
            </div>
            {}
            <div className="flex flex-wrap items-center justify-between mt-4 gap-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <SortAsc className="w-4 h-4 text-gray-400" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="recommended" className="bg-slate-800">Recommended</option>
                    <option value="price-low" className="bg-slate-800">Price: Low to High</option>
                    <option value="price-high" className="bg-slate-800">Price: High to Low</option>
                    <option value="rating" className="bg-slate-800">Highest Rated</option>
                  </select>
                </div>
              </div>
              <div className="text-sm text-gray-400">
                {filteredHotels.length} hotel{filteredHotels.length !== 1 ? 's' : ''} found
              </div>
            </div>
            {}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mt-6 pt-6 border-t border-white/10"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {}
                    <div>
                      <label className="block text-gray-300 mb-2">Location</label>
                      <select
                        value={selectedLocation}
                        onChange={(e) => setSelectedLocation(e.target.value)}
                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                      >
                        <option value="" className="bg-slate-800">All Locations</option>
                        {locations.map(location => (
                          <option key={location} value={location} className="bg-slate-800">
                            {location}
                          </option>
                        ))}
                      </select>
                    </div>
                    {}
                    <div>
                      <label className="block text-gray-300 mb-2">Price Range</label>
                      <select
                        value={priceFilter}
                        onChange={(e) => setPriceFilter(e.target.value)}
                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                      >
                        <option value="" className="bg-slate-800">All Prices</option>
                        <option value="under-5000" className="bg-slate-800">Under ₹5,000</option>
                        <option value="5000-10000" className="bg-slate-800">₹5,000 - ₹10,000</option>
                        <option value="10000-15000" className="bg-slate-800">₹10,000 - ₹15,000</option>
                        <option value="above-15000" className="bg-slate-800">Above ₹15,000</option>
                      </select>
                    </div>
                    {}
                    <div>
                      <label className="block text-gray-300 mb-2">Star Rating</label>
                      <select
                        value={starFilter}
                        onChange={(e) => setStarFilter(e.target.value)}
                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                      >
                        <option value="" className="bg-slate-800">All Ratings</option>
                        <option value="3" className="bg-slate-800">3 Star</option>
                        <option value="4" className="bg-slate-800">4 Star</option>
                        <option value="5" className="bg-slate-800">5 Star</option>
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.section>
      {}
      <section className="px-4 pb-12 lg:pb-20">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl lg:text-3xl font-bold text-white">
              {displayedHotels.length} Hotels {displayedHotels.length !== filteredHotels.length ? `of ${filteredHotels.length}` : ''} Found
            </h2>
            <div className="hidden md:flex text-gray-400 text-sm">
              Showing best matches for your search
            </div>
          </div>
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <LoadingSpinner />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 lg:gap-4">
              {displayedHotels.map((hotel, index) => (
                <HotelCard
                  key={hotel.id}
                  hotel={hotel}
                  index={index}
                  onToggleFavorite={toggleFavorite}
                  onBooking={handleBooking}
                  favorites={favorites}
                  amenityIcons={amenityIcons}
                />
              ))}
            </div>
          )}
          {}
          {favorites.length > 0 && (
            <div className="mt-8 p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-500/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Heart className="w-5 h-5 text-red-500 fill-current" />
                  <span className="text-white font-medium">You have {favorites.length} favorite hotel{favorites.length !== 1 ? 's' : ''}</span>
                </div>
                <button
                  onClick={() => {
                    setSelectedLocation('');
                    setPriceFilter('');
                    setStarFilter('');
                    setSearchQuery('');

                  }}
                  className="text-purple-400 hover:text-purple-300 text-sm transition-colors"
                >
                  View Favorites
                </button>
              </div>
            </div>
          )}
          {}
          {isMobile && !showAll && filteredHotels.length > 4 && (
            <div className="flex justify-center mt-8">
              <button
                onClick={() => setShowAll(true)}
                className="neon-button px-8 py-3 rounded-xl hover:scale-105 transition-transform duration-200"
              >
                Show All {filteredHotels.length} Hotels
              </button>
            </div>
          )}
          {filteredHotels.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-white mb-2">No Hotels Found</h3>
              <p className="text-gray-400 mb-6">Try adjusting your filters or search terms</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedLocation('');
                  setPriceFilter('');
                  setStarFilter('');
                }}
                className="neon-button px-8 py-3 rounded-xl hover:scale-105 transition-transform duration-200"
              >
                Clear Filters
              </button>
            </motion.div>
          )}
        </div>
      </section>
      {}
      <motion.section 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="px-4 pb-20"
      >
        <div className="container mx-auto">
          <div className="glass-dark rounded-3xl p-8 text-center border border-white/10">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Shield className="w-8 h-8 text-white" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-white mb-4">Need Help Booking?</h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Our travel experts are available 24/7 to help you find the perfect accommodation. 
              Get personalized recommendations and exclusive deals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:+91-9876543210"
                className="neon-button inline-flex items-center px-8 py-3 rounded-xl hover:scale-105 transition-transform duration-200"
              >
                <Phone className="w-5 h-5 mr-2" />
                Call Now: +91-9876543210
              </a>
              <button
                className="glass-button px-8 py-3 rounded-xl hover:scale-105 transition-transform duration-200"
              >
                Live Chat Support
              </button>
            </div>
          </div>
        </div>
      </motion.section>
      {}
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
                <span className="font-semibold">{bookingToCancel?.name}</span>?
                This action cannot be undone.
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
    </PageBackground>
  )
})
export default Hotels
