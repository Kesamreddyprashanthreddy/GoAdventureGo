import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
const Login = () => {
  const { isAuthenticated, login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

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
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
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
      console.log('🔐 Login component: Attempting login with:', { 
        email: formData.email, 
        hasPassword: !!formData.password 
      });
      const result = await login(formData);
      console.log('🔐 Login component: Login result:', result);
      if (!result.success) {
        console.error('🔐 Login component: Login failed:', result.error);
        setErrors({ 
          general: result.error || 'Login failed. Please check your credentials and try again.' 
        });
      } else {
        console.log('✅ Login component: Login successful');

      }
    } catch (error) {
      console.error('❌ Login component: Login error:', error);
      let errorMessage = 'Login failed. Please try again.';
      if (error.message) {
        errorMessage = error.message;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      setErrors({ general: errorMessage });
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-md w-full space-y-8"
      >
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center bg-indigo-100 rounded-full">
            <svg className="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link 
              to="/register" 
              className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200"
            >
              create a new account
            </Link>
          </p>
        </div>
        <motion.form 
          className="mt-8 space-y-6" 
          onSubmit={handleSubmit}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {errors.general && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg"
            >
              {errors.general}
            </motion.div>
          )}
          {}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-blue-50 border border-blue-200 rounded-lg p-4"
          >
            <h4 className="text-sm font-semibold text-blue-800 mb-2">Demo Credentials (For Testing)</h4>
            <div className="space-y-2 text-sm text-blue-700">
              <div className="flex justify-between">
                <span>Admin:</span>
                <span className="font-mono">admin@goadventurego.com / Admin123!</span>
              </div>
              <div className="flex justify-between">
                <span>User:</span>
                <span className="font-mono">john@example.com / User123!</span>
              </div>
            </div>
            <div className="mt-2 flex gap-2">
              <button
                type="button"
                onClick={() => setFormData({ email: 'admin@goadventurego.com', password: 'Admin123!' })}
                className="text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Use Admin
              </button>
              <button
                type="button"
                onClick={() => setFormData({ email: 'john@example.com', password: 'User123!' })}
                className="text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Use User
              </button>
            </div>
          </motion.div>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className={`relative block w-full px-3 py-2 border ${
                  errors.email ? 'border-red-300' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition-colors duration-200`}
                placeholder="Email address"
              />
              {errors.email && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1 text-xs text-red-600"
                >
                  {errors.email}
                </motion.p>
              )}
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleChange}
                className={`relative block w-full px-3 py-2 border ${
                  errors.password ? 'border-red-300' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition-colors duration-200`}
                placeholder="Password"
              />
              {errors.password && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1 text-xs text-red-600"
                >
                  {errors.password}
                </motion.p>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>
            <div className="text-sm">
              <Link 
                to="/forgot-password" 
                className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200"
              >
                Forgot your password?
              </Link>
            </div>
          </div>
          <div>
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className={`group relative w-full flex justify-center py-3 px-6 border border-transparent text-base font-semibold rounded-xl text-white transition-all duration-300 ${
                loading 
                  ? 'bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed shadow-none' 
                  : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-700 hover:via-purple-700 hover:to-indigo-800 focus:outline-none focus:ring-4 focus:ring-indigo-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
              }`}
              style={{
                background: loading 
                  ? undefined 
                  : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                boxShadow: loading 
                  ? undefined 
                  : '0 10px 25px rgba(102, 126, 234, 0.3), 0 6px 12px rgba(118, 75, 162, 0.2)',
              }}
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-4">
                {loading ? (
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                ) : (
                  <svg className="h-5 w-5 text-white group-hover:text-indigo-100 transition-colors duration-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a5 5 0 0110 0z" clipRule="evenodd" />
                  </svg>
                )}
              </span>
              <span className="relative">
                {loading ? 'Signing you in...' : 'Sign In'}
              </span>
              {!loading && (
                <motion.span
                  className="absolute right-4 inset-y-0 flex items-center"
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <svg className="h-5 w-5 text-white group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </motion.span>
              )}
            </motion.button>
          </div>
        </motion.form>
      </motion.div>
    </div>
  );
};
export default Login;
