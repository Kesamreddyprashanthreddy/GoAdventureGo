import express from 'express'
import Package from '../models/Package.js'
import { protect, authorize, optionalAuth } from '../middleware/auth.js'
import { asyncHandler } from '../middleware/errorHandler.js'
const router = express.Router()
export const getPackages = asyncHandler(async (req, res) => {
  const {
    search,
    category,
    country,
    minPrice,
    maxPrice,
    minDuration,
    maxDuration,
    difficulty,
    minRating,
    page = 1,
    limit = 12,
    sort = '-createdAt',
    featured
  } = req.query
  let query = { isActive: true }
  if (search) {
    query.$or = [
      { name: new RegExp(search, 'i') },
      { description: new RegExp(search, 'i') },
      { shortDescription: new RegExp(search, 'i') },
      { tags: { $in: [new RegExp(search, 'i')] } },
      { 'destination.country': new RegExp(search, 'i') },
      { 'destination.city': new RegExp(search, 'i') }
    ]
  }
  if (category && category !== 'all') {
    query.category = category
  }
  if (country) {
    query['destination.country'] = new RegExp(country, 'i')
  }
  if (minPrice || maxPrice) {
    query['pricing.basePrice'] = {}
    if (minPrice) query['pricing.basePrice'].$gte = parseInt(minPrice)
    if (maxPrice) query['pricing.basePrice'].$lte = parseInt(maxPrice)
  }
  if (minDuration || maxDuration) {
    query['duration.days'] = {}
    if (minDuration) query['duration.days'].$gte = parseInt(minDuration)
    if (maxDuration) query['duration.days'].$lte = parseInt(maxDuration)
  }
  if (difficulty) {
    query['features.difficulty'] = difficulty
  }
  if (minRating) {
    query['ratings.average'] = { $gte: parseFloat(minRating) }
  }
  if (featured === 'true') {
    query.isFeatured = true
  }
  const packages = await Package.find(query)
    .populate('createdBy', 'firstName lastName')
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(parseInt(limit))
  const total = await Package.countDocuments(query)
  const categories = await Package.distinct('category', { isActive: true })
  const countries = await Package.distinct('destination.country', { isActive: true })
  const priceRange = await Package.aggregate([
    { $match: { isActive: true } },
    {
      $group: {
        _id: null,
        minPrice: { $min: '$pricing.basePrice' },
        maxPrice: { $max: '$pricing.basePrice' }
      }
    }
  ])
  res.status(200).json({
    success: true,
    data: packages,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit)
    },
    filters: {
      categories: categories.sort(),
      countries: countries.sort(),
      priceRange: priceRange[0] || { minPrice: 0, maxPrice: 100000 },
      difficulties: ['easy', 'moderate', 'challenging', 'extreme']
    }
  })
})
export const getPackage = asyncHandler(async (req, res) => {
  const packageData = await Package.findById(req.params.id)
    .populate('createdBy', 'firstName lastName')
    .populate({
      path: 'reviews',
      populate: {
        path: 'user',
        select: 'firstName lastName avatar'
      }
    })
  if (!packageData) {
    return res.status(404).json({
      success: false,
      message: 'Package not found'
    })
  }
  if (!packageData.isActive) {
    return res.status(404).json({
      success: false,
      message: 'Package is not available'
    })
  }
  res.status(200).json({
    success: true,
    data: packageData
  })
})
export const createPackage = asyncHandler(async (req, res) => {
  req.body.createdBy = req.user._id
  const packageData = await Package.create(req.body)
  res.status(201).json({
    success: true,
    message: 'Package created successfully',
    data: packageData
  })
})
export const updatePackage = asyncHandler(async (req, res) => {
  let packageData = await Package.findById(req.params.id)
  if (!packageData) {
    return res.status(404).json({
      success: false,
      message: 'Package not found'
    })
  }
  req.body.lastUpdatedBy = req.user._id
  packageData = await Package.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  })
  res.status(200).json({
    success: true,
    message: 'Package updated successfully',
    data: packageData
  })
})
export const deletePackage = asyncHandler(async (req, res) => {
  const packageData = await Package.findById(req.params.id)
  if (!packageData) {
    return res.status(404).json({
      success: false,
      message: 'Package not found'
    })
  }
  packageData.isActive = false
  await packageData.save()
  res.status(200).json({
    success: true,
    message: 'Package deleted successfully'
  })
})
export const getFeaturedPackages = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 6
  const packages = await Package.find({ 
    isActive: true, 
    isFeatured: true 
  })
    .populate('createdBy', 'firstName lastName')
    .sort('-ratings.average -createdAt')
    .limit(limit)
  res.status(200).json({
    success: true,
    data: packages
  })
})
export const getPopularPackages = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 8
  const packages = await Package.find({ isActive: true })
    .populate('createdBy', 'firstName lastName')
    .sort('-ratings.average -ratings.count')
    .limit(limit)
  res.status(200).json({
    success: true,
    data: packages
  })
})
export const checkAvailability = asyncHandler(async (req, res) => {
  const { startDate, endDate, groupSize = 1 } = req.body
  if (!startDate || !endDate) {
    return res.status(400).json({
      success: false,
      message: 'Start date and end date are required'
    })
  }
  const packageData = await Package.findById(req.params.id)
  if (!packageData) {
    return res.status(404).json({
      success: false,
      message: 'Package not found'
    })
  }
  const availability = packageData.checkAvailability(startDate, endDate, groupSize)
  res.status(200).json({
    success: true,
    data: availability
  })
})
export const getPackageStats = asyncHandler(async (req, res) => {
  const totalPackages = await Package.countDocuments({ isActive: true })
  const featuredPackages = await Package.countDocuments({ isActive: true, isFeatured: true })
  const packagesByCategory = await Package.aggregate([
    { $match: { isActive: true } },
    { $group: { _id: '$category', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ])
  const ratingStats = await Package.aggregate([
    { $match: { isActive: true, 'ratings.count': { $gt: 0 } } },
    {
      $group: {
        _id: null,
        avgRating: { $avg: '$ratings.average' },
        minRating: { $min: '$ratings.average' },
        maxRating: { $max: '$ratings.average' }
      }
    }
  ])
  const priceStats = await Package.aggregate([
    { $match: { isActive: true } },
    {
      $group: {
        _id: null,
        avgPrice: { $avg: '$pricing.basePrice' },
        minPrice: { $min: '$pricing.basePrice' },
        maxPrice: { $max: '$pricing.basePrice' }
      }
    }
  ])
  res.status(200).json({
    success: true,
    data: {
      totalPackages,
      featuredPackages,
      packagesByCategory,
      ratingStats: ratingStats[0] || {},
      priceStats: priceStats[0] || {}
    }
  })
})
router.route('/')
  .get(getPackages)
  .post(protect, authorize('admin'), createPackage)
router.get('/featured', getFeaturedPackages)
router.get('/popular', getPopularPackages)
router.get('/stats', protect, authorize('admin'), getPackageStats)
router.route('/:id')
  .get(getPackage)
  .put(protect, authorize('admin'), updatePackage)
  .delete(protect, authorize('admin'), deletePackage)
router.post('/:id/availability', checkAvailability)
export default router
