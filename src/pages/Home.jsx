import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, ArrowRight, Globe, Users, Star, Zap, Sparkles, Clock, TrendingUp, X, MapPin } from 'lucide-react'
import api from '../services/api'
import Hero3D from '../components/Hero3D'
const Home = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [filteredSuggestions, setFilteredSuggestions] = useState([])
  const [recentSearches, setRecentSearches] = useState([])
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1)
  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(false)
  const searchRef = useRef(null)
  const suggestionsRef = useRef(null)
  const navigate = useNavigate()
  const heroImages = [
    '/css/images/paris.jpg',
    '/css/images/swit.jpg',
    '/css/images/aurora.jpg'
  ]

  const allDestinations = [

    { name: 'Andaman and Nicobar', category: 'Beach', country: 'India', keywords: ['beach', 'island', 'tropical', 'diving'] },
    { name: 'Great Barrier Reef', category: 'Beach', country: 'Australia', keywords: ['reef', 'coral', 'diving', 'marine'] },
    { name: 'Blue Hole Caves', category: 'Adventure', country: 'Belize', keywords: ['cave', 'diving', 'underwater', 'mystery'] },

    { name: 'Mount Fuji', category: 'Mountain', country: 'Japan', keywords: ['mountain', 'volcano', 'hiking', 'sacred'] },
    { name: 'Himalayas', category: 'Mountain', country: 'Nepal', keywords: ['mountain', 'everest', 'trekking', 'adventure'] },
    { name: 'Iceland Peaks', category: 'Mountain', country: 'Iceland', keywords: ['glacier', 'volcano', 'northern lights', 'ice'] },

    { name: 'Paris', category: 'City', country: 'France', keywords: ['city', 'romance', 'art', 'culture', 'eiffel tower'] },
    { name: 'Swiss Alps', category: 'Mountain', country: 'Switzerland', keywords: ['alps', 'skiing', 'chocolate', 'scenic'] },
    { name: 'Amazon Rainforest', category: 'Nature', country: 'Brazil', keywords: ['jungle', 'wildlife', 'adventure', 'river'] },

    { name: 'Antelope Canyon', category: 'Desert', country: 'USA', keywords: ['desert', 'canyon', 'photography', 'rock formations'] },
    { name: 'Azores Islands', category: 'Island', country: 'Portugal', keywords: ['volcanic', 'island', 'hot springs', 'nature'] },

    { name: 'Bali', category: 'Beach', country: 'Indonesia', keywords: ['tropical', 'beach', 'culture', 'temple'] },
    { name: 'Maldives', category: 'Beach', country: 'Maldives', keywords: ['luxury', 'overwater', 'honeymoon', 'diving'] },
    { name: 'Dubai', category: 'City', country: 'UAE', keywords: ['luxury', 'desert', 'modern', 'shopping'] },
    { name: 'Thailand', category: 'Beach', country: 'Thailand', keywords: ['beach', 'culture', 'food', 'temples'] },
    { name: 'New York', category: 'City', country: 'USA', keywords: ['city', 'skyscrapers', 'culture', 'broadway'] },
    { name: 'Rome', category: 'City', country: 'Italy', keywords: ['history', 'art', 'food', 'ancient'] },
    { name: 'Santorini', category: 'Island', country: 'Greece', keywords: ['sunset', 'romantic', 'white buildings', 'wine'] },
    { name: 'Machu Picchu', category: 'Adventure', country: 'Peru', keywords: ['ancient', 'hiking', 'history', 'mountains'] }
  ]
  const popularSearches = ['Paris', 'Bali', 'Maldives', 'Dubai', 'Thailand', 'Japan', 'Iceland']
  const destinations = [
    { name: 'Paris', image: '/css/images/paris.jpg', description: 'City of Love and Lights' },
    { name: 'Switzerland', image: '/css/images/swit.jpg', description: 'Alpine Paradise' },
    { name: 'Northern Lights', image: '/css/images/aurora.jpg', description: 'Natural Wonder' }
  ]
  const features = [
    { icon: Globe, title: 'Global Destinations', description: 'Explore 200+ destinations worldwide' },
    { icon: Users, title: 'Expert Guides', description: 'Professional local guides everywhere' },
    { icon: Star, title: '5-Star Experience', description: 'Premium quality guaranteed' },
    { icon: Zap, title: 'Instant Booking', description: 'Book your trip in seconds' }
  ]

  useEffect(() => {
    const saved = localStorage.getItem('recentSearches')
    if (saved) {
      setRecentSearches(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchRef.current && 
        !searchRef.current.contains(event.target) &&
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target)
      ) {
        setShowSuggestions(false)
        setIsSearchFocused(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const fuzzySearch = (query, text) => {
    if (!query) return false
    query = query.toLowerCase()
    text = text.toLowerCase()

    if (text.includes(query)) return true

    let queryIndex = 0
    for (let i = 0; i < text.length && queryIndex < query.length; i++) {
      if (text[i] === query[queryIndex]) {
        queryIndex++
      }
    }
    return queryIndex === query.length
  }

  const fetchPackages = async (searchTerm = '') => {
    try {
      setLoading(true)
      const response = await api.get('/packages', {
        params: {
          search: searchTerm,
          limit: 20
        }
      })
      setPackages(response.data.packages || response.data)
    } catch (error) {
      console.error('Error fetching packages:', error)

      setPackages([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {

    fetchPackages()
  }, [])

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredSuggestions([])
      return
    }
    const query = searchQuery.toLowerCase().trim()
    let suggestions = []

    allDestinations.forEach(dest => {
      const score = calculateRelevanceScore(dest, query)
      if (score > 0) {
        suggestions.push({
          type: 'destination',
          ...dest,
          score,
          searchText: dest.name
        })
      }
    })

    packages.forEach(pkg => {
      let score = 0
      const title = pkg.title?.toLowerCase() || ''
      const destination = pkg.destination?.toLowerCase() || ''
      const description = pkg.description?.toLowerCase() || ''
      if (title.includes(query)) score += 60
      if (destination.includes(query)) score += 50
      if (description.includes(query)) score += 30
      if (pkg.highlights?.some(h => h.toLowerCase().includes(query))) score += 40
      if (score > 0) {
        suggestions.push({
          type: 'package',
          name: pkg.title,
          category: pkg.category || 'Package',
          country: pkg.destination,
          searchText: pkg.title,
          price: pkg.price,
          duration: pkg.duration,
          score
        })
      }
    })

    suggestions = suggestions
      .sort((a, b) => b.score - a.score)
      .filter((suggestion, index, self) => 
        index === self.findIndex(s => s.searchText.toLowerCase() === suggestion.searchText.toLowerCase())
      )

    setFilteredSuggestions(suggestions.slice(0, 8))
  }, [searchQuery, packages])

  const calculateRelevanceScore = (destination, query) => {
    let score = 0
    const name = destination.name.toLowerCase()
    const category = destination.category.toLowerCase()
    const country = destination.country.toLowerCase()
    const keywords = destination.keywords.join(' ').toLowerCase()

    if (name === query) score += 100
    else if (name.startsWith(query)) score += 80
    else if (name.includes(query)) score += 60

    if (category.includes(query)) score += 40

    if (country === query) score += 70
    else if (country.includes(query)) score += 50

    destination.keywords.forEach(keyword => {
      if (keyword.toLowerCase() === query) score += 30
      else if (keyword.toLowerCase().includes(query)) score += 20
    })

    if (score === 0 && (fuzzySearch(query, name) || fuzzySearch(query, keywords))) {
      score += 10
    }
    return score
  }

  const saveSearch = (searchTerm) => {
    if (!searchTerm.trim()) return
    const newRecentSearches = [
      searchTerm,
      ...recentSearches.filter(search => search.toLowerCase() !== searchTerm.toLowerCase())
    ].slice(0, 5) // Keep only 5 recent searches
    setRecentSearches(newRecentSearches)
    localStorage.setItem('recentSearches', JSON.stringify(newRecentSearches))
  }

  const clearRecentSearches = () => {
    setRecentSearches([])
    localStorage.removeItem('recentSearches')
  }

  const handleSearch = (e, searchTerm = null) => {
    e?.preventDefault()
    const finalSearchTerm = searchTerm || searchQuery.trim()
    if (finalSearchTerm) {
      saveSearch(finalSearchTerm)
      setShowSuggestions(false)
      setIsSearchFocused(false)

      navigate(`/packages?search=${encodeURIComponent(finalSearchTerm)}`)
    }
  }

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion.searchText)
    handleSearch(null, suggestion.searchText)
  }

  const handleSearchFocus = () => {
    setIsSearchFocused(true)
    setShowSuggestions(true)
  }

  const handleKeyDown = (e) => {
    if (!showSuggestions) return
    const totalSuggestions = filteredSuggestions.length
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedSuggestionIndex(prev => 
          prev < totalSuggestions - 1 ? prev + 1 : prev
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedSuggestionIndex(prev => prev > -1 ? prev - 1 : prev)
        break
      case 'Enter':
        e.preventDefault()
        if (selectedSuggestionIndex >= 0 && filteredSuggestions[selectedSuggestionIndex]) {
          handleSuggestionClick(filteredSuggestions[selectedSuggestionIndex])
        } else {
          handleSearch(e)
        }
        break
      case 'Escape':
        setShowSuggestions(false)
        setIsSearchFocused(false)
        setSelectedSuggestionIndex(-1)
        searchRef.current?.blur()
        break
      default:
        setSelectedSuggestionIndex(-1) // Reset selection when typing
    }
  }

  const handleSearchChange = (e) => {
    const value = e.target.value
    setSearchQuery(value)
    setShowSuggestions(true)
    setIsSearchFocused(true)
    setSelectedSuggestionIndex(-1) // Reset keyboard selection
  }
  return (
    <div className="min-h-screen">
      {}
      <Hero3D />
      {}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-space font-bold mb-4 sm:mb-6 text-gradient">
              Why Choose GoAdventure?
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-300 max-w-3xl mx-auto px-4">
              Experience the future of travel with our innovative platform designed for modern explorers.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                  className="glass-dark p-6 sm:p-8 rounded-xl sm:rounded-2xl border border-white/10 hover:border-blue-400/30 transition-all duration-300 card-hover"
                >
                  <div className="bg-gradient-to-br from-blue-500 to-purple-600 w-12 h-12 sm:w-16 sm:h-16 rounded-lg sm:rounded-xl flex items-center justify-center mb-4 sm:mb-6 float">
                    <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-space font-semibold mb-3 sm:mb-4 text-white">
                    {feature.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-400">
                    {feature.description}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>
      {}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-space font-bold mb-6 text-gradient">
              Popular Destinations
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Discover the world's most incredible places with our carefully curated selection.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {destinations.map((destination, index) => (
              <motion.div
                key={destination.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="relative group overflow-hidden rounded-2xl card-hover"
              >
                <div className="aspect-[4/5] relative">
                  <img
                    src={destination.image}
                    alt={destination.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                      e.target.src = `https://via.placeholder.com/400x500/1e293b/64748b?text=${destination.name}`
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <h3 className="text-2xl font-space font-bold text-white mb-2">
                      {destination.name}
                    </h3>
                    <p className="text-gray-200">
                      {destination.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link to="/packages">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-neon px-8 py-4 text-lg font-semibold flex items-center space-x-2 mx-auto"
              >
                <span>Explore All Destinations</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
export default Home
