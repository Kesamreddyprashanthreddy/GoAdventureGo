import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { authAPI, apiUtils } from '../services/api'
import toast from 'react-hot-toast'

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  isSigningOut: false,
  error: null
}

const AUTH_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_SIGNING_OUT: 'SET_SIGNING_OUT',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  REGISTER_SUCCESS: 'REGISTER_SUCCESS',
  LOGOUT: 'LOGOUT',
  UPDATE_PROFILE: 'UPDATE_PROFILE',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR'
}

const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload
      }
    case AUTH_ACTIONS.SET_SIGNING_OUT:
      return {
        ...state,
        isSigningOut: action.payload
      }
    case AUTH_ACTIONS.LOGIN_SUCCESS:
    case AUTH_ACTIONS.REGISTER_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        isSigningOut: false,
        error: null
      }
    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        isSigningOut: false,
        error: null
      }
    case AUTH_ACTIONS.UPDATE_PROFILE:
      return {
        ...state,
        user: action.payload,
        error: null
      }
    case AUTH_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      }
    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      }
    default:
      return state
  }
}

const AuthContext = createContext()

export { AuthContext }

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('🔐 AuthContext: Checking authentication state...');

        try {
          await authAPI.healthCheck();
          console.log('✅ Server connectivity confirmed');
        } catch (healthError) {
          console.warn('⚠️ Server health check failed, but continuing with offline mode:', healthError);
        }
        const token = localStorage.getItem('authToken')
        const user = apiUtils.getStoredUser()
        if (token && user) {
          console.log('🔐 Found stored auth data, restoring session for:', user.email);


          dispatch({
            type: AUTH_ACTIONS.LOGIN_SUCCESS,
            payload: {
              user,
              token
            }
          })
        } else {
          console.log('🔐 No stored auth data found');
          dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false })
        }
      } catch (error) {
        console.error('❌ Auth check error:', error);
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false })
      }
    }
    checkAuth()
  }, [])

  const register = async (userData) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true })
      dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR })
      console.log('🔐 Registration attempt with data:', userData)
      const response = await authAPI.register(userData)
      console.log('✅ Register API response:', response)

      const { token, user } = response.data
      console.log('📦 Extracted token and user:', { token: token ? 'present' : 'missing', user })

      localStorage.setItem('authToken', token)
      apiUtils.storeUser(user)
      dispatch({
        type: AUTH_ACTIONS.REGISTER_SUCCESS,
        payload: { user, token }
      })
      console.log('✅ Registration successful, dispatched REGISTER_SUCCESS')
      return { success: true, data: response.data }
    } catch (error) {
      console.error('❌ Registration error in AuthContext:', error)
      console.error('❌ Error response:', error.response?.data)
      const errorMessage = error.response?.data?.message || 'Registration failed'
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: errorMessage })
      return { success: false, error: errorMessage }
    }
  }

  const login = async (credentials) => {
    try {
      console.log('🔐 AuthContext: Starting login process...');
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true })
      dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR })
      console.log('🔐 AuthContext: Calling API login with credentials:', { 
        email: credentials.email, 
        hasPassword: !!credentials.password 
      });
      const response = await authAPI.login(credentials)
      console.log('✅ AuthContext: Login API response received:', response)
      if (!response.success) {
        throw new Error(response.message || 'Login failed');
      }


      const { token, user } = response.data
      if (!token || !user) {
        throw new Error('Invalid response from server - missing authentication data');
      }

      localStorage.setItem('authToken', token)
      apiUtils.storeUser(user)
      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: { user, token }
      })
      console.log('✅ AuthContext: Login successful, user authenticated:', { 
        userId: user.id, 
        email: user.email,
        tokenPresent: !!token
      })
      toast.success(`Welcome back, ${user.firstName}!`)
      return { success: true, data: response.data }
    } catch (error) {
      console.error('❌ AuthContext: Login error:', error)
      let errorMessage = 'Login failed. Please try again.';

      if (error.message) {
        errorMessage = error.message;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: errorMessage })
      toast.error(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false })
    }
  }

  const logout = async () => {
    try {

      dispatch({ type: AUTH_ACTIONS.SET_SIGNING_OUT, payload: true })
      toast.loading('Signing you out...', { id: 'logout' })

      await new Promise(resolve => setTimeout(resolve, 800))
      await authAPI.logout()
    } catch (error) {

      console.error('Logout API error:', error)
    } finally {

      apiUtils.clearAuthData()
      dispatch({ type: AUTH_ACTIONS.LOGOUT })

      toast.success('Successfully signed out!', { id: 'logout' })
    }
  }

  const updateProfile = async (profileData) => {
    try {
      dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR })

      await new Promise(resolve => setTimeout(resolve, 1000))

      const currentUser = JSON.parse(localStorage.getItem('user') || '{}')

      const updatedUser = {
        ...currentUser,
        ...profileData,

        id: currentUser.id,
        email: currentUser.email,

        updatedAt: new Date().toISOString()
      }

      localStorage.setItem('user', JSON.stringify(updatedUser))
      dispatch({
        type: AUTH_ACTIONS.UPDATE_PROFILE,
        payload: updatedUser
      })
      return { success: true, data: updatedUser }
    } catch (error) {
      const errorMessage = 'Profile update failed'
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: errorMessage })
      return { success: false, error: errorMessage }
    }
  }

  const changePassword = async (passwordData) => {
    try {
      dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR })

      await new Promise(resolve => setTimeout(resolve, 1500))

      const currentUser = JSON.parse(localStorage.getItem('user') || '{}')


      const updatedUser = {
        ...currentUser,

        passwordLastChanged: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      localStorage.setItem('user', JSON.stringify(updatedUser))
      dispatch({
        type: AUTH_ACTIONS.UPDATE_PROFILE,
        payload: updatedUser
      })
      return { success: true }
    } catch (error) {
      const errorMessage = 'Password change failed'
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: errorMessage })
      return { success: false, error: errorMessage }
    }
  }

  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR })
  }

  const hasRole = (role) => {
    return state.user?.role === role
  }

  const isAdmin = () => {
    return hasRole('admin')
  }

  const getFullName = () => {
    if (!state.user) return ''
    return `${state.user.firstName} ${state.user.lastName}`
  }

  const contextValue = {

    user: state.user,
    token: state.token,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    isSigningOut: state.isSigningOut,
    error: state.error,

    register,
    login,
    logout,
    updateProfile,
    changePassword,
    clearError,

    hasRole,
    isAdmin,
    getFullName
  }

  console.log('AuthContext state:', {
    isAuthenticated: state.isAuthenticated,
    user: state.user?.email,
    isLoading: state.isLoading
  })
  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const withAuth = (WrappedComponent) => {
  return (props) => {
    const { isAuthenticated, isLoading } = useAuth()
    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
          <div className="text-center">
            <div className="spinner-border animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-white">Loading...</p>
          </div>
        </div>
      )
    }
    if (!isAuthenticated) {

      window.location.href = '/signin'
      return null
    }
    return <WrappedComponent {...props} />
  }
}

export const withAdminAuth = (WrappedComponent) => {
  return (props) => {
    const { isAuthenticated, isAdmin: userIsAdmin, isLoading } = useAuth()
    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
          <div className="text-center">
            <div className="spinner-border animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-white">Loading...</p>
          </div>
        </div>
      )
    }
    if (!isAuthenticated || !userIsAdmin()) {

      window.location.href = '/'
      return null
    }
    return <WrappedComponent {...props} />
  }
}
export default AuthContext
