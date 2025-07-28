import React from 'react'
import { motion } from 'framer-motion'
import { Loader2, Plane } from 'lucide-react'
const LoadingSpinner = ({ 
  size = 'md', 
  text = 'Loading...', 
  variant = 'default',
  fullScreen = false 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  }
  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  }
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center z-50">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="mx-auto mb-4"
          >
            {variant === 'plane' ? (
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Plane className="w-8 h-8 text-white" />
              </div>
            ) : (
              <Loader2 className="w-16 h-16 text-blue-400" />
            )}
          </motion.div>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-white text-lg font-medium"
          >
            {text}
          </motion.p>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mt-4 max-w-xs mx-auto"
          />
        </div>
      </div>
    )
  }
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="mb-4"
      >
        {variant === 'plane' ? (
          <div className={`${sizeClasses[size]} bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center`}>
            <Plane className={`${sizeClasses.sm} text-white`} />
          </div>
        ) : (
          <Loader2 className={`${sizeClasses[size]} text-blue-400`} />
        )}
      </motion.div>
      {text && (
        <p className={`text-gray-300 ${textSizeClasses[size]} font-medium`}>
          {text}
        </p>
      )}
    </div>
  )
}
export default LoadingSpinner
