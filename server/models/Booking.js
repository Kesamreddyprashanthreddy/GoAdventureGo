import mongoose from 'mongoose'
const bookingSchema = new mongoose.Schema({
  bookingId: {
    type: String,
    unique: true,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  package: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Package',
    required: [true, 'Package is required']
  },
  travelers: [{
    firstName: {
      type: String,
      required: [true, 'First name is required']
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required']
    },
    dateOfBirth: {
      type: Date,
      required: [true, 'Date of birth is required']
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      required: [true, 'Gender is required']
    },
    passportNumber: {
      type: String,
      required: function() {
        return this.parent().requiresPassport
      }
    },
    passportExpiry: {
      type: Date,
      required: function() {
        return this.parent().requiresPassport
      }
    },
    emergencyContact: {
      name: {
        type: String,
        required: [true, 'Emergency contact name is required']
      },
      phone: {
        type: String,
        required: [true, 'Emergency contact phone is required']
      },
      relationship: {
        type: String,
        required: [true, 'Emergency contact relationship is required']
      }
    },
    specialRequirements: {
      dietary: [String],
      medical: [String],
      accessibility: [String]
    }
  }],
  travelDates: {
    startDate: {
      type: Date,
      required: [true, 'Start date is required']
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required']
    }
  },
  pricing: {
    basePrice: {
      type: Number,
      required: [true, 'Base price is required']
    },
    taxes: {
      type: Number,
      default: 0
    },
    fees: {
      type: Number,
      default: 0
    },
    discounts: {
      type: Number,
      default: 0
    },
    totalPrice: {
      type: Number,
      required: [true, 'Total price is required']
    },
    currency: {
      type: String,
      default: 'INR'
    }
  },
  payment: {
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    provider: {
      type: String,
      enum: ['razorpay', 'stripe'],
      default: 'razorpay'
    },
    method: {
      type: String,
      enum: ['credit_card', 'debit_card', 'upi', 'net_banking', 'wallet', 'cash']
    },
    transactionId: String,
    paymentIntentId: String, // For Stripe
    orderId: String, // For Razorpay
    currency: {
      type: String,
      default: 'INR'
    },
    paidAmount: {
      type: Number,
      default: 0
    },
    paidAt: Date,
    paymentHistory: [{
      amount: Number,
      method: String,
      transactionId: String,
      status: String,
      timestamp: {
        type: Date,
        default: Date.now
      }
    }],
    refunds: [{
      refundId: String,
      amount: Number,
      status: String,
      reason: String,
      processedAt: Date
    }]
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed', 'refunded'],
    default: 'pending'
  },
  specialRequests: {
    type: String,
    maxLength: [500, 'Special requests cannot exceed 500 characters']
  },
  communication: [{
    type: {
      type: String,
      enum: ['email', 'sms', 'phone', 'system']
    },
    subject: String,
    message: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    isRead: {
      type: Boolean,
      default: false
    }
  }],
  documents: [{
    type: {
      type: String,
      enum: ['passport', 'visa', 'insurance', 'voucher', 'itinerary', 'other']
    },
    filename: String,
    originalName: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  cancellation: {
    reason: String,
    cancelledAt: Date,
    cancelledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    refundAmount: Number,
    refundStatus: {
      type: String,
      enum: ['not_applicable', 'pending', 'processed', 'failed']
    }
  },
  review: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review'
  },
  requiresPassport: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

// Removed duplicate index for bookingId; 'unique: true' is set in schema
bookingSchema.index({ user: 1, createdAt: -1 })
bookingSchema.index({ package: 1 })
bookingSchema.index({ status: 1 })
bookingSchema.index({ 'travelDates.startDate': 1 })
bookingSchema.index({ createdAt: -1 })

bookingSchema.pre('save', async function(next) {
  if (this.isNew) {

    const timestamp = Date.now().toString(36)
    const random = Math.random().toString(36).substring(2, 8)
    this.bookingId = `GA${timestamp}${random}`.toUpperCase()
  }
  next()
})

bookingSchema.virtual('totalTravelers').get(function() {
  return this.travelers.length
})

bookingSchema.virtual('duration').get(function() {
  const startDate = new Date(this.travelDates.startDate)
  const endDate = new Date(this.travelDates.endDate)
  const diffTime = Math.abs(endDate - startDate)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
})

bookingSchema.virtual('daysUntilTravel').get(function() {
  const today = new Date()
  const startDate = new Date(this.travelDates.startDate)
  const diffTime = startDate - today
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays > 0 ? diffDays : 0
})

bookingSchema.methods.calculateCancellationCharges = function() {
  const daysUntilTravel = this.daysUntilTravel
  const totalAmount = this.pricing.totalPrice
  let cancellationPercentage = 0
  if (daysUntilTravel >= 30) {
    cancellationPercentage = 10 // 10% cancellation fee
  } else if (daysUntilTravel >= 15) {
    cancellationPercentage = 25 // 25% cancellation fee
  } else if (daysUntilTravel >= 7) {
    cancellationPercentage = 50 // 50% cancellation fee
  } else if (daysUntilTravel >= 1) {
    cancellationPercentage = 75 // 75% cancellation fee
  } else {
    cancellationPercentage = 100 // No refund
  }
  const cancellationCharge = (totalAmount * cancellationPercentage) / 100
  const refundAmount = totalAmount - cancellationCharge
  return {
    cancellationPercentage,
    cancellationCharge,
    refundAmount: Math.max(refundAmount, 0)
  }
}

bookingSchema.methods.addCommunication = function(type, subject, message) {
  this.communication.push({
    type,
    subject,
    message,
    timestamp: new Date()
  })
}

bookingSchema.statics.getBookingStats = async function(userId = null) {
  const matchStage = userId ? { user: new mongoose.Types.ObjectId(userId) } : {}
  const stats = await this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalValue: { $sum: '$pricing.totalPrice' }
      }
    }
  ])
  const totalBookings = await this.countDocuments(matchStage)
  const totalRevenue = await this.aggregate([
    { $match: { ...matchStage, 'payment.status': 'completed' } },
    { $group: { _id: null, total: { $sum: '$pricing.totalPrice' } } }
  ])
  return {
    totalBookings,
    totalRevenue: totalRevenue[0]?.total || 0,
    statusBreakdown: stats
  }
}
const Booking = mongoose.model('Booking', bookingSchema)
export default Booking
