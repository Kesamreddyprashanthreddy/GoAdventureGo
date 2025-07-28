import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Camera,
  Save,
  Eye,
  EyeOff,
  Shield,
  Bell,
  Globe,
  CreditCard,
  Key,
  Loader2,
  CheckCircle,
  AlertCircle,
  Edit3
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import LoadingSpinner from '../components/LoadingSpinner'
const Profile = () => {
  const { user, updateProfile, changePassword } = useAuth()
  const [activeTab, setActiveTab] = useState('personal')
  const [isLoading, setIsLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [originalProfileData, setOriginalProfileData] = useState(null)
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    dateOfBirth: '',
    address: {
      street: '',
      city: '',
      state: '',
      country: '',
      zipCode: ''
    },
    preferences: {
      newsletter: true,
      notifications: true,
      language: 'en',
      currency: 'INR'
    }
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  useEffect(() => {
    if (user) {
      const newProfileData = {
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
        address: {
          street: user.address?.street || '',
          city: user.address?.city || '',
          state: user.address?.state || '',
          country: user.address?.country || 'India',
          zipCode: user.address?.zipCode || ''
        },
        preferences: {
          newsletter: user.preferences?.newsletter ?? true,
          notifications: user.preferences?.notifications ?? true,
          language: user.preferences?.language || 'en',
          currency: user.preferences?.currency || 'INR'
        }
      }
      setProfileData(newProfileData)
      setOriginalProfileData(JSON.parse(JSON.stringify(newProfileData))) // Deep copy
      setHasUnsavedChanges(false)
      setPageLoading(false)
    }
  }, [user])
  useEffect(() => {
    setTimeout(() => {
      if (!user) {
        setPageLoading(false)
      }
    }, 1000)
  }, [user])
  useEffect(() => {
    if (originalProfileData) {
      const hasChanges = JSON.stringify(profileData) !== JSON.stringify(originalProfileData)
      setHasUnsavedChanges(hasChanges)
    }
  }, [profileData, originalProfileData])
  const handleInputChange = (section, field, value) => {
    if (section === 'root') {
      setProfileData(prev => ({ ...prev, [field]: value }))
    } else {
      setProfileData(prev => ({
        ...prev,
        [section]: { ...prev[section], [field]: value }
      }))
    }
  }
  const handlePasswordChange = (field, value) => {
    setPasswordData(prev => ({ ...prev, [field]: value }))
  }
  const showMessage = (type, text) => {
    setMessage({ type, text })
    setTimeout(() => setMessage({ type: '', text: '' }), 5000)
  }
  const handleUpdateProfile = async () => {
    if (!profileData.firstName || !profileData.lastName) {
      showMessage('error', 'First name and last name are required')
      return
    }
    if (profileData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileData.email)) {
      showMessage('error', 'Please enter a valid email address')
      return
    }
    if (profileData.phoneNumber && !/^[\+]?[1-9][\d]{0,15}$/.test(profileData.phoneNumber.replace(/[^\d\+]/g, ''))) {
      showMessage('error', 'Please enter a valid phone number')
      return
    }
    try {
      setIsLoading(true)
      showMessage('', '') // Clear any existing messages
      const result = await updateProfile(profileData)
      if (result.success) {
        showMessage('success', 'Profile updated successfully! Your changes have been saved.')
        setOriginalProfileData(JSON.parse(JSON.stringify(profileData))) // Update original data
        setHasUnsavedChanges(false)
      } else {
        showMessage('error', result.error || 'Failed to update profile')
      }
    } catch (error) {
      console.error('Profile update error:', error)
      showMessage('error', 'Failed to update profile. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }
  const handlePasswordUpdate = async () => {
    if (!passwordData.currentPassword) {
      showMessage('error', 'Please enter your current password')
      return
    }
    if (!passwordData.newPassword) {
      showMessage('error', 'Please enter a new password')
      return
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showMessage('error', 'New passwords do not match')
      return
    }
    if (passwordData.newPassword.length < 6) {
      showMessage('error', 'Password must be at least 6 characters long')
      return
    }
    if (passwordData.newPassword === passwordData.currentPassword) {
      showMessage('error', 'New password must be different from current password')
      return
    }
    try {
      setIsLoading(true)
      showMessage('', '') // Clear any existing messages
      const result = await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      })
      if (result.success) {
        showMessage('success', 'Password updated successfully! Please use your new password for future logins.')
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
      } else {
        showMessage('error', result.error || 'Failed to update password')
      }
    } catch (error) {
      console.error('Password update error:', error)
      showMessage('error', 'Failed to update password. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }
  const tabs = [
    { id: 'personal', name: 'Personal Info', icon: User },
    { id: 'address', name: 'Address', icon: MapPin },
    { id: 'preferences', name: 'Preferences', icon: Globe },
    { id: 'security', name: 'Security', icon: Shield }
  ]
  if (pageLoading) {
    return <LoadingSpinner fullScreen text="Loading profile..." variant="plane" />
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-black pt-16 sm:pt-20 relative overflow-hidden">
      {}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-blue-500/3 rounded-full blur-2xl"></div>
      </div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          {}
          <div className="text-center mb-8 sm:mb-12">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative inline-block"
            >
              <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-4 sm:mb-6 relative">
                <div className="absolute -inset-1 sm:-inset-2 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-full blur opacity-75 animate-pulse"></div>
                <div className="relative w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-full flex items-center justify-center border border-white/20 backdrop-blur-sm">
                  <span className="text-2xl sm:text-4xl font-bold text-white drop-shadow-lg">
                    {user?.firstName?.charAt(0) || 'U'}
                  </span>
                </div>
                <button className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 border border-white/30">
                  <Camera className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                </button>
              </div>
              <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                {user?.firstName} {user?.lastName}
              </h1>
              <p className="text-gray-300 text-sm sm:text-base">{user?.email}</p>
            </motion.div>
          </div>
          {}
          {message.text && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mb-4 sm:mb-6 p-3 sm:p-4 rounded-xl sm:rounded-2xl flex items-center space-x-3 backdrop-blur-sm border ${
                message.type === 'success' 
                  ? 'bg-emerald-500/10 border-emerald-400/30 text-emerald-300' 
                  : 'bg-red-500/10 border-red-400/30 text-red-300'
              }`}
            >
              {message.type === 'success' ? (
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
              )}
              <span className="text-sm sm:text-base">{message.text}</span>
            </motion.div>
          )}
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 lg:gap-8">
            {}
            <div className="xl:col-span-1">
              <div className="glass-dark rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/10 backdrop-blur-xl bg-gray-900/40">
                {}
                <div className="xl:hidden mb-4">
                  <select
                    value={activeTab}
                    onChange={(e) => setActiveTab(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800/80 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent appearance-none cursor-pointer"
                  >
                    {tabs.map((tab) => (
                      <option key={tab.id} value={tab.id} className="bg-gray-800">
                        {tab.name}
                      </option>
                    ))}
                  </select>
                </div>
                {}
                <nav className="hidden xl:block space-y-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                          activeTab === tab.id
                            ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/30 shadow-lg shadow-cyan-500/10'
                            : 'text-gray-300 hover:text-cyan-300 hover:bg-gray-800/50 hover:border-cyan-500/20 border border-transparent'
                        }`}
                      >
                        <Icon className={`w-5 h-5 transition-all duration-300 ${
                          activeTab === tab.id ? 'text-cyan-400' : 'text-gray-400 group-hover:text-cyan-400'
                        }`} />
                        <span className="font-medium">{tab.name}</span>
                      </button>
                    )
                  })}
                </nav>
              </div>
            </div>
            {}
            <div className="xl:col-span-3">
              <div className="glass-dark rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 border border-white/10 backdrop-blur-xl bg-gray-900/40">
                {}
                {activeTab === 'personal' && (
                  <motion.div
                    key="personal"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <div className="flex items-center space-x-3 mb-6 sm:mb-8">
                      <div className="p-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-lg border border-cyan-500/30">
                        <User className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />
                      </div>
                      <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                        Personal Information
                      </h2>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                      <div>
                        <label className="block text-gray-300 font-medium mb-2 text-sm sm:text-base">First Name</label>
                        <input
                          type="text"
                          value={profileData.firstName}
                          onChange={(e) => handleInputChange('root', 'firstName', e.target.value)}
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-800/50 border border-white/20 rounded-lg sm:rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                          placeholder="Enter first name"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 font-medium mb-2 text-sm sm:text-base">Last Name</label>
                        <input
                          type="text"
                          value={profileData.lastName}
                          onChange={(e) => handleInputChange('root', 'lastName', e.target.value)}
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-800/50 border border-white/20 rounded-lg sm:rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                          placeholder="Enter last name"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 font-medium mb-2 text-sm sm:text-base">Email</label>
                        <input
                          type="email"
                          value={profileData.email}
                          onChange={(e) => handleInputChange('root', 'email', e.target.value)}
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-800/50 border border-white/20 rounded-lg sm:rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                          placeholder="Enter email"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 font-medium mb-2 text-sm sm:text-base">Phone Number</label>
                        <input
                          type="tel"
                          value={profileData.phoneNumber}
                          onChange={(e) => handleInputChange('root', 'phoneNumber', e.target.value)}
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-800/50 border border-white/20 rounded-lg sm:rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                          placeholder="Enter phone number"
                        />
                      </div>
                      <div className="lg:col-span-2">
                        <label className="block text-gray-300 font-medium mb-2 text-sm sm:text-base">Date of Birth</label>
                        <input
                          type="date"
                          value={profileData.dateOfBirth}
                          onChange={(e) => handleInputChange('root', 'dateOfBirth', e.target.value)}
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-800/50 border border-white/20 rounded-lg sm:rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-6 sm:mt-8">
                      {hasUnsavedChanges && (
                        <div className="flex items-center space-x-2 text-yellow-400 order-2 sm:order-1">
                          <AlertCircle className="w-4 h-4 flex-shrink-0" />
                          <span className="text-sm">You have unsaved changes</span>
                        </div>
                      )}
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleUpdateProfile}
                        disabled={isLoading || !hasUnsavedChanges}
                        className={`w-full sm:w-auto flex items-center justify-center space-x-2 px-6 sm:px-8 py-3 rounded-lg sm:rounded-xl font-semibold transition-all duration-300 order-1 sm:order-2 ${
                          hasUnsavedChanges 
                            ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-600 hover:to-blue-700 shadow-lg shadow-cyan-500/25' 
                            : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        } disabled:opacity-50`}
                      >
                        {isLoading ? (
                          <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                        ) : (
                          <Save className="w-4 h-4 sm:w-5 sm:h-5" />
                        )}
                        <span className="text-sm sm:text-base">{isLoading ? 'Saving...' : 'Save Changes'}</span>
                      </motion.button>
                    </div>
                  </motion.div>
                )}
                {}
                {activeTab === 'address' && (
                  <motion.div
                    key="address"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <div className="flex items-center space-x-3 mb-6 sm:mb-8">
                      <div className="p-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-lg border border-cyan-500/30">
                        <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />
                      </div>
                      <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                        Address Information
                      </h2>
                    </div>
                    <div className="space-y-4 sm:space-y-6">
                      <div>
                        <label className="block text-gray-300 font-medium mb-2 text-sm sm:text-base">Street Address</label>
                        <input
                          type="text"
                          value={profileData.address.street}
                          onChange={(e) => handleInputChange('address', 'street', e.target.value)}
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-800/50 border border-white/20 rounded-lg sm:rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                          placeholder="Enter street address"
                        />
                      </div>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                        <div>
                          <label className="block text-gray-300 font-medium mb-2 text-sm sm:text-base">City</label>
                          <input
                            type="text"
                            value={profileData.address.city}
                            onChange={(e) => handleInputChange('address', 'city', e.target.value)}
                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-800/50 border border-white/20 rounded-lg sm:rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                            placeholder="Enter city"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-300 font-medium mb-2 text-sm sm:text-base">State</label>
                          <input
                            type="text"
                            value={profileData.address.state}
                            onChange={(e) => handleInputChange('address', 'state', e.target.value)}
                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-800/50 border border-white/20 rounded-lg sm:rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                            placeholder="Enter state"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-300 font-medium mb-2 text-sm sm:text-base">Country</label>
                          <select
                            value={profileData.address.country}
                            onChange={(e) => handleInputChange('address', 'country', e.target.value)}
                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-800/50 border border-white/20 rounded-lg sm:rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300 backdrop-blur-sm appearance-none cursor-pointer"
                          >
                            <option value="India" className="bg-gray-800">India</option>
                            <option value="USA" className="bg-gray-800">United States</option>
                            <option value="UK" className="bg-gray-800">United Kingdom</option>
                            <option value="Canada" className="bg-gray-800">Canada</option>
                            <option value="Australia" className="bg-gray-800">Australia</option>
                            <option value="Other" className="bg-gray-800">Other</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-gray-300 font-medium mb-2 text-sm sm:text-base">ZIP Code</label>
                          <input
                            type="text"
                            value={profileData.address.zipCode}
                            onChange={(e) => handleInputChange('address', 'zipCode', e.target.value)}
                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-800/50 border border-white/20 rounded-lg sm:rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                            placeholder="Enter ZIP code"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-6 sm:mt-8">
                      {hasUnsavedChanges && (
                        <div className="flex items-center space-x-2 text-yellow-400 order-2 sm:order-1">
                          <AlertCircle className="w-4 h-4 flex-shrink-0" />
                          <span className="text-sm">You have unsaved changes</span>
                        </div>
                      )}
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleUpdateProfile}
                        disabled={isLoading || !hasUnsavedChanges}
                        className={`w-full sm:w-auto flex items-center justify-center space-x-2 px-6 sm:px-8 py-3 rounded-lg sm:rounded-xl font-semibold transition-all duration-300 order-1 sm:order-2 ${
                          hasUnsavedChanges 
                            ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-600 hover:to-blue-700 shadow-lg shadow-cyan-500/25' 
                            : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        } disabled:opacity-50`}
                      >
                        {isLoading ? (
                          <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                        ) : (
                          <Save className="w-4 h-4 sm:w-5 sm:h-5" />
                        )}
                        <span className="text-sm sm:text-base">{isLoading ? 'Saving...' : 'Save Changes'}</span>
                      </motion.button>
                    </div>
                  </motion.div>
                )}
                {}
                {activeTab === 'preferences' && (
                  <motion.div
                    key="preferences"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <div className="flex items-center space-x-3 mb-6 sm:mb-8">
                      <div className="p-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-lg border border-cyan-500/30">
                        <Globe className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />
                      </div>
                      <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                        Preferences
                      </h2>
                    </div>
                    <div className="space-y-6 sm:space-y-8">
                      {}
                      <div className="space-y-4">
                        <h3 className="text-base sm:text-lg font-semibold text-white">Notifications</h3>
                        <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-800/30 rounded-lg sm:rounded-xl border border-white/10 backdrop-blur-sm">
                          <div className="flex items-center space-x-3">
                            <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
                            <div>
                              <p className="text-white font-medium text-sm sm:text-base">Email Notifications</p>
                              <p className="text-gray-400 text-xs sm:text-sm">Receive booking updates and offers via email</p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleInputChange('preferences', 'notifications', !profileData.preferences.notifications)}
                            className={`relative inline-flex h-5 w-9 sm:h-6 sm:w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400 ${
                              profileData.preferences.notifications ? 'bg-gradient-to-r from-cyan-500 to-blue-600' : 'bg-gray-600'
                            }`}
                          >
                            <span
                              className={`inline-block h-3 w-3 sm:h-4 sm:w-4 transform rounded-full bg-white transition-transform ${
                                profileData.preferences.notifications ? 'translate-x-5 sm:translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                        <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-800/30 rounded-lg sm:rounded-xl border border-white/10 backdrop-blur-sm">
                          <div className="flex items-center space-x-3">
                            <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
                            <div>
                              <p className="text-white font-medium text-sm sm:text-base">Newsletter</p>
                              <p className="text-gray-400 text-xs sm:text-sm">Get travel tips and destination guides</p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleInputChange('preferences', 'newsletter', !profileData.preferences.newsletter)}
                            className={`relative inline-flex h-5 w-9 sm:h-6 sm:w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400 ${
                              profileData.preferences.newsletter ? 'bg-gradient-to-r from-cyan-500 to-blue-600' : 'bg-gray-600'
                            }`}
                          >
                            <span
                              className={`inline-block h-3 w-3 sm:h-4 sm:w-4 transform rounded-full bg-white transition-transform ${
                                profileData.preferences.newsletter ? 'translate-x-5 sm:translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                      </div>
                      {}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                        <div>
                          <label className="block text-gray-300 font-medium mb-2 text-sm sm:text-base">Language</label>
                          <select
                            value={profileData.preferences.language}
                            onChange={(e) => handleInputChange('preferences', 'language', e.target.value)}
                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-800/50 border border-white/20 rounded-lg sm:rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300 backdrop-blur-sm appearance-none cursor-pointer"
                          >
                            <option value="en" className="bg-gray-800">English</option>
                            <option value="hi" className="bg-gray-800">Hindi</option>
                            <option value="es" className="bg-gray-800">Spanish</option>
                            <option value="fr" className="bg-gray-800">French</option>
                            <option value="de" className="bg-gray-800">German</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-gray-300 font-medium mb-2 text-sm sm:text-base">Currency</label>
                          <select
                            value={profileData.preferences.currency}
                            onChange={(e) => handleInputChange('preferences', 'currency', e.target.value)}
                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-800/50 border border-white/20 rounded-lg sm:rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300 backdrop-blur-sm appearance-none cursor-pointer"
                          >
                            <option value="INR" className="bg-gray-800">Indian Rupee (₹)</option>
                            <option value="USD" className="bg-gray-800">US Dollar ($)</option>
                            <option value="EUR" className="bg-gray-800">Euro (€)</option>
                            <option value="GBP" className="bg-gray-800">British Pound (£)</option>
                            <option value="AUD" className="bg-gray-800">Australian Dollar (A$)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-6 sm:mt-8">
                      {hasUnsavedChanges && (
                        <div className="flex items-center space-x-2 text-yellow-400 order-2 sm:order-1">
                          <AlertCircle className="w-4 h-4 flex-shrink-0" />
                          <span className="text-sm">You have unsaved changes</span>
                        </div>
                      )}
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleUpdateProfile}
                        disabled={isLoading || !hasUnsavedChanges}
                        className={`w-full sm:w-auto flex items-center justify-center space-x-2 px-6 sm:px-8 py-3 rounded-lg sm:rounded-xl font-semibold transition-all duration-300 order-1 sm:order-2 ${
                          hasUnsavedChanges 
                            ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-600 hover:to-blue-700 shadow-lg shadow-cyan-500/25' 
                            : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        } disabled:opacity-50`}
                      >
                        {isLoading ? (
                          <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                        ) : (
                          <Save className="w-4 h-4 sm:w-5 sm:h-5" />
                        )}
                        <span className="text-sm sm:text-base">{isLoading ? 'Saving...' : 'Save Changes'}</span>
                      </motion.button>
                    </div>
                  </motion.div>
                )}
                {}
                {activeTab === 'security' && (
                  <motion.div
                    key="security"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <div className="flex items-center space-x-3 mb-6 sm:mb-8">
                      <div className="p-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-lg border border-cyan-500/30">
                        <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />
                      </div>
                      <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                        Security Settings
                      </h2>
                    </div>
                    <div className="space-y-4 sm:space-y-6">
                      <div>
                        <label className="block text-gray-300 font-medium mb-2 text-sm sm:text-base">Current Password</label>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            value={passwordData.currentPassword}
                            onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 pr-10 sm:pr-12 bg-gray-800/50 border border-white/20 rounded-lg sm:rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                            placeholder="Enter current password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-cyan-400 transition-colors"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-gray-300 font-medium mb-2 text-sm sm:text-base">New Password</label>
                        <input
                          type="password"
                          value={passwordData.newPassword}
                          onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-800/50 border border-white/20 rounded-lg sm:rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                          placeholder="Enter new password"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 font-medium mb-2 text-sm sm:text-base">Confirm New Password</label>
                        <input
                          type="password"
                          value={passwordData.confirmPassword}
                          onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-800/50 border border-white/20 rounded-lg sm:rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                          placeholder="Confirm new password"
                        />
                      </div>
                      <div className="p-3 sm:p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-lg sm:rounded-xl backdrop-blur-sm">
                        <div className="flex items-start space-x-3">
                          <Key className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <h4 className="text-yellow-400 font-medium text-sm sm:text-base">Password Requirements</h4>
                            <ul className="text-gray-300 text-xs sm:text-sm mt-2 space-y-1">
                              <li>• At least 6 characters long</li>
                              <li>• Contains both letters and numbers</li>
                              <li>• Avoid using personal information</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end mt-6 sm:mt-8">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handlePasswordUpdate}
                        disabled={isLoading || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                        className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 sm:px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg sm:rounded-xl font-semibold hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 disabled:opacity-50 shadow-lg shadow-cyan-500/25"
                      >
                        {isLoading ? (
                          <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                        ) : (
                          <Key className="w-4 h-4 sm:w-5 sm:h-5" />
                        )}
                        <span className="text-sm sm:text-base">{isLoading ? 'Updating...' : 'Update Password'}</span>
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Profile
