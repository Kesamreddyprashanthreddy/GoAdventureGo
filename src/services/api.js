import axios from 'axios'

const getApiBaseUrl = () => {
  // Force development API URL for debugging
  if (import.meta.env.PROD) {
    return '/api'
  }

  return 'http://localhost:5000/api'
}

const API = axios.create({
  baseURL: getApiBaseUrl(),
  withCredentials: true, // Include cookies in requests
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000 // 10 second timeout
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
    console.error('API Response Error:', error);

    if (!error.response && (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK')) {
      console.error('Network error - server might be down');
      return Promise.reject(new Error('Unable to connect to server. Please check your internet connection and try again.'));
    }

    if (error.response?.status === 401) {
      console.log('401 error - clearing auth data');
      localStorage.removeItem('authToken')
      localStorage.removeItem('user')

    }

    if (error.response?.status >= 500) {
      console.error('Server error:', error.response.status);
      return Promise.reject(new Error('Server error. Please try again later.'));
    }

    const message = error.response?.data?.message || error.message || 'An error occurred'
    console.error('API Error:', message)
    return Promise.reject(error)
  }
)

export const authAPI = {

  healthCheck: async () => {
    try {
      const response = await API.get('/health')
      return response.data
    } catch (error) {
      console.error('Health check failed:', error);
      throw error;
    }
  },

  register: async (userData) => {
    console.log('🌐 API: Calling register endpoint with:', userData);
    const response = await API.post('/auth/register', userData)
    console.log('🌐 API: Raw response:', response);
    console.log('🌐 API: Response data:', response.data);

    if (response.data.success && response.data.data.token) {
      console.log('🌐 API: Storing token and user data');
      localStorage.setItem('authToken', response.data.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.data.user))
    } else {
      console.warn('🌐 API: Registration response missing token or success flag:', response.data);
    }
    return response.data
  },

  login: async (credentials) => {
    try {
      console.log('🌐 API: Attempting login with:', { email: credentials.email, hasPassword: !!credentials.password });
      const response = await API.post('/auth/login', credentials)
      console.log('🌐 API: Login response received:', response.data);

      if (response.data.success && response.data.data.token) {
        console.log('🌐 API: Storing auth data after successful login');
        localStorage.setItem('authToken', response.data.data.token)
        localStorage.setItem('user', JSON.stringify(response.data.data.user))
      } else {
        console.warn('🌐 API: Login response missing token or success flag:', response.data);
        throw new Error(response.data.message || 'Login failed - invalid response format');
      }
      return response.data
    } catch (error) {
      console.error('🌐 API: Login error:', error);

      if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
        throw new Error('Unable to connect to server. Please check your internet connection and try again.');
      }
      if (error.response) {

        const errorMessage = error.response.data?.message || 'Login failed';
        throw new Error(errorMessage);
      } else if (error.request) {

        throw new Error('Server is not responding. Please try again later.');
      } else {

        throw new Error(error.message || 'An unexpected error occurred during login.');
      }
    }
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
