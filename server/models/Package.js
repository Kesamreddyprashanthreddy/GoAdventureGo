import mongoose from 'mongoose'
const packageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Package name is required'],
    trim: true,
    maxLength: [100, 'Package name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Package description is required'],
    maxLength: [1000, 'Description cannot exceed 1000 characters']
  },
  shortDescription: {
    type: String,
    maxLength: [200, 'Short description cannot exceed 200 characters']
  },
  category: {
    type: String,
    required: [true, 'Package category is required'],
    enum: ['seas', 'mountains', 'landscapes', 'cities', 'adventure', 'cultural', 'luxury'],
    lowercase: true
  },
  destination: {
    country: {
      type: String,
      required: [true, 'Country is required']
    },
    city: String,
    region: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  pricing: {
    basePrice: {
      type: Number,
      required: [true, 'Base price is required'],
      min: [0, 'Price cannot be negative']
    },
    currency: {
      type: String,
      default: 'INR',
      enum: ['INR', 'USD', 'EUR', 'GBP']
    },
    priceIncludes: [String],
    priceExcludes: [String]
  },
  duration: {
    days: {
      type: Number,
      required: [true, 'Duration in days is required'],
      min: [1, 'Duration must be at least 1 day']
    },
    nights: {
      type: Number,
      required: [true, 'Duration in nights is required'],
      min: [0, 'Nights cannot be negative']
    }
  },
  itinerary: [{
    day: {
      type: Number,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    activities: [String],
    meals: {
      breakfast: { type: Boolean, default: false },
      lunch: { type: Boolean, default: false },
      dinner: { type: Boolean, default: false }
    },
    accommodation: String
  }],
  images: {
    main: {
      type: String,
      required: [true, 'Main image is required']
    },
    gallery: [String],
    thumbnail: String
  },
  features: {
    difficulty: {
      type: String,
      enum: ['easy', 'moderate', 'challenging', 'extreme'],
      default: 'moderate'
    },
    groupSize: {
      min: {
        type: Number,
        default: 2
      },
      max: {
        type: Number,
        default: 15
      }
    },
    ageRestriction: {
      min: {
        type: Number,
        default: 0
      },
      max: {
        type: Number,
        default: 100
      }
    },
    physicalRequirements: [String],
    equipment: [String]
  },
  availability: {
    seasons: [{
      type: String,
      enum: ['spring', 'summer', 'autumn', 'winter']
    }],
    availableDates: [{
      startDate: Date,
      endDate: Date,
      available: {
        type: Boolean,
        default: true
      },
      bookedSpots: {
        type: Number,
        default: 0
      }
    }],
    blackoutDates: [{
      startDate: Date,
      endDate: Date,
      reason: String
    }]
  },
  ratings: {
    average: {
      type: Number,
      default: 0,
      min: [0, 'Rating cannot be less than 0'],
      max: [5, 'Rating cannot be more than 5']
    },
    count: {
      type: Number,
      default: 0
    },
    breakdown: {
      five: { type: Number, default: 0 },
      four: { type: Number, default: 0 },
      three: { type: Number, default: 0 },
      two: { type: Number, default: 0 },
      one: { type: Number, default: 0 }
    }
  },
  reviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review'
  }],
  bookings: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking'
  }],
  tags: [String],
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lastUpdatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})
packageSchema.index({ name: 'text', description: 'text', tags: 'text' })
packageSchema.index({ category: 1 })
packageSchema.index({ 'destination.country': 1 })
packageSchema.index({ 'pricing.basePrice': 1 })
packageSchema.index({ 'ratings.average': -1 })
packageSchema.index({ createdAt: -1 })
packageSchema.index({ isFeatured: -1, 'ratings.average': -1 })
packageSchema.virtual('formattedPrice').get(function() {
  const currencySymbols = {
    'INR': '₹',
    'USD': '$',
    'EUR': '€',
    'GBP': '£'
  }
  const symbol = currencySymbols[this.pricing.currency] || this.pricing.currency
  return `${symbol}${this.pricing.basePrice.toLocaleString()}`
})
packageSchema.virtual('durationString').get(function() {
  return `${this.duration.days} Days, ${this.duration.nights} Nights`
})
packageSchema.virtual('ratingRounded').get(function() {
  return Math.round(this.ratings.average * 10) / 10
})
packageSchema.methods.checkAvailability = function(startDate, endDate, groupSize = 1) {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const isBlackedOut = this.availability.blackoutDates.some(blackout => {
    return (start >= blackout.startDate && start <= blackout.endDate) ||
           (end >= blackout.startDate && end <= blackout.endDate) ||
           (start <= blackout.startDate && end >= blackout.endDate)
  })
  if (isBlackedOut) {
    return { available: false, reason: 'Dates not available' }
  }
  if (!this.availability.availableDates || this.availability.availableDates.length === 0) {
    if (groupSize > this.features.groupSize.max) {
      return { 
        available: false, 
        reason: `Maximum group size is ${this.features.groupSize.max}, but ${groupSize} requested` 
      }
    }
    return { 
      available: true, 
      remainingSpots: this.features.groupSize.max - groupSize,
      slotId: null 
    }
  }
  const availableSlot = this.availability.availableDates.find(slot => {
    return start >= slot.startDate && end <= slot.endDate && slot.available
  })
  if (!availableSlot) {
    return { available: false, reason: 'No available slots for selected dates' }
  }
  const remainingSpots = this.features.groupSize.max - availableSlot.bookedSpots
  if (groupSize > remainingSpots) {
    return { 
      available: false, 
      reason: `Only ${remainingSpots} spots remaining, but ${groupSize} requested` 
    }
  }
  return { 
    available: true, 
    remainingSpots,
    slotId: availableSlot._id 
  }
}
packageSchema.methods.updateRatings = function() {
  const total = this.ratings.breakdown.five * 5 + 
                this.ratings.breakdown.four * 4 + 
                this.ratings.breakdown.three * 3 + 
                this.ratings.breakdown.two * 2 + 
                this.ratings.breakdown.one * 1
  this.ratings.count = this.ratings.breakdown.five + 
                       this.ratings.breakdown.four + 
                       this.ratings.breakdown.three + 
                       this.ratings.breakdown.two + 
                       this.ratings.breakdown.one
  this.ratings.average = this.ratings.count > 0 ? total / this.ratings.count : 0
}
packageSchema.statics.advancedSearch = function(searchOptions) {
  const {
    query,
    category,
    country,
    minPrice,
    maxPrice,
    minDuration,
    maxDuration,
    difficulty,
    minRating,
    page = 1,
    limit = 10,
    sort = '-createdAt'
  } = searchOptions
  let searchQuery = { isActive: true }
  if (query) {
    searchQuery.$text = { $search: query }
  }
  if (category && category !== 'all') {
    searchQuery.category = category
  }
  if (country) {
    searchQuery['destination.country'] = new RegExp(country, 'i')
  }
  if (minPrice || maxPrice) {
    searchQuery['pricing.basePrice'] = {}
    if (minPrice) searchQuery['pricing.basePrice'].$gte = minPrice
    if (maxPrice) searchQuery['pricing.basePrice'].$lte = maxPrice
  }
  if (minDuration || maxDuration) {
    searchQuery['duration.days'] = {}
    if (minDuration) searchQuery['duration.days'].$gte = minDuration
    if (maxDuration) searchQuery['duration.days'].$lte = maxDuration
  }
  if (difficulty) {
    searchQuery['features.difficulty'] = difficulty
  }
  if (minRating) {
    searchQuery['ratings.average'] = { $gte: minRating }
  }
  return this.find(searchQuery)
    .populate('createdBy', 'firstName lastName')
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(limit)
}
const Package = mongoose.model('Package', packageSchema)
export default Package
