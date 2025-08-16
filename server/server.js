import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import helmet from 'helmet'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import cookieParser from 'cookie-parser'
import path from 'path'
import { fileURLToPath } from 'url'

import authRoutes from './routes/auth.js'
import userRoutes from './routes/users.js'
import packageRoutes from './routes/packages.js'
import bookingRoutes from './routes/bookings.js'
import paymentRoutes from './routes/payments.js'

import { errorHandler } from './middleware/errorHandler.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Configure dotenv to load from server directory
dotenv.config({ path: path.join(__dirname, '.env') })

// Validate required environment variables
const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET']
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName])

if (missingEnvVars.length > 0) {
  console.error('❌ Missing required environment variables:', missingEnvVars.join(', '))
  console.error('Please set these variables in your environment or .env file')
  process.exit(1)
}

console.log('✅ All required environment variables are set')

const app = express()

app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}))

let authLimiter = null

if (process.env.NODE_ENV === 'production') {
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
  })
  app.use('/api/', limiter)

  authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 50, // Limit each IP to 50 requests per windowMs for auth
    message: 'Too many authentication attempts, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
  })
} else {
  console.log('⚠️ Rate limiting disabled for development')
}

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true)
    
    const allowedOrigins = [
      process.env.CLIENT_URL || 'http://localhost:3001',
      'http://localhost:3000',
      'http://localhost:3001', 
      'http://localhost:5173',
      'http://localhost:5174',
      process.env.PRODUCTION_DOMAIN,
      process.env.CORS_ORIGIN,
      // Add common hosting domains
      'https://vercel.app',
      'https://netlify.app',
      'https://github.io',
      // Add localhost for development
      'http://127.0.0.1:5173',
      'http://127.0.0.1:3000'
    ].filter(Boolean)
    
    // Check if origin matches any allowed origins or is a subdomain
    const isAllowed = allowedOrigins.some(allowedOrigin => 
      origin === allowedOrigin || 
      origin.endsWith('.vercel.app') || 
      origin.endsWith('.netlify.app') ||
      origin.endsWith('.github.io') ||
      origin.endsWith('.herokuapp.com') ||
      origin.endsWith('.render.com') ||
      origin.includes('localhost') ||
      origin.includes('127.0.0.1')
    )
    
    if (isAllowed) {
      callback(null, true)
    } else {
      console.log('CORS allowed origin:', origin)
      // For development, allow all origins
      if (process.env.NODE_ENV === 'development') {
        callback(null, true)
      } else {
        console.log('CORS blocked origin:', origin)
        callback(null, true) // Allow all origins for now
      }
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}
app.use(cors(corsOptions))

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))
app.use(cookieParser())

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('combined'))
}

app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')))

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI)
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`)
  } catch (error) {
    console.error('❌ Database connection failed:', error.message)
    process.exit(1)
  }
}
connectDB()

if (process.env.NODE_ENV === 'production') {
  app.use('/api/auth', authLimiter, authRoutes)
} else {
  app.use('/api/auth', authRoutes)
}
app.use('/api/users', userRoutes)
app.use('/api/packages', packageRoutes)
app.use('/api/bookings', bookingRoutes)
app.use('/api/payments', paymentRoutes)

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  })
})

// Serve static files from the React app build directory in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')))
  
  // Catch all handler: send back React's index.html file for any non-API routes
  app.get('*', (req, res) => {
    // Skip API routes
    if (req.path.startsWith('/api')) {
      return res.status(404).json({
        success: false,
        message: `API route ${req.originalUrl} not found`
      })
    }
    
    res.sendFile(path.join(__dirname, '../dist/index.html'))
  })
} else {
  app.get('/', (req, res) => {
    res.json({
      message: 'GoAdventureGo API Server',
      version: '1.0.0',
      status: 'Running',
      endpoints: {
        auth: '/api/auth',
        users: '/api/users',
        packages: '/api/packages',
        bookings: '/api/bookings',
        health: '/api/health'
      }
    })
  })

  app.all('*', (req, res) => {
    res.status(404).json({
      success: false,
      message: `Route ${req.originalUrl} not found`
    })
  })
}

app.use(errorHandler)

process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received. Shutting down gracefully')
  mongoose.connection.close().then(() => {
    console.log('📦 Database connection closed')
    process.exit(0)
  })
})
process.on('SIGINT', () => {
  console.log('👋 SIGINT received. Shutting down gracefully')
  mongoose.connection.close().then(() => {
    console.log('📦 Database connection closed')
    process.exit(0)
  })
})
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
  console.log(`📱 Client URL: ${process.env.CLIENT_URL}`)
  console.log(`🔗 API Base URL: http://localhost:${PORT}/api`)
})
