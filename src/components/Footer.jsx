import React from 'react'
import { motion } from 'framer-motion'
import { Facebook, Twitter, Instagram, Mail, MapPin, Phone, Clock } from 'lucide-react'
const Footer = () => {
  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Mail, href: 'mailto:info@goadventure.com', label: 'Email' }
  ]
  const quickLinks = [
    { name: 'About Us', href: '/about' },
    { name: 'Packages', href: '/packages' },
    { name: 'Blogs', href: '/blogs' },
    { name: 'Contact', href: '/contact' }
  ]
  const contactInfo = [
    { icon: MapPin, text: 'Adventure Street, Travel City, TC 12345' },
    { icon: Phone, text: '+1 (555) 123-4567' },
    { icon: Mail, text: 'info@goadventure.com' },
    { icon: Clock, text: '24/7 Customer Support' }
  ]
  return (
    <footer className="relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>
      {}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
      <div className="relative">
        {}
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-1"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 rounded-lg flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-xl">GA</span>
                </div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  GoAdventure
                </h3>
              </div>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Your trusted companion for extraordinary adventures. We create unforgettable travel experiences that inspire and transform.
              </p>
              {}
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20 hover:bg-gradient-to-r hover:from-blue-500 hover:via-purple-600 hover:to-pink-500 hover:border-transparent transition-all duration-300 shadow-lg hover:shadow-purple-500/25"
                    aria-label={social.label}
                  >
                    <social.icon className="w-5 h-5" />
                  </motion.a>
                ))}
              </div>
            </motion.div>
            {}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <h4 className="text-xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Quick Links</h4>
              <ul className="space-y-3">
                {quickLinks.map((link, index) => (
                  <li key={link.name}>
                    <motion.a
                      href={link.href}
                      whileHover={{ x: 5 }}
                      className="text-gray-300 hover:text-blue-400 transition-colors duration-200 flex items-center space-x-2 group"
                    >
                      <span className="w-1 h-1 bg-blue-400 rounded-full group-hover:bg-purple-400 transition-colors"></span>
                      <span>{link.name}</span>
                    </motion.a>
                  </li>
                ))}
              </ul>
            </motion.div>
            {}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <h4 className="text-xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Contact Info</h4>
              <ul className="space-y-4">
                {contactInfo.map((item, index) => (
                  <li key={index} className="flex items-start space-x-3 group">
                    <item.icon className="w-5 h-5 text-blue-400 group-hover:text-purple-400 mt-0.5 flex-shrink-0 transition-colors" />
                    <span className="text-gray-300 text-sm leading-relaxed">{item.text}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
            {}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <h4 className="text-xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Stay Updated</h4>
              <p className="text-gray-300 mb-4 text-sm">
                Subscribe to get the latest travel deals and destination guides.
              </p>
              <div className="space-y-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent backdrop-blur-sm transition-all duration-300"
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 text-white rounded-xl font-medium hover:from-blue-600 hover:via-purple-700 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-purple-500/25"
                >
                  Subscribe
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
        {}
        <div className="border-t border-white/20 bg-black/20 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="text-gray-300 text-sm"
              >
                © 2024 GoAdventure. All rights reserved. Made with ❤️ for adventurers.
              </motion.p>
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="flex space-x-6 text-sm"
              >
                <a href="#" className="text-gray-300 hover:text-purple-400 transition-colors">Privacy Policy</a>
                <a href="#" className="text-gray-300 hover:text-purple-400 transition-colors">Terms of Service</a>
                <a href="#" className="text-gray-300 hover:text-purple-400 transition-colors">Cookie Policy</a>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
export default Footer
