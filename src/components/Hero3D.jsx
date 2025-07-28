import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
const Hero3D = () => {
  const [currentSlogan, setCurrentSlogan] = useState(0)
  const slogans = [
    "Discover Your Next Adventure",
    "Explore the World in 3D",
    "Adventure Awaits Everywhere",
    "Your Journey Starts Here"
  ]
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlogan((prev) => (prev + 1) % slogans.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000"
          style={{
            backgroundImage: `url('/css/images/Mountain.jpg')`
          }}
        />
        {}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/75 via-slate-800/65 to-slate-900/75" />
        {}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-slate-800/40" />
      </div>
      {}
      <div className="absolute inset-0 mix-blend-multiply" style={{
        background: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)'
      }}>
        {}
        <div className="absolute inset-0 opacity-20">
          <div 
            className="w-full h-full"
            style={{
              backgroundImage: `radial-gradient(1px 1px at 20px 30px, #ffffff, transparent),
                               radial-gradient(1px 1px at 40px 70px, rgba(255,255,255,0.8), transparent),
                               radial-gradient(1px 1px at 90px 40px, #ffffff, transparent),
                               radial-gradient(1px 1px at 130px 80px, rgba(255,255,255,0.6), transparent)`,
              backgroundRepeat: 'repeat',
              backgroundSize: '150px 100px'
            }}
          />
        </div>
        {}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-teal-400/50 rounded-full animate-pulse"></div>
          <div className="absolute top-3/4 left-3/4 w-1 h-1 bg-orange-400/60 rounded-full animate-ping animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/3 w-1.5 h-1.5 bg-blue-400/40 rounded-full animate-pulse animation-delay-4000"></div>
          <div className="absolute top-1/3 left-2/3 w-1 h-1 bg-purple-400/50 rounded-full animate-ping"></div>
        </div>
      </div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex items-center justify-center min-h-screen">
          {}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-8 max-w-4xl mx-auto"
          >
            {}
            <div className="space-y-4">
              <motion.h1 
                className="text-5xl sm:text-6xl lg:text-8xl font-space font-bold leading-tight"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1, delay: 0.2 }}
              >
                <span className="bg-gradient-to-r from-teal-400 via-teal-300 to-teal-500 bg-clip-text text-transparent block">Go</span>
                <span className="bg-gradient-to-r from-orange-400 via-orange-300 to-orange-500 bg-clip-text text-transparent block">Adventure</span>
              </motion.h1>
              {}
              <div className="h-16 flex items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={currentSlogan}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.6 }}
                    className="text-xl sm:text-2xl lg:text-3xl text-gray-100 font-medium"
                  >
                    {slogans[currentSlogan]}
                  </motion.p>
                </AnimatePresence>
              </div>
            </div>
            {}
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed"
            >
              Explore breathtaking destinations around the globe. From tropical beaches to snow-capped mountains, 
              your perfect adventure is just a click away.
            </motion.p>
            {}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link to="/packages">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 text-white text-lg px-8 py-4 rounded-xl flex items-center space-x-3 shadow-lg shadow-teal-500/25 hover:shadow-teal-400/40 transition-all duration-300 group backdrop-blur-sm border border-teal-400/20"
                >
                  <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  <span>Start Exploring</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </Link>
              <Link to="/about">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white/10 hover:bg-white/20 text-white text-lg px-8 py-4 rounded-xl border border-white/20 hover:border-white/30 backdrop-blur-sm transition-all duration-300"
                >
                  Learn More
                </motion.button>
              </Link>
            </motion.div>
            {}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="grid grid-cols-3 gap-6 pt-8 border-t border-white/20"
            >
              {[
                { label: 'Destinations', value: '200+' },
                { label: 'Happy Travelers', value: '50K+' },
                { label: 'Adventure Tours', value: '1000+' }
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-teal-400">{stat.value}</div>
                  <div className="text-gray-400 text-sm">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
      {}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 2.5 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
      >
        <div className="flex flex-col items-center space-y-2">
          <div className="text-gray-400 text-sm">Scroll to explore</div>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 h-3 bg-teal-400 rounded-full mt-2"
            />
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
export default Hero3D
