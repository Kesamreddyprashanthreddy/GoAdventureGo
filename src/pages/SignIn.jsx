import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock, Loader2, ArrowRight, User } from 'lucide-react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { useAuth } from '../contexts/AuthContext'
const SignIn = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields')
      return
    }
    setIsLoading(true)
    try {
      const result = await login(formData)
      if (result.success) {
        toast.success('Welcome back!')
        const selectedHotel = localStorage.getItem('selectedHotel')
        if (selectedHotel) {
          navigate('/checkout')
        } else {
          navigate('/')
        }
      } else {
        toast.error(result.error || 'Invalid email or password')
      }
    } catch (error) {
      console.error('Login error:', error)
      toast.error('Login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 sm:mx-auto sm:w-full sm:max-w-md"
      >
        {}
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-center"
        >
          <div className="mx-auto flex justify-center">
            <div className="relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-60"></div>
              <div className="relative w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
          <h2 className="mt-6 text-center text-4xl font-bold text-white">
            Welcome Back
          </h2>
          <p className="mt-3 text-center text-lg text-gray-300">
            Sign in to continue your adventure
          </p>
          <p className="mt-2 text-center text-sm text-gray-400">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-medium text-blue-400 hover:text-blue-300 transition-colors"
            >
              Create one here
            </Link>
          </p>
        </motion.div>
      </motion.div>
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="relative z-10 mt-8 sm:mx-auto sm:w-full sm:max-w-md"
      >
        <div className="glass-dark rounded-3xl py-10 px-8 shadow-2xl border border-white/10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 pl-12 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                  placeholder="your.email@example.com"
                />
                <Mail className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
              </div>
            </motion.div>
            {}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 pl-12 pr-12 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                  placeholder="Enter your password"
                />
                <Lock className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </motion.button>
              </div>
            </motion.div>
            {}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center justify-end"
            >
              <Link
                to="/forgot-password"
                className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors"
              >
                Forgot your password?
              </Link>
            </motion.div>
            {}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full relative overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-700 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10 flex items-center justify-center space-x-3">
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Signing you in...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </div>
                {!isLoading && (
                  <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 hover:left-full transition-all duration-700"></div>
                )}
              </motion.button>
            </motion.div>
            {}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="relative"
            >
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-slate-900 text-gray-400">New to GoAdventure?</span>
              </div>
            </motion.div>
            {}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Link to="/register">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  className="w-full py-4 px-8 bg-white/10 border border-white/20 text-white font-medium rounded-xl hover:bg-white/20 transition-all duration-300 backdrop-blur-sm"
                >
                  Create New Account
                </motion.button>
              </Link>
            </motion.div>
          </form>
        </div>
      </motion.div>
    </div>
  )
}
export default SignIn
