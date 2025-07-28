import axios from 'axios'
const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true, // Include cookies in requests
  headers: {
    'Content-Type': 'application/json'
  }
})
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken')
      localStorage.removeItem('user')
    }
    const message = error.response?.data?.message || 'An error occurred'
    console.error('API Error:', message)
    return Promise.reject(error)
  }
)
export const authAPI = {
  register: async (userData) => {
    const response = await API.post('/auth/register', userData)
    if (response.data.success && response.data.data.token) {
      localStorage.setItem('authToken', response.data.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.data.user))
    }
    return response.data
  },
  login: async (credentials) => {
    const response = await API.post('/auth/login', credentials)
    if (response.data.success && response.data.data.token) {
      localStorage.setItem('authToken', response.data.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.data.user))
    }
    return response.data
  },
  getMe: async () => {
    const response = await API.get('/auth/me')
    return response.data
  },
  updateProfile: async (profileData) => {
    const response = await API.put('/auth/profile', profileData)
    if (response.data.success && response.data.data.user) {
      localStorage.setItem('user', JSON.stringify(response.data.data.user))
    }
    return response.data
  },
  logout: async () => {
    try {
      const response = await API.post('/auth/logout')
      return response.data
    } finally {
      localStorage.removeItem('authToken')
      localStorage.removeItem('user')
    }
  },
  forgotPassword: async (email) => {
    const response = await API.post('/auth/forgot-password', { email })
    return response.data
  },
  resetPassword: async (token, password) => {
    const response = await API.post('/auth/reset-password', { token, password })
    return response.data
  }
}
const MOCK_PACKAGES = [
  {
    id: 1,
    title: 'Tropical Paradise Getaway',
    description: 'Experience the beauty of pristine beaches and crystal-clear waters.',
    price: 1299,
    duration: '7 days',
    image: '/public/css/images/andaman.jpg',
    rating: 4.8,
    featured: true
  },
  {
    id: 2,
    title: 'Mountain Adventure Trek',
    description: 'Conquer majestic peaks and breathe the crisp mountain air.',
    price: 899,
    duration: '5 days',
    image: '/public/css/images/himalaya.jpg',
    rating: 4.7,
    featured: true
  }
]
export const packagesAPI = {
  getPackages: async (params = {}) => {
    await mockDelay()
    return {
      success: true,
      data: { packages: MOCK_PACKAGES }
    }
  },
  getPackage: async (id) => {
    await mockDelay()
    const pkg = MOCK_PACKAGES.find(p => p.id === parseInt(id))
    if (!pkg) {
      throw new Error('Package not found')
    }
    return {
      success: true,
      data: { package: pkg }
    }
  },
  getFeatured: async (limit = 6) => {
    await mockDelay()
    const featured = MOCK_PACKAGES.filter(p => p.featured).slice(0, limit)
    return {
      success: true,
      data: { packages: featured }
    }
  },
  getPopular: async (limit = 8) => {
    await mockDelay()
    return {
      success: true,
      data: { packages: MOCK_PACKAGES.slice(0, limit) }
    }
  },
  checkAvailability: async (packageId, dateData) => {
    await mockDelay()
    return {
      success: true,
      data: { available: true }
    }
  },
  search: async (searchParams) => {
    await mockDelay()
    return {
      success: true,
      data: { packages: MOCK_PACKAGES }
    }
  }
}
const MOCK_BOOKINGS = []
export const bookingsAPI = {
  create: async (bookingData) => {
    await mockDelay()
    const newBooking = {
      id: MOCK_BOOKINGS.length + 1,
      ...bookingData,
      status: 'confirmed',
      bookingDate: new Date().toISOString(),
      bookingReference: 'BK' + Date.now()
    }
    MOCK_BOOKINGS.push(newBooking)
    return {
      success: true,
      message: 'Booking created successfully',
      data: { booking: newBooking }
    }
  },
  getMyBookings: async (params = {}) => {
    await mockDelay()
    return {
      success: true,
      data: { bookings: MOCK_BOOKINGS }
    }
  },
  getBooking: async (id) => {
    await mockDelay()
    const booking = MOCK_BOOKINGS.find(b => b.id === parseInt(id))
    if (!booking) {
      throw new Error('Booking not found')
    }
    return {
      success: true,
      data: { booking }
    }
  },
  cancelBooking: async (id, reason) => {
    await mockDelay()
    const booking = MOCK_BOOKINGS.find(b => b.id === parseInt(id))
    if (booking) {
      booking.status = 'cancelled'
      booking.cancellationReason = reason
    }
    return {
      success: true,
      message: 'Booking cancelled successfully',
      data: { booking }
    }
  },
  updatePayment: async (id, paymentData) => {
    await mockDelay()
    const booking = MOCK_BOOKINGS.find(b => b.id === parseInt(id))
    if (booking) {
      booking.paymentStatus = paymentData.status
      booking.paymentData = paymentData
    }
    return {
      success: true,
      message: 'Payment updated successfully',
      data: { booking }
    }
  }
}
export const usersAPI = {
  getUsers: async (params = {}) => {
    const response = await API.get('/users', { params })
    return response.data
  },
  getUser: async (id) => {
    const response = await API.get(`/users/${id}`)
    return response.data
  },
  updateUser: async (id, userData) => {
    const response = await API.put(`/users/${id}`, userData)
    return response.data
  },
  deleteUser: async (id) => {
    const response = await API.delete(`/users/${id}`)
    return response.data
  },
  getStats: async () => {
    const response = await API.get('/users/stats')
    return response.data
  }
}
export const apiUtils = {
  handleError: (error, customMessage) => {
    const message = customMessage || error.response?.data?.message || 'An error occurred'
    console.error('API Error:', error)
  },
  formatResponse: (response) => {
    return {
      success: response.success,
      data: response.data,
      message: response.message,
      pagination: response.pagination,
      filters: response.filters
    }
  },
  isAuthenticated: () => {
    return !!localStorage.getItem('authToken')
  },
  getStoredUser: () => {
    const userData = localStorage.getItem('user')
    return userData ? JSON.parse(userData) : null
  },
  storeUser: (user) => {
    localStorage.setItem('user', JSON.stringify(user))
  },
  clearStoredData: () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
  }
}
export default API
