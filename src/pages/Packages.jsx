import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { 
  Search, 
  MapPin, 
  Star, 
  Calendar, 
  Users, 
  Camera,
  Mountain,
  Waves,
  TreePine,
  ArrowRight,
  Heart,
  Filter,
  Loader2,
  X
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { bookingService } from '../services/bookingService'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
import PageBackground from '../components/PageBackground'
import toast from 'react-hot-toast'
const PackageCard = React.memo(({ pkg, index, onToggleFavorite, onBooking, favorites }) => (
  <motion.div
    key={pkg.id}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ delay: Math.min(index * 0.01, 0.05), duration: 0.2 }}
    className="glass-dark rounded-2xl lg:rounded-3xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-200 group"
  >
    <div className="relative h-32 sm:h-36 lg:h-48 overflow-hidden">
      <img 
        src={pkg.image} 
        alt={pkg.name}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        loading="lazy"
        onError={(e) => {
          e.target.src = 'https://via.placeholder.com/400x400/1e293b/64748b?text=Adventure+Package'
        }}
      />
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => onToggleFavorite(pkg.id)}
        className="absolute top-2 right-2 lg:top-4 lg:right-4 w-8 h-8 lg:w-10 lg:h-10 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20"
      >
        <Heart 
          className={`w-4 h-4 lg:w-5 lg:h-5 transition-colors ${
            favorites.includes(pkg.id) 
              ? 'text-red-500 fill-current' 
              : 'text-white'
          }`} 
        />
      </motion.button>
      <div className="absolute bottom-2 left-2 lg:bottom-4 lg:left-4 bg-black/50 backdrop-blur-sm text-white px-2 py-1 lg:px-3 lg:py-1 rounded-full flex items-center space-x-1">
        <Star className="w-3 h-3 lg:w-4 lg:h-4 fill-yellow-400 text-yellow-400" />
        <span className="font-semibold text-xs lg:text-sm">{pkg.rating}</span>
      </div>
      <div className="absolute top-2 left-2 lg:top-4 lg:left-4 bg-blue-500/90 text-white px-2 py-1 lg:px-3 lg:py-1 rounded-full text-xs lg:text-sm font-semibold">
        {pkg.duration}
      </div>
    </div>
    <div className="p-3 lg:p-4">
      <h3 className="text-sm lg:text-lg font-bold text-white mb-1 lg:mb-2 group-hover:text-blue-400 transition-colors line-clamp-1">
        {pkg.name}
      </h3>
      <p className="text-gray-300 mb-2 lg:mb-3 text-xs lg:text-sm line-clamp-2">
        {pkg.description}
      </p>
      <div className="flex items-center justify-between mb-3 lg:mb-6">
        <div className="flex items-center space-x-2 lg:space-x-4 text-gray-400 text-xs lg:text-sm">
          <div className="flex items-center space-x-1">
            <Calendar className="w-3 h-3 lg:w-4 lg:h-4" />
            <span className="hidden sm:inline">{pkg.duration}</span>
          </div>
          <div className="flex items-center space-x-1">
            <MapPin className="w-3 h-3 lg:w-4 lg:h-4" />
            <span className="capitalize">{pkg.category}</span>
          </div>
        </div>
      </div>
      <div className="mb-3 lg:mb-4">
        <span className="text-lg lg:text-3xl font-bold text-white">
          ₹{pkg.price.toLocaleString()}
        </span>
        <span className="text-gray-400 text-xs lg:text-sm block">per person</span>
      </div>
      <div className="space-y-2 lg:space-y-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onBooking(pkg)}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-2 lg:py-3 px-4 lg:px-6 rounded-lg lg:rounded-xl flex items-center justify-center space-x-2 transition-all duration-300 shadow-lg hover:shadow-xl text-xs lg:text-sm"
        >
          <span>Book Now</span>
          <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          as={Link}
          to={pkg.gallery}
          className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/40 py-2 lg:py-2.5 px-3 lg:px-4 rounded-lg flex items-center justify-center space-x-2 transition-all duration-300 text-xs lg:text-sm"
        >
          <Camera className="w-3 h-3 lg:w-4 lg:h-4" />
          <span className="font-medium">Gallery</span>
        </motion.button>
      </div>
    </div>
  </motion.div>
))
const Packages = React.memo(() => {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [favorites, setFavorites] = useState([])
  const [showAll, setShowAll] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchTerm])
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    const searchFromUrl = searchParams.get('search')
    if (searchFromUrl) {
      setSearchTerm(searchFromUrl)
    }

    const timer = setTimeout(() => setIsLoading(false), 300)
    return () => clearTimeout(timer)
  }, [searchParams])

  const packages = useMemo(() => ({
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
      },
      {
        id: 'maldives',
        name: 'Maldives Paradise',
        image: '/css/images/aurora.jpg',
        description: 'Crystal clear waters and overwater bungalows. Perfect for honeymoons and luxury beach experiences with world-class diving.',
        gallery: '/maldives',
        price: 75000,
        duration: '6 Days',
        rating: 4.9,
        category: 'seas'
      },
      {
        id: 'bali',
        name: 'Bali Beach Escape',
        image: '/css/images/paris.jpg',
        description: 'Tropical paradise with stunning beaches, vibrant culture, and amazing surf spots. Experience the beauty of Indonesian islands.',
        gallery: '/bali',
        price: 40000,
        duration: '5 Days',
        rating: 4.7,
        category: 'seas'
      },
      {
        id: 'seychelles',
        name: 'Seychelles Islands',
        image: '/css/images/swit.jpg',
        description: 'Pristine beaches with unique granite formations. Home to rare wildlife and some of the world\'s most beautiful coral reefs.',
        gallery: '/seychelles',
        price: 95000,
        duration: '8 Days',
        rating: 4.8,
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
      },
      {
        id: 'alps',
        name: 'Swiss Alps Adventure',
        image: '/css/images/Mountain.jpg',
        description: 'Majestic peaks and pristine alpine lakes. Experience world-class skiing, hiking, and breathtaking mountain vistas in Switzerland.',
        gallery: '/alps',
        price: 78000,
        duration: '10 Days',
        rating: 4.9,
        category: 'mountains'
      },
      {
        id: 'rockies',
        name: 'Canadian Rockies',
        image: '/css/images/caves2.jpg',
        description: 'Towering peaks and turquoise lakes. Discover the raw beauty of Banff and Jasper National Parks with incredible wildlife.',
        gallery: '/rockies',
        price: 68000,
        duration: '9 Days',
        rating: 4.8,
        category: 'mountains'
      },
      {
        id: 'patagonia',
        name: 'Patagonia Expedition',
        image: '/css/images/fuji2.jpg',
        description: 'Remote wilderness at the end of the world. Trek through dramatic landscapes with glaciers, mountains, and unique wildlife.',
        gallery: '/patagonia',
        price: 95000,
        duration: '14 Days',
        rating: 4.9,
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
      },
      {
        id: 'sahara',
        name: 'Sahara Desert',
        image: '/css/images/dayb.jpg',
        description: 'The world\'s largest hot desert. Experience camel trekking, oasis camping, and breathtaking sunsets over endless sand dunes.',
        gallery: '/sahara',
        price: 48000,
        duration: '7 Days',
        rating: 4.6,
        category: 'landscapes'
      },
      {
        id: 'tuscany',
        name: 'Tuscany Countryside',
        image: '/css/images/daya.jpg',
        description: 'Rolling hills, vineyards, and charming medieval towns. Discover the heart of Italy with wine tasting and cultural experiences.',
        gallery: '/tuscany',
        price: 52000,
        duration: '8 Days',
        rating: 4.7,
        category: 'landscapes'
      },
      {
        id: 'madagascar',
        name: 'Madagascar Wildlife',
        image: '/css/images/andaman2.jpg',
        description: 'Unique island biodiversity with lemurs, baobab trees, and diverse ecosystems. A naturalist\'s paradise with endemic species.',
        gallery: '/madagascar',
        price: 72000,
        duration: '10 Days',
        rating: 4.8,
        category: 'landscapes'
      }
    ]
  }), []) // Close useMemo for packages

  const allPackages = useMemo(() => [
    ...packages.seas, 
    ...packages.mountains, 
    ...packages.landscapes
  ], [packages])
  const filteredPackages = useMemo(() => {
    return allPackages.filter(pkg => {
      const matchesSearch = pkg.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                           pkg.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      const matchesCategory = selectedCategory === 'all' || pkg.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [allPackages, debouncedSearchTerm, selectedCategory])

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const displayedPackages = useMemo(() => {
    if (isMobile && !showAll && filteredPackages.length > 6) {
      return filteredPackages.slice(0, 6)
    }
    return filteredPackages
  }, [filteredPackages, showAll, isMobile])

  const categories = useMemo(() => [
    { id: 'all', name: 'All Packages', icon: <Filter className="w-5 h-5" /> },
    { id: 'seas', name: 'Seas & Beaches', icon: <Waves className="w-5 h-5" /> },
    { id: 'mountains', name: 'Mountains', icon: <Mountain className="w-5 h-5" /> },
    { id: 'landscapes', name: 'Landscapes', icon: <TreePine className="w-5 h-5" /> }
  ], [])
  const toggleFavorite = useCallback((packageId) => {
    setFavorites(prev => 
      prev.includes(packageId) 
        ? prev.filter(id => id !== packageId)
        : [...prev, packageId]
    )
    toast.success(favorites.includes(packageId) ? 'Removed from favorites' : 'Added to favorites')
  }, [favorites])
  const handleBooking = useCallback((pkg) => {
    if (!isAuthenticated) {
      toast.error('Please login to book packages')
      navigate('/signin')
      return
    }

    navigate(`/quick-payment?package=${pkg.id}`)
  }, [isAuthenticated, navigate])

  const PackageCard = React.memo(({ pkg, index, onToggleFavorite, onBooking, favorites }) => (
    <motion.div
      key={pkg.id}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ delay: index * 0.05 }} // Reduced delay for faster animation
      className="glass-dark rounded-3xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-300 group"
    >
      {}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={pkg.image} 
          alt={pkg.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" // Reduced duration
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x400/1e293b/64748b?text=Adventure+Package'
          }}
        />
        {}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onToggleFavorite(pkg.id)}
          className="absolute top-4 right-4 w-10 h-10 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20"
        >
          <Heart 
            className={`w-5 h-5 transition-colors ${
              favorites.includes(pkg.id) 
                ? 'text-red-500 fill-current' 
                : 'text-white'
            }`} 
          />
        </motion.button>
        {}
        <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full flex items-center space-x-1">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="font-semibold">{pkg.rating}</span>
        </div>
        {}
        <div className="absolute top-4 left-4 bg-blue-500/90 text-white px-3 py-1 rounded-full text-sm font-semibold">
          {pkg.duration}
        </div>
      </div>
      {}
      <div className="p-4">
        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
          {pkg.name}
        </h3>
        <p className="text-gray-300 mb-3 text-sm line-clamp-2">
          {pkg.description}
        </p>
        {}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4 text-gray-400 text-sm">
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>{pkg.duration}</span>
            </div>
            <div className="flex items-center space-x-1">
              <MapPin className="w-4 h-4" />
              <span>{pkg.category}</span>
            </div>
          </div>
        </div>
        {}
        <div className="mb-4">
          <span className="text-3xl font-bold text-white">
            ₹{pkg.price.toLocaleString()}
          </span>
          <span className="text-gray-400 text-sm block">per person</span>
        </div>
        {}
        <div className="space-y-3">
          {}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onBooking(pkg)}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl flex items-center justify-center space-x-2 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <span>Book Now</span>
            <ArrowRight className="w-5 h-5" />
          </motion.button>
          {}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(`/${pkg.gallery}`)}
            className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/30 font-medium py-2 px-4 rounded-xl flex items-center justify-center space-x-2 transition-all duration-300"
          >
            <Camera className="w-4 h-4" />
            <span>View Gallery</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  ))
  if (isLoading) {
    return <LoadingSpinner fullScreen text="Loading amazing packages..." variant="plane" />
  }
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <ErrorMessage
          title="Failed to load packages"
          message={error}
          onRetry={() => {
            setError(null)
            setIsLoading(true)
            const timer = setTimeout(() => setIsLoading(false), 500)
            return () => clearTimeout(timer)
          }}
          showHomeButton
        />
      </div>
    )
  }
  return (
    <PageBackground variant="packages" className="pt-16 sm:pt-20">
      {}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8"
      >
        <div className="container mx-auto text-center relative z-10">
          <motion.h1 
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-4 sm:mb-6 bg-gradient-to-r from-teal-400 to-orange-400 bg-clip-text text-transparent"
          >
            Adventure Packages
          </motion.h1>
          <motion.p 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg lg:text-xl text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto px-4"
          >
            Discover extraordinary destinations and create memories that last a lifetime
          </motion.p>
        </div>
      </motion.section>
      {}
      <motion.section 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="px-4 sm:px-6 lg:px-8 mb-6 sm:mb-8"
      >
        <div className="container mx-auto">
          <div className="glass-dark rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-white/10">
            {}
            <div className="relative mb-6 sm:mb-8">
              <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 sm:w-6 sm:h-6" />
              <input
                type="text"
                placeholder="Search packages by name or destination..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 bg-white/5 border border-white/20 rounded-xl sm:rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-sm sm:text-base lg:text-lg"
              />
            </div>
            {}
            <div className="flex flex-wrap gap-2 sm:gap-4 justify-center">
              {categories.map(category => (
                <motion.button
                  key={category.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 lg:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl transition-all duration-300 text-xs sm:text-sm lg:text-base ${
                    selectedCategory === category.id
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg glow'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20 border border-white/20'
                  }`}
                >
                  <span className="w-4 h-4 sm:w-5 sm:h-5">{category.icon}</span>
                  <span className="font-medium hidden sm:inline">{category.name}</span>
                  <span className="font-medium sm:hidden">{category.name.split(' ')[0]}</span>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </motion.section>
      {}
      <section className="px-4 pb-12 lg:pb-20">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-white">
              {displayedPackages.length} Package{displayedPackages.length !== 1 ? 's' : ''} {displayedPackages.length !== filteredPackages.length ? `of ${filteredPackages.length}` : ''} Found
            </h2>
            <div className="text-gray-400">
              {selectedCategory !== 'all' && `Filtered by ${categories.find(c => c.id === selectedCategory)?.name}`}
            </div>
          </div>
          <AnimatePresence>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 lg:gap-6">
              {displayedPackages.map((pkg, index) => (
                <PackageCard
                  key={pkg.id}
                  pkg={pkg}
                  index={index}
                  onToggleFavorite={toggleFavorite}
                  onBooking={handleBooking}
                  favorites={favorites}
                />
              ))}
            </div>
            {}
            {window.innerWidth < 768 && !showAll && filteredPackages.length > 8 && (
              <div className="flex justify-center mt-8">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowAll(true)}
                  className="neon-button px-8 py-3 rounded-xl"
                >
                  Show All {filteredPackages.length} Packages
                </motion.button>
              </div>
            )}
          </AnimatePresence>
          {}
          {filteredPackages.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-white mb-2">No Packages Found</h3>
              <p className="text-gray-400 mb-6">Try adjusting your search or filters</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setSearchTerm('')
                  setSelectedCategory('all')
                }}
                className="neon-button px-8 py-3 rounded-xl"
              >
                Clear Filters
              </motion.button>
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
            <h3 className="text-3xl font-bold text-white mb-6">Need Help Choosing?</h3>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Our travel experts are here to help you plan your perfect adventure. Get personalized recommendations and expert advice.
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/contact"
                className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <span>Contact Our Experts</span>
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.section>
    </PageBackground>
  )
})
export default Packages
