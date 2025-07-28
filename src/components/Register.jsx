import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Phone, Eye, EyeOff, UserPlus, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
const Register = () => {
  const { isAuthenticated, register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one lowercase letter, one uppercase letter, and one number';
    }
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (formData.phone && !/^[\+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/[\s-()]/g, ''))) {
      newErrors.phone = 'Phone number is invalid';
    }
    return newErrors;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true);
    setErrors({});
    try {
      const { confirmPassword, phone, ...registerData } = formData;
      const dataToSend = {
        ...registerData,
        phoneNumber: phone || '' // Ensure phoneNumber is always a string
      };
      if (!dataToSend.firstName || !dataToSend.lastName || !dataToSend.email || !dataToSend.password) {
        throw new Error('Missing required fields');
      }
      console.log('🚀 Sending registration data:', dataToSend);
      console.log('🔍 Field validation:', {
        hasFirstName: !!dataToSend.firstName,
        hasLastName: !!dataToSend.lastName,
        hasEmail: !!dataToSend.email,
        hasPassword: !!dataToSend.password,
        phoneNumber: dataToSend.phoneNumber
      });
      const result = await register(dataToSend);
      console.log('📊 Registration result:', result);
      if (result.success) {
        toast.success('Registration successful! Welcome to GoAdventure!');
        setTimeout(() => {
          navigate('/');
        }, 1500);
      } else {
        console.error('Registration failed with result:', result);
        throw new Error(result.error || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Registration failed. Please try again.';
      setErrors({ general: errorMessage });
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
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
        transition={{ duration: 0.8 }}
        className="relative z-10 max-w-md w-full space-y-8"
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
                <UserPlus className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
          <h2 className="mt-6 text-center text-4xl font-bold text-white">
            Join GoAdventure
          </h2>
          <p className="mt-3 text-center text-lg text-gray-300">
            Create your account and start exploring
          </p>
          <p className="mt-2 text-center text-sm text-gray-400">
            Already have an account?{' '}
            <Link 
              to="/signin" 
              className="font-medium text-blue-400 hover:text-blue-300 transition-colors"
            >
              Sign in here
            </Link>
          </p>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-dark rounded-3xl py-10 px-8 shadow-2xl border border-white/10"
        >
          <form className="space-y-6" onSubmit={handleSubmit}>
            {errors.general && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-red-500/20 border border-red-500/50 text-red-300 px-4 py-3 rounded-xl"
              >
                {errors.general}
              </motion.div>
            )}
            {}
            <div className="grid grid-cols-2 gap-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-2">
                  First Name
                </label>
                <div className="relative">
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 pl-12 bg-white/10 border ${
                      errors.firstName ? 'border-red-400' : 'border-white/20'
                    } rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 backdrop-blur-sm`}
                    placeholder="John"
                  />
                  <User className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                </div>
                {errors.firstName && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1 text-xs text-red-400"
                  >
                    {errors.firstName}
                  </motion.p>
                )}
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-2">
                  Last Name
                </label>
                <div className="relative">
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 pl-12 bg-white/10 border ${
                      errors.lastName ? 'border-red-400' : 'border-white/20'
                    } rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 backdrop-blur-sm`}
                    placeholder="Doe"
                  />
                  <User className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                </div>
                {errors.lastName && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1 text-xs text-red-400"
                  >
                    {errors.lastName}
                  </motion.p>
                )}
              </motion.div>
            </div>
            {}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 pl-12 bg-white/10 border ${
                    errors.email ? 'border-red-400' : 'border-white/20'
                  } rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 backdrop-blur-sm`}
                  placeholder="john@example.com"
                />
                <Mail className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
              </div>
              {errors.email && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1 text-xs text-red-400"
                >
                  {errors.email}
                </motion.p>
              )}
            </motion.div>
            {}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                Phone Number (Optional)
              </label>
              <div className="relative">
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 pl-12 bg-white/10 border ${
                    errors.phone ? 'border-red-400' : 'border-white/20'
                  } rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 backdrop-blur-sm`}
                  placeholder="+1 (555) 123-4567"
                />
                <Phone className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
              </div>
              {errors.phone && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1 text-xs text-red-400"
                >
                  {errors.phone}
                </motion.p>
              )}
            </motion.div>
            {}
            <div className="grid grid-cols-1 gap-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
              >
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 pl-12 pr-12 bg-white/10 border ${
                      errors.password ? 'border-red-400' : 'border-white/20'
                    } rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 backdrop-blur-sm`}
                    placeholder="Create a strong password"
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
                {errors.password && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1 text-xs text-red-400"
                  >
                    {errors.password}
                  </motion.p>
                )}
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
              >
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 pl-12 pr-12 bg-white/10 border ${
                      errors.confirmPassword ? 'border-red-400' : 'border-white/20'
                    } rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 backdrop-blur-sm`}
                    placeholder="Confirm your password"
                  />
                  <Lock className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-3.5 text-gray-400 hover:text-white transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </motion.button>
                </div>
                {errors.confirmPassword && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1 text-xs text-red-400"
                  >
                    {errors.confirmPassword}
                  </motion.p>
                )}
              </motion.div>
            </div>
            {}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="pt-4"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full relative overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-700 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10 flex items-center justify-center space-x-3">
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Creating your account...</span>
                    </>
                  ) : (
                    <>
                      <span>Create Account</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </div>
                {!loading && (
                  <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 hover:left-full transition-all duration-700"></div>
                )}
              </motion.button>
            </motion.div>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
}
export default Register;
