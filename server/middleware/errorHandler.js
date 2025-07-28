
export const errorHandler = (err, req, res, next) => {
  let error = { ...err }
  error.message = err.message
  console.error('🚨 Error:', {
    name: err.name,
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  })
  if (err.name === 'CastError') {
    const message = 'Resource not found'
    error = {
      statusCode: 404,
      message
    }
  }
  if (err.code === 11000) {
    let message = 'Duplicate field value entered'
    const field = Object.keys(err.keyValue)[0]
    if (field === 'email') {
      message = 'Email already exists'
    }
    error = {
      statusCode: 400,
      message
    }
  }
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ')
    error = {
      statusCode: 400,
      message
    }
  }
  if (err.name === 'JsonWebTokenError') {
    error = {
      statusCode: 401,
      message: 'Invalid token'
    }
  }
  if (err.name === 'TokenExpiredError') {
    error = {
      statusCode: 401,
      message: 'Token expired'
    }
  }
  if (err.code === 'LIMIT_FILE_SIZE') {
    error = {
      statusCode: 400,
      message: 'File size too large'
    }
  }
  if (err.type === 'entity.too.large') {
    error = {
      statusCode: 413,
      message: 'Request entity too large'
    }
  }
  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  })
}
export const notFound = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  })
}
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next)
}
