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
export const packagesAPI = {
  getAll: async () => {
    const response = await API.get('/packages')
    return response.data
  },
  getById: async (id) => {
    const response = await API.get(`/packages/${id}`)
    return response.data
  },
  getFeatured: async (limit = 6) => {
    const response = await API.get(`/packages/featured?limit=${limit}`)
    return response.data
  },
  getPopular: async (limit = 8) => {
    const response = await API.get(`/packages/popular?limit=${limit}`)
    return response.data
  },
  checkAvailability: async (packageId, dateData) => {
    const response = await API.post(`/packages/${packageId}/check-availability`, dateData)
    return response.data
  },
  search: async (searchParams) => {
    const response = await API.get('/packages/search', { params: searchParams })
    return response.data
  }
}
export const bookingsAPI = {
  create: async (bookingData) => {
    const response = await API.post('/bookings', bookingData)
    return response.data
  },
  getUserBookings: async () => {
    const response = await API.get('/bookings/my-bookings')
    return response.data
  },
  getById: async (id) => {
    const response = await API.get(`/bookings/${id}`)
    return response.data
  },
  update: async (id, updateData) => {
    const response = await API.put(`/bookings/${id}`, updateData)
    return response.data
  },
  cancel: async (id) => {
    const response = await API.delete(`/bookings/${id}`)
    return response.data
  }
}
export const paymentAPI = {
  processPayment: async (paymentData) => {
    const response = await API.post('/payments/process', paymentData)
    return response.data
  },
  verifyPayment: async (paymentId) => {
    const response = await API.post(`/payments/verify/${paymentId}`)
    return response.data
  }
}
export const apiUtils = {
  getStoredUser: () => {
    try {
      const userStr = localStorage.getItem('user')
      return userStr ? JSON.parse(userStr) : null
    } catch (error) {
      console.error('Error parsing stored user:', error)
      return null
    }
  },
  storeUser: (user) => {
    try {
      localStorage.setItem('user', JSON.stringify(user))
    } catch (error) {
      console.error('Error storing user:', error)
    }
  },
  getStoredToken: () => {
    return localStorage.getItem('authToken')
  },
  clearAuthData: () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
  }
}
export default API
