import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Please provide first name'],
    trim: true,
    maxLength: [50, 'First name cannot be more than 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Please provide last name'],
    trim: true,
    maxLength: [50, 'Last name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide email'],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please provide password'],
    minLength: [6, 'Password must be at least 6 characters'],
    select: false // Don't include password in queries by default
  },
  phoneNumber: {
    type: String,
    match: [/^[\+]?[1-9][\d]{0,15}$/, 'Please provide a valid phone number']
  },
  dateOfBirth: {
    type: Date
  },
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    zipCode: String
  },
  preferences: {
    favoriteDestinations: [String],
    travelStyle: {
      type: String,
      enum: ['adventure', 'relaxation', 'cultural', 'luxury', 'budget', 'family'],
      default: 'adventure'
    },
    budget: {
      min: Number,
      max: Number
    }
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'guide'],
    default: 'user'
  },
  avatar: {
    type: String,
    default: 'default-avatar.png'
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  passwordResetToken: String,
  passwordResetExpires: Date,
  lastLogin: Date,
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: Date,
  refreshTokens: [{
    token: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  bookings: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking'
  }],
  reviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review'
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

// Removed duplicate index for email; 'unique: true' is set in schema
userSchema.index({ createdAt: -1 })

userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`
})

userSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now())
})

userSchema.pre('save', async function(next) {

  if (!this.isModified('password')) return next()
  try {

    const salt = await bcrypt.genSalt(12)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error) {
    next(error)
  }
})

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password)
}

userSchema.methods.generateAuthToken = function() {
  return jwt.sign(
    { 
      userId: this._id,
      email: this.email,
      role: this.role
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  )
}

userSchema.methods.generateRefreshToken = function() {
  const refreshToken = jwt.sign(
    { userId: this._id },
    process.env.JWT_SECRET + 'refresh',
    { expiresIn: '30d' }
  )

  this.refreshTokens.push({
    token: refreshToken,
    createdAt: new Date()
  })

  if (this.refreshTokens.length > 5) {
    this.refreshTokens = this.refreshTokens.slice(-5)
  }
  return refreshToken
}

userSchema.methods.incLoginAttempts = function() {

  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $set: {
        loginAttempts: 1
      },
      $unset: {
        lockUntil: 1
      }
    })
  }
  const updates = { $inc: { loginAttempts: 1 } }

  if (this.loginAttempts + 1 >= 5 && !this.isLocked) {
    updates.$set = { lockUntil: Date.now() + 2 * 60 * 60 * 1000 } // Lock for 2 hours
  }
  return this.updateOne(updates)
}

userSchema.methods.resetLoginAttempts = function() {
  return this.updateOne({
    $unset: {
      loginAttempts: 1,
      lockUntil: 1
    }
  })
}

userSchema.statics.findByCredentials = async function(email, password) {

  const user = await this.findOne({ email }).select('+password')
  if (!user) {
    throw new Error('Invalid login credentials')
  }

  if (user.isLocked) {

    await user.incLoginAttempts()
    throw new Error('Account temporarily locked due to too many failed login attempts')
  }

  const isMatch = await user.comparePassword(password)
  if (!isMatch) {

    await user.incLoginAttempts()
    throw new Error('Invalid login credentials')
  }

  if (user.loginAttempts > 0) {
    await user.resetLoginAttempts()
  }

  user.lastLogin = new Date()
  await user.save()
  return user
}
const User = mongoose.model('User', userSchema)
export default User
