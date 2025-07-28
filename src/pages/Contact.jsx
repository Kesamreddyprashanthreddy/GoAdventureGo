import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Send, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  CheckCircle, 
  User,
  MessageSquare,
  Loader2,
  X
} from 'lucide-react'
import toast from 'react-hot-toast'
import LoadingSpinner from '../components/LoadingSpinner'
import PageBackground from '../components/PageBackground'
const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [showAlert, setShowAlert] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    setTimeout(() => setIsLoading(false), 800)
  }, [])
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }
  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setTimeout(() => {
      setShowAlert(true)
      setIsSubmitting(false)
      setFormData({ name: '', email: '', subject: '', message: '' })
      toast.success('Message sent successfully!')
      setTimeout(() => setShowAlert(false), 5000)
    }, 1000)
  }
  if (isLoading) {
    return <LoadingSpinner fullScreen text="Loading contact information..." variant="plane" />
  }
  const contactInfo = [
    {
      icon: MapPin,
      title: 'Visit Us',
      details: ['123 Adventure Street', 'Travel City, TC 12345'],
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Phone,
      title: 'Call Us',
      details: ['+1 (555) 123-4567', 'Mon - Fri: 9AM - 6PM'],
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Mail,
      title: 'Email Us',
      details: ['info@goadventure.com', 'support@goadventure.com'],
      color: 'from-green-500 to-emerald-500'
    }
  ]
  return (
    <PageBackground variant="contact" className="pt-20">
      {}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative py-20 px-4"
      >
        <div className="container mx-auto text-center relative z-10 max-w-4xl">
          <motion.h1 
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-5xl md:text-7xl font-bold text-white mb-6 bg-gradient-to-r from-teal-400 to-orange-400 bg-clip-text text-transparent"
          >
            Get in Touch
          </motion.h1>
          <motion.p 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto"
          >
            Have questions about your travel plans? We're here to help! 
            Get in touch with our travel experts and let's plan your next adventure.
          </motion.p>
        </div>
      </motion.section>
      {}
      <section className="px-4 pb-20">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {}
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-2"
            >
              <div className="glass-dark rounded-3xl p-8 border border-white/10">
                <h2 className="text-3xl font-bold text-white mb-8 flex items-center">
                  <MessageSquare className="w-8 h-8 mr-3 text-blue-400" />
                  Send us a Message
                </h2>
                {}
                <AnimatePresence>
                  {showAlert && (
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-xl flex items-start space-x-3"
                    >
                      <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-green-300 font-medium">Message sent successfully!</p>
                        <p className="text-green-400 text-sm mt-1">We'll get back to you within 24 hours.</p>
                      </div>
                      <button
                        onClick={() => setShowAlert(false)}
                        className="text-green-400 hover:text-green-300"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-300 font-medium mb-2">
                        Full Name *
                      </label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Enter your full name"
                          required
                          className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-gray-300 font-medium mb-2">
                        Email Address *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="Enter your email address"
                          required
                          className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-300 font-medium mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="What is your inquiry about?"
                      required
                      className="w-full px-4 py-4 bg-white/5 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 font-medium mb-2">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      rows={6}
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Please provide details about your inquiry..."
                      required
                      className="w-full px-4 py-4 bg-white/5 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent resize-none"
                    />
                  </div>
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                    whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                    className="w-full neon-button px-8 py-4 rounded-2xl flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Sending Message...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        <span>Send Message</span>
                      </>
                    )}
                  </motion.button>
                </form>
              </div>
            </motion.div>
            {}
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="space-y-6"
            >
              {contactInfo.map((info, index) => (
                <motion.div
                  key={info.title}
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="glass-dark rounded-2xl p-6 border border-white/10 text-center hover:border-white/20 transition-all duration-300"
                >
                  <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-r ${info.color} rounded-xl flex items-center justify-center`}>
                    <info.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{info.title}</h3>
                  <div className="space-y-1">
                    {info.details.map((detail, idx) => (
                      <p key={idx} className="text-gray-300 text-sm">{detail}</p>
                    ))}
                  </div>
                </motion.div>
              ))}
              {}
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="glass-dark rounded-2xl p-6 border border-white/10"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3 text-center">Response Time</h3>
                <p className="text-gray-300 text-sm text-center mb-2">
                  We typically respond within
                </p>
                <p className="text-blue-400 font-bold text-center text-lg">2-4 hours</p>
                <p className="text-gray-400 text-xs text-center mt-2">
                  During business hours
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
      {}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="px-4 pb-20"
      >
        <div className="container mx-auto max-w-4xl">
          <div className="glass-dark rounded-3xl p-8 border border-white/10 text-center">
            <h3 className="text-3xl font-bold text-white mb-6">Need Quick Answers?</h3>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Check out our comprehensive FAQ section or browse our travel guides 
              for instant answers to common questions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="glass-button px-8 py-3 rounded-xl"
              >
                View FAQ
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="neon-button px-8 py-3 rounded-xl"
              >
                Browse Travel Guides
              </motion.button>
            </div>
          </div>
        </div>
      </motion.section>
    </PageBackground>
  )
}
export default Contact
