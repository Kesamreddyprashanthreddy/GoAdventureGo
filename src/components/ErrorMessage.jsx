import React from 'react'
import { motion } from 'framer-motion'
import { AlertCircle, XCircle, RefreshCw, Home } from 'lucide-react'
import { Link } from 'react-router-dom'
const ErrorMessage = ({ 
  title = 'Something went wrong',
  message = 'An unexpected error occurred. Please try again.',
  type = 'error',
  onRetry = null,
  showHomeButton = false,
  className = ''
}) => {
  const getIcon = () => {
    switch (type) {
      case 'warning':
        return <AlertCircle className="w-12 h-12 text-yellow-400" />
      case 'info':
        return <AlertCircle className="w-12 h-12 text-blue-400" />
      default:
        return <XCircle className="w-12 h-12 text-red-400" />
    }
  }
  const getBgColor = () => {
    switch (type) {
      case 'warning':
        return 'from-yellow-500/10 to-orange-500/10'
      case 'info':
        return 'from-blue-500/10 to-cyan-500/10'
      default:
        return 'from-red-500/10 to-pink-500/10'
    }
  }
  const getBorderColor = () => {
    switch (type) {
      case 'warning':
        return 'border-yellow-500/20'
      case 'info':
        return 'border-blue-500/20'
      default:
        return 'border-red-500/20'
    }
  }
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`max-w-md mx-auto p-8 rounded-2xl bg-gradient-to-br ${getBgColor()} backdrop-blur-sm border ${getBorderColor()} ${className}`}
    >
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 300 }}
          className="mb-4"
        >
          {getIcon()}
        </motion.div>
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl font-semibold text-white mb-2"
        >
          {title}
        </motion.h3>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-gray-300 mb-6"
        >
          {message}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          {onRetry && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onRetry}
              className="flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Try Again</span>
            </motion.button>
          )}
          {showHomeButton && (
            <Link to="/">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center space-x-2 px-6 py-3 bg-white/10 text-white font-medium rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                <Home className="w-4 h-4" />
                <span>Go Home</span>
              </motion.button>
            </Link>
          )}
        </motion.div>
      </div>
    </motion.div>
  )
}
export default ErrorMessage
