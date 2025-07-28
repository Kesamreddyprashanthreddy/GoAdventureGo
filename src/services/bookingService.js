
export class BookingService {
  constructor() {
    this.storageKey = 'goAdventure_bookings'
  }
  getBookings() {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    if (!user.id) return []
    const allBookings = JSON.parse(localStorage.getItem(this.storageKey) || '[]')
    return allBookings.filter(booking => booking.userId === user.id)
  }
  createBooking(packageData, bookingDetails = {}) {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    if (!user.id) {
      throw new Error('User not authenticated')
    }
    const bookingId = `GOA${Date.now()}`
    const bookingType = packageData.category === 'hotels' ? 'hotel' : 
                       packageData.category === 'flights' ? 'flight' : 'package'
    const booking = {
      _id: `booking_${Date.now()}`,
      bookingId,
      userId: user.id,
      type: bookingType, // Add booking type
      package: {
        id: packageData.id,
        name: packageData.name,
        destination: {
          city: bookingType === 'hotel' ? packageData.location : 
                bookingType === 'flight' ? `${packageData.from} → ${packageData.to}` :
                this.extractCity(packageData.name),
          country: this.getCountry(packageData.category)
        },
        images: [packageData.image],
        duration: packageData.duration,
        price: packageData.price,
        ...(bookingType === 'hotel' && {
          location: packageData.location,
          guests: packageData.guests,
          amenities: packageData.amenities
        }),
        ...(bookingType === 'flight' && {
          from: packageData.from,
          to: packageData.to,
          airline: packageData.airline,
          flightNumber: packageData.flightNumber,
          passengers: packageData.passengers,
          class: packageData.class
        })
      },
      status: 'confirmed',
      payment: {
        status: 'completed',
        paidAmount: packageData.price
      },
      travelDates: {
        startDate: packageData.dates?.checkIn || packageData.dates?.departure || bookingDetails.startDate || this.getDefaultStartDate(),
        endDate: packageData.dates?.checkOut || packageData.dates?.return || bookingDetails.endDate || this.getDefaultEndDate()
      },
      travelers: bookingDetails.travelers || [{
        firstName: user.firstName || 'John',
        lastName: user.lastName || 'Doe'
      }],
      pricing: {
        totalPrice: Math.round(packageData.price * 1.18), // Include taxes
        basePrice: packageData.price,
        taxes: Math.round(packageData.price * 0.18),
        fees: 500
      },
      createdAt: new Date().toISOString(),
      specialRequests: bookingDetails.specialRequests || ''
    }
    const allBookings = JSON.parse(localStorage.getItem(this.storageKey) || '[]')
    allBookings.push(booking)
    localStorage.setItem(this.storageKey, JSON.stringify(allBookings))
    return booking
  }
  cancelBooking(bookingId) {
    const allBookings = JSON.parse(localStorage.getItem(this.storageKey) || '[]')
    const updatedBookings = allBookings.map(booking => 
      booking.bookingId === bookingId 
        ? { ...booking, status: 'cancelled' }
        : booking
    )
    localStorage.setItem(this.storageKey, JSON.stringify(updatedBookings))
    return true
  }
  getBooking(bookingId) {
    const bookings = this.getBookings()
    return bookings.find(booking => booking.bookingId === bookingId)
  }
  extractCity(packageName) {
    const cityMap = {
      'Andaman': 'Port Blair',
      'Himalaya': 'Pokhara', 
      'Iceland': 'Reykjavik',
      'Fuji': 'Tokyo',
      'Amazon': 'Manaus',
      'Azores': 'Ponta Delgada',
      'Reef': 'Cairns',
      'Antelope': 'Page',
      'Caves': 'Waitomo'
    }
    for (const [key, city] of Object.entries(cityMap)) {
      if (packageName.toLowerCase().includes(key.toLowerCase())) {
        return city
      }
    }
    return 'Unknown'
  }
  getCountry(category) {
    const countryMap = {
      'seas': 'India',
      'mountains': 'Nepal',
      'islands': 'Iceland',
      'forests': 'Brazil',
      'caves': 'New Zealand'
    }
    return countryMap[category] || 'India'
  }
  getDefaultStartDate() {
    const date = new Date()
    date.setDate(date.getDate() + 30) // 30 days from now
    return date.toISOString()
  }
  getDefaultEndDate() {
    const date = new Date()
    date.setDate(date.getDate() + 37) // 37 days from now (7 day trip)
    return date.toISOString()
  }
  createDemoBookings() {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    if (!user.id) return
    const existingBookings = this.getBookings()
    if (existingBookings.length > 0) return // Already have bookings
    const demoPackages = [
      {
        id: 'andaman',
        name: 'Andaman and Nicobar',
        image: '/css/images/andaman.jpg',
        price: 25000,
        duration: '5 Days',
        category: 'seas'
      },
      {
        id: 'himalaya',
        name: 'Himalaya Adventure',
        image: '/css/images/himalaya.jpg',
        price: 65000,
        duration: '7 Days',
        category: 'mountains'
      }
    ]
    demoPackages.forEach((pkg, index) => {
      const startDate = new Date()
      startDate.setDate(startDate.getDate() + (30 + index * 10))
      const endDate = new Date(startDate)
      endDate.setDate(endDate.getDate() + 7)
      this.createBooking(pkg, {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        travelers: [{
          firstName: user.firstName || 'John',
          lastName: user.lastName || 'Doe'
        }]
      })
    })
  }
}
export const bookingService = new BookingService()
