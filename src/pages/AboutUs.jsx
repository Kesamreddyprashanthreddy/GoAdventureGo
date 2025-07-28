import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Users, 
  Lightbulb, 
  Shield, 
  Heart,
  MapPin,
  Globe,
  Award,
  Star,
  ArrowRight,
  Camera,
  Compass
} from 'lucide-react'
import LoadingSpinner from '../components/LoadingSpinner'
import PageBackground from '../components/PageBackground'
const AboutUs = () => {
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {

    setTimeout(() => setIsLoading(false), 1000)
  }, [])
  const features = [
    {
      icon: Users,
      title: 'Personalized Experiences',
      description: 'We understand that every traveler is different, which is why we offer customized travel plans and itineraries that suit your preferences.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Lightbulb,
      title: 'Expert Advice',
      description: 'Our team of seasoned travelers provides insights and advice based on firsthand experiences.',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      icon: Shield,
      title: 'Trustworthy Partners',
      description: 'We work with reputable travel providers to ensure you have a safe and enjoyable trip.',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Heart,
      title: 'Community Focused',
      description: 'Join our growing community of adventurers who share their stories, tips, and inspiration for future journeys.',
      color: 'from-pink-500 to-rose-500'
    }
  ]
  const stats = [
    { number: '10K+', label: 'Happy Travelers', icon: Users },
    { number: '50+', label: 'Destinations', icon: MapPin },
    { number: '5★', label: 'Average Rating', icon: Star },
    { number: '24/7', label: 'Support', icon: Globe }
  ]
  const teamValues = [
    {
      title: 'Passion for Adventure',
      description: 'We live and breathe travel, constantly seeking new experiences and hidden gems.',
      icon: Compass
    },
    {
      title: 'Sustainable Travel',
      description: 'We promote responsible tourism that respects local cultures and environments.',
      icon: Globe
    },
    {
      title: 'Excellence in Service',
      description: 'Every detail matters when creating your perfect travel experience.',
      icon: Award
    }
  ]
  if (isLoading) {
    return <LoadingSpinner fullScreen text="Loading about information..." variant="plane" />
  }
  return (
    <PageBackground variant="about">
      {}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative py-20 px-4 pt-32"
      >
        <div className="container mx-auto text-center relative z-10 max-w-6xl">
          {}
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <div className="w-48 h-48 mx-auto rounded-full overflow-hidden border-4 border-white/20 shadow-2xl backdrop-blur-sm">
              <img
                src="/css/images/mohit.png"
                alt="Team"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = '/css/images/logo.png'
                }}
              />
            </div>
          </motion.div>
          <motion.h1 
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-5xl md:text-7xl font-bold text-white mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
          >
            GoAdventureGO
          </motion.h1>
          <motion.p 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto"
          >
            Welcome to GoAdventureGO, your ultimate gateway to unforgettable travel experiences!
            Every journey is an adventure waiting to be discovered.
          </motion.p>
        </div>
      </motion.section>
      {}
      <section className="px-4 pb-20">
        <div className="container mx-auto max-w-6xl">
          {}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="glass-dark rounded-3xl p-8 mb-16 border border-white/10"
          >
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl font-bold text-white mb-8 text-center">Our Story</h2>
              <div className="space-y-6 text-gray-300 leading-relaxed">
                <p className="text-lg">
                  At GoAdventureGO, we believe that every journey is an adventure waiting to be discovered. 
                  Our mission is to inspire, guide, and empower travelers like you to explore the world with 
                  confidence and excitement. Whether you're planning a serene getaway or an adrenaline-packed 
                  expedition, we're here to make your travel dreams a reality.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                  <div>
                    <h3 className="text-2xl font-bold text-blue-400 mb-4 flex items-center">
                      <Users className="w-6 h-6 mr-2" />
                      Who We Are
                    </h3>
                    <p>
                      GoAdventureGO is a passionate team of travel enthusiasts, explorers, and industry experts 
                      who share a deep love for discovering new destinations and cultures. Our diverse backgrounds 
                      and experiences enable us to curate the best travel content, tips, and recommendations 
                      tailored to your unique interests.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-purple-400 mb-4 flex items-center">
                      <Camera className="w-6 h-6 mr-2" />
                      What We Do
                    </h3>
                    <p>
                      From detailed travel guides and itineraries to insider tips and the latest travel trends, 
                      GoAdventureGO is your go-to resource for all things travel. We partner with top hotels, 
                      tour operators, and local guides to bring you exclusive deals and personalized recommendations 
                      that make every trip extraordinary.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          {}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-dark rounded-2xl p-6 text-center border border-white/10 hover:border-white/20 transition-all duration-300"
              >
                <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-gray-300 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
          {}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-12 text-center">Why Choose Us?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ x: index % 2 === 0 ? -50 : 50, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-dark rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300"
                >
                  <div className={`w-12 h-12 mb-4 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
          {}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-12 text-center">Our Values</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {teamValues.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="glass-dark rounded-2xl p-6 text-center border border-white/10 hover:border-white/20 transition-all duration-300"
                >
                  <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <value.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">{value.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
          {}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="glass-dark rounded-3xl p-8 border border-white/10 text-center"
          >
            <h3 className="text-4xl font-bold text-white mb-6">Ready for Your Next Adventure?</h3>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join us on GoAdventureGO, and let's make your next adventure the best one yet!
              Discover amazing destinations and create memories that will last a lifetime.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="neon-button px-8 py-4 rounded-xl flex items-center justify-center"
              >
                <span>Start Your Journey</span>
                <ArrowRight className="w-5 h-5 ml-2" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="glass-button px-8 py-4 rounded-xl"
              >
                Explore Packages
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </PageBackground>
  )
}
export default AboutUs
