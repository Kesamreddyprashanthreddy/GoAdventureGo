import React, { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Plane, MapPin, Hotel, CreditCard, User, Home, Package, MessageCircle, Info, LogOut, Settings, ChevronDown, Loader2 } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
const Navbar = () => {
  const { user, isAuthenticated, logout, isLoading, isSigningOut } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const location = useLocation()
  const userMenuRef = useRef(null)
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false)
      }
    }
    if (userMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }
  }, [userMenuOpen])
  if (isLoading) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 bg-surface-light/95 dark:bg-surface-dark/95 backdrop-blur-xl border-b border-border-light dark:border-border-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-accent-500 rounded-xl flex items-center justify-center">
                <Plane className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-text-light-primary dark:text-text-dark-primary">GoAdventure</span>
            </Link>
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-400"></div>
          </div>
        </div>
      </nav>
    )
  }
  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Packages', path: '/packages', icon: Package },
    { name: 'Hotels', path: '/hotels', icon: Hotel },
    { name: 'Flight', path: '/flight', icon: Plane },
    { name: 'Blogs', path: '/blogs', icon: MessageCircle },
    { name: 'About', path: '/about', icon: Info },
    { name: 'Contact', path: '/contact', icon: MapPin }
  ]
  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-surface-light/95 dark:bg-surface-dark/95 backdrop-blur-xl border-b border-border-light dark:border-border-dark' 
        : 'bg-surface-light/80 dark:bg-surface-dark/80 backdrop-blur-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <Link to="/" className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-primary-400 to-accent-500 rounded-lg sm:rounded-xl flex items-center justify-center hover-glow-primary transition-all duration-300">
              <Plane className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
            </div>
            <span className="text-lg sm:text-xl font-bold text-gradient-primary">GoAdventure</span>
          </Link>
          <div className="hidden lg:flex items-center space-x-4 xl:space-x-6">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 text-sm font-medium ${
                    isActive 
                      ? 'text-primary-400 bg-primary-100/20 dark:bg-primary-900/30 border border-primary-300/30 dark:border-primary-600/30' 
                      : 'text-text-light-secondary dark:text-text-dark-secondary hover:text-primary-600 dark:hover:text-primary-400 hover:bg-surface-light/50 dark:hover:bg-surface-dark/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 px-2 sm:px-3 py-2 rounded-lg bg-surface-light/10 dark:bg-surface-dark/10 hover:bg-surface-light/20 dark:hover:bg-surface-dark/20 transition-all duration-300 border border-border-light/30 dark:border-border-dark/30"
                >
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-primary-400 to-accent-500 rounded-full flex items-center justify-center">
                    <span className="text-xs sm:text-sm font-bold text-white">
                      {user?.firstName?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <span className="text-text-light-primary dark:text-text-dark-primary hidden md:block font-medium text-sm">
                    {user?.firstName || user?.email?.split('@')[0] || 'User'}
                  </span>
                  <ChevronDown className={`w-3 h-3 sm:w-4 sm:h-4 text-text-light-secondary dark:text-text-dark-secondary transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark shadow-xl z-[60] backdrop-blur-xl"
                    >
                      <div className="py-2">
                        <div className="px-4 py-2 text-sm text-text-light-secondary dark:text-text-dark-secondary border-b border-border-light dark:border-border-dark truncate">
                          {user?.email}
                        </div>
                        <div className="px-4 py-2 text-xs text-text-light-secondary dark:text-text-dark-secondary bg-primary-50 dark:bg-primary-900/20 border-b border-border-light dark:border-border-dark">
                          💡 Browse packages to start booking
                        </div>
                        <Link
                          to="/bookings"
                          className="flex items-center space-x-2 px-4 py-2 text-text-light-secondary dark:text-text-dark-secondary hover:text-primary-600 dark:hover:text-primary-400 hover:bg-surface-light/50 dark:hover:bg-surface-dark/50 transition-colors"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <Package className="w-4 h-4" />
                          <span>My Bookings</span>
                        </Link>
                        <Link
                          to="/profile"
                          className="flex items-center space-x-2 px-4 py-2 text-text-light-secondary dark:text-text-dark-secondary hover:text-primary-600 dark:hover:text-primary-400 hover:bg-surface-light/50 dark:hover:bg-surface-dark/50 transition-colors"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <Settings className="w-4 h-4" />
                          <span>Profile</span>
                        </Link>
                        <hr className="border-border-light dark:border-border-dark my-1" />
                        <button
                          onClick={() => {
                            logout()
                            setUserMenuOpen(false)
                          }}
                          disabled={isSigningOut}
                          className="flex items-center space-x-2 px-4 py-2 text-error-light dark:text-error-dark hover:text-error-light/80 dark:hover:text-error-dark/80 hover:bg-error-light/10 dark:hover:bg-error-dark/10 transition-colors w-full text-left rounded-lg disabled:opacity-50"
                        >
                          {isSigningOut ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <LogOut className="w-4 h-4" />
                          )}
                          <span>{isSigningOut ? 'Signing Out...' : 'Sign Out'}</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center space-x-2 sm:space-x-3">
                <Link
                  to="/signin"
                  className="px-3 sm:px-4 py-2 text-text-light-secondary dark:text-text-dark-secondary hover:text-primary-600 dark:hover:text-primary-400 transition-colors text-sm font-medium"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="btn-primary text-sm"
                >
                  Sign Up
                </Link>
              </div>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-lg text-text-light-secondary dark:text-text-dark-secondary hover:text-text-light-primary dark:hover:text-text-dark-primary hover:bg-surface-light/50 dark:hover:bg-surface-dark/50 transition-colors"
            >
              {isOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-surface-light dark:bg-surface-dark border-t border-border-light dark:border-border-dark"
          >
            <div className="px-4 py-4 space-y-2 max-h-[calc(100vh-4rem)] overflow-y-auto">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.path
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-300 ${
                      isActive 
                        ? 'text-primary-400 bg-primary-100/20 dark:bg-primary-900/30 border border-primary-300/30 dark:border-primary-600/30' 
                        : 'text-text-light-secondary dark:text-text-dark-secondary hover:text-primary-600 dark:hover:text-primary-400 hover:bg-surface-light/50 dark:hover:bg-surface-dark/50'
                    }`}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                )
              })}
              {isAuthenticated ? (
                <div className="pt-4 border-t border-border-light dark:border-border-dark space-y-2">
                  <div className="px-3 py-2 text-sm text-text-light-secondary dark:text-text-dark-secondary">
                    Signed in as {user?.firstName || user?.email?.split('@')[0]}
                  </div>
                  <Link
                    to="/bookings"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center space-x-3 px-3 py-3 rounded-lg text-text-light-secondary dark:text-text-dark-secondary hover:text-primary-600 dark:hover:text-primary-400 hover:bg-surface-light/50 dark:hover:bg-surface-dark/50 transition-colors"
                  >
                    <Package className="w-5 h-5 flex-shrink-0" />
                    <span>My Bookings</span>
                  </Link>
                  <Link
                    to="/profile"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center space-x-3 px-3 py-3 rounded-lg text-text-light-secondary dark:text-text-dark-secondary hover:text-primary-600 dark:hover:text-primary-400 hover:bg-surface-light/50 dark:hover:bg-surface-dark/50 transition-colors"
                  >
                    <Settings className="w-5 h-5 flex-shrink-0" />
                    <span>Profile</span>
                  </Link>
                  <button
                    onClick={() => {
                      logout()
                      setIsOpen(false)
                    }}
                    disabled={isSigningOut}
                    className="flex items-center space-x-3 px-3 py-3 rounded-lg text-error-light dark:text-error-dark hover:text-error-light/80 dark:hover:text-error-dark/80 hover:bg-error-light/10 dark:hover:bg-error-dark/10 transition-colors w-full text-left disabled:opacity-50"
                  >
                    {isSigningOut ? (
                      <Loader2 className="w-5 h-5 flex-shrink-0 animate-spin" />
                    ) : (
                      <LogOut className="w-5 h-5 flex-shrink-0" />
                    )}
                    <span>{isSigningOut ? 'Signing Out...' : 'Sign Out'}</span>
                  </button>
                </div>
              ) : (
                <div className="pt-4 border-t border-border-light dark:border-border-dark space-y-2">
                  <Link
                    to="/signin"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center px-3 py-3 rounded-lg text-text-light-secondary dark:text-text-dark-secondary hover:text-primary-600 dark:hover:text-primary-400 hover:bg-surface-light/50 dark:hover:bg-surface-dark/50 transition-colors font-medium"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center btn-primary font-medium"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
export default Navbar
