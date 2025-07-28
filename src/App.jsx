import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { AuthProvider } from './contexts/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ModernAIAssistant from './components/ModernAIAssistant'
import Home from './pages/Home'
import Packages from './pages/Packages'
import Hotels from './pages/Hotels'
import Flight from './pages/Flight'
import CheckoutNew from './pages/CheckoutNew'
import QuickPayment from './pages/QuickPayment'
import Contact from './pages/Contact'
import AboutUs from './pages/AboutUs'
import Blogs from './pages/Blogs'
import SignIn from './pages/SignIn'
import Login from './components/Login'
import Register from './components/Register'
import MyBookings from './pages/MyBookings'
import Profile from './pages/Profile'
function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white">
        {}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-slow"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-slow animation-delay-2000"></div>
          <div className="absolute top-40 left-1/2 w-60 h-60 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-slow animation-delay-4000"></div>
        </div>
        <div className="relative z-10">
          <Navbar />
          <main className="pt-20">
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Home />
                  </motion.div>
                } />
                <Route path="/packages" element={
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Packages />
                  </motion.div>
                } />
                <Route path="/hotels" element={<Hotels />} />
                <Route path="/flight" element={<Flight />} />
                <Route path="/checkout" element={<CheckoutNew />} />
                <Route path="/quick-payment" element={<QuickPayment />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/blogs" element={<Blogs />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/login" element={<SignIn />} />
                <Route path="/register" element={<Register />} />
                <Route path="/bookings" element={<MyBookings />} />
                <Route path="/profile" element={<Profile />} />
              </Routes>
            </AnimatePresence>
          </main>
          <Footer />
          <ModernAIAssistant />
        </div>
      </div>
    </AuthProvider>
  )
}
export default App
