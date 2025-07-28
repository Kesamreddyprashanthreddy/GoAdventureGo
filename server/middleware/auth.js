import jwt from 'jsonwebtoken'
import User from '../models/User.js'
export const protect = async (req, res, next) => {
  try {
    let token
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1]
    }
    else if (req.cookies.authToken) {
      token = req.cookies.authToken
    }
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      })
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      const user = await User.findById(decoded.userId).select('-password')
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'No user found with this token'
        })
      }
      if (user.isLocked) {
        return res.status(423).json({
          success: false,
          message: 'Account is temporarily locked'
        })
      }
      req.user = user
      next()
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      })
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error in auth middleware'
    })
  }
}
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user.role}' is not authorized to access this route`
      })
    }
    next()
  }
}
export const optionalAuth = async (req, res, next) => {
  try {
    let token
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1]
    } else if (req.cookies.authToken) {
      token = req.cookies.authToken
    }
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findById(decoded.userId).select('-password')
        if (user && !user.isLocked) {
          req.user = user
        }
      } catch (error) {
      }
    }
    next()
  } catch (error) {
    next()
  }
}
export const checkOwnership = (resourceModel, resourceIdParam = 'id') => {
  return async (req, res, next) => {
    try {
      const resourceId = req.params[resourceIdParam]
      const resource = await resourceModel.findById(resourceId)
      if (!resource) {
        return res.status(404).json({
          success: false,
          message: 'Resource not found'
        })
      }
      if (resource.user?.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to access this resource'
        })
      }
      req.resource = resource
      next()
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Server error checking ownership'
      })
    }
  }
}
