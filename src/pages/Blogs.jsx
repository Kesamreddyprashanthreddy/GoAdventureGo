import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Calendar, 
  User, 
  ExternalLink, 
  Mail, 
  Search,
  Filter,
  Clock,
  ArrowRight,
  BookOpen,
  MapPin,
  Tag
} from 'lucide-react'
import toast from 'react-hot-toast'
import LoadingSpinner from '../components/LoadingSpinner'
import PageBackground from '../components/PageBackground'
const Blogs = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {

    setTimeout(() => setIsLoading(false), 1200)
  }, [])
  const blogs = [
    {
      id: 1,
      title: 'Pokhara Adventure Guide',
      image: '/css/images/pokhara.jpg',
      description: 'One of the most beautiful yet low budget natural destination in our neighbouring country Nepal. Famous for mountain villages and pristine lakes.',
      link: 'http://thatbackpacker.com/2017/09/22/guide-to-pokhara-for-non-hikers/',
      author: 'Travel Expert',
      date: 'December 15, 2023',
      category: 'mountains',
      readTime: '8 min read',
      tags: ['Nepal', 'Budget Travel', 'Nature']
    },
    {
      id: 2,
      title: 'Jaipur - The Pink City',
      image: '/css/images/jaipur.jpg',
      description: 'Explore the vibrant culture and stunning architecture of Rajasthan\'s capital city. Known for its pink-colored buildings and rich history.',
      link: '#',
      author: 'Culture Enthusiast',
      date: 'November 28, 2023',
      category: 'culture',
      readTime: '6 min read',
      tags: ['India', 'Culture', 'Architecture']
    },
    {
      id: 3,
      title: 'Kolkata Heritage Walk',
      image: '/css/images/kolkata.jpg',
      description: 'Discover the cultural heart of India through its colonial architecture, literary heritage, and vibrant street life.',
      link: '#',
      author: 'Heritage Guide',
      date: 'November 10, 2023',
      category: 'culture',
      readTime: '7 min read',
      tags: ['India', 'Heritage', 'Walking Tour']
    },
    {
      id: 4,
      title: 'Mountain Adventures',
      image: '/css/images/Mountain.jpg',
      description: 'Tips and tricks for mountain climbing, hiking gear essentials, and safety measures for high-altitude adventures.',
      link: '#',
      author: 'Adventure Guide',
      date: 'October 22, 2023',
      category: 'adventure',
      readTime: '10 min read',
      tags: ['Hiking', 'Safety', 'Gear']
    },
    {
      id: 5,
      title: 'Night Photography Tips',
      image: '/css/images/night.jpg',
      description: 'Master the art of night photography during your travels. Learn about camera settings, composition, and equipment.',
      link: '#',
      author: 'Photo Expert',
      date: 'October 5, 2023',
      category: 'photography',
      readTime: '5 min read',
      tags: ['Photography', 'Night', 'Tips']
    },
    {
      id: 6,
      title: 'Kyoto Temple Trail',
      image: '/css/images/Kyoto.jpg',
      description: 'A spiritual journey through ancient temples and traditional gardens in Japan\'s former capital city.',
      link: '#',
      author: 'Spiritual Traveler',
      date: 'September 18, 2023',
      category: 'culture',
      readTime: '9 min read',
      tags: ['Japan', 'Temples', 'Spiritual']
    }
  ]
  const categories = [
    { id: 'all', name: 'All Posts', icon: BookOpen },
    { id: 'adventure', name: 'Adventure', icon: MapPin },
    { id: 'culture', name: 'Culture', icon: BookOpen },
    { id: 'photography', name: 'Photography', icon: BookOpen },
    { id: 'mountains', name: 'Mountains', icon: MapPin }
  ]
  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         blog.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         blog.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === 'all' || blog.category === selectedCategory
    return matchesSearch && matchesCategory
  })
  const handleReadMore = (link) => {
    if (link !== '#') {
      window.open(link, '_blank')
    } else {
      toast('Coming soon!', { icon: '📝' })
    }
  }
  const handleNewsletterSubmit = (e) => {
    e.preventDefault()
    if (email) {
      toast.success('Successfully subscribed to newsletter!')
      setEmail('')
    }
  }
  if (isLoading) {
    return <LoadingSpinner fullScreen text="Loading travel blogs..." variant="plane" />
  }
  return (
    <PageBackground variant="packages" className="pt-20">
      {}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative py-20 px-4"
      >
        <div className="container mx-auto text-center relative z-10">
          <motion.h1 
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-5xl md:text-7xl font-bold text-white mb-6 bg-gradient-to-r from-teal-400 to-orange-400 bg-clip-text text-transparent"
          >
            Travel Blogs
          </motion.h1>
          <motion.p 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto"
          >
            Discover amazing travel stories, insider tips, and authentic experiences 
            from fellow adventurers around the globe
          </motion.p>
        </div>
      </motion.section>
      {}
      <motion.section 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="px-4 mb-8"
      >
        <div className="container mx-auto">
          <div className="glass-dark rounded-3xl p-8 border border-white/10">
            {}
            <div className="relative mb-8">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
              <input
                type="text"
                placeholder="Search blogs by title, content, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-lg"
              />
            </div>
            {}
            <div className="flex flex-wrap gap-4 justify-center">
              {categories.map(category => (
                <motion.button
                  key={category.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all duration-300 ${
                    selectedCategory === category.id
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg glow'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20 border border-white/20'
                  }`}
                >
                  <category.icon className="w-5 h-5" />
                  <span className="font-medium">{category.name}</span>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </motion.section>
      {}
      <section className="px-4 pb-20">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-white">
              {filteredBlogs.length} Post{filteredBlogs.length !== 1 ? 's' : ''} Found
            </h2>
            <div className="text-gray-400">
              {selectedCategory !== 'all' && `Filtered by ${categories.find(c => c.id === selectedCategory)?.name}`}
            </div>
          </div>
          <AnimatePresence>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredBlogs.map((blog, index) => (
                <motion.div
                  key={blog.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -50 }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-dark rounded-3xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-300 group"
                >
                  {}
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={blog.image} 
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      onError={(e) => {
                        e.target.src = '/css/images/blog.png'
                      }}
                    />
                    {}
                    <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{blog.readTime}</span>
                    </div>
                    {}
                    <div className="absolute top-4 right-4 bg-blue-500/90 text-white px-3 py-1 rounded-full text-sm font-semibold capitalize">
                      {blog.category}
                    </div>
                  </div>
                  {}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                      {blog.title}
                    </h3>
                    <p className="text-gray-300 mb-4 text-sm line-clamp-3">
                      {blog.description}
                    </p>
                    {}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {blog.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-white/10 text-gray-300 text-xs rounded-lg border border-white/20"
                        >
                          <Tag className="w-3 h-3 inline mr-1" />
                          {tag}
                        </span>
                      ))}
                    </div>
                    {}
                    <div className="flex items-center justify-between mb-4 text-gray-400 text-sm">
                      <div className="flex items-center space-x-1">
                        <User className="w-4 h-4" />
                        <span>{blog.author}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{blog.date}</span>
                      </div>
                    </div>
                    {}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleReadMore(blog.link)}
                      disabled={blog.link === '#'}
                      className={`w-full px-6 py-3 rounded-xl flex items-center justify-center space-x-2 transition-all duration-300 ${
                        blog.link === '#' 
                          ? 'glass-button opacity-50 cursor-not-allowed'
                          : 'neon-button'
                      }`}
                    >
                      <span>{blog.link === '#' ? 'Coming Soon' : 'Read More'}</span>
                      {blog.link !== '#' ? (
                        <ExternalLink className="w-4 h-4" />
                      ) : (
                        <ArrowRight className="w-4 h-4" />
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
          {}
          {filteredBlogs.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-2xl font-bold text-white mb-2">No Blog Posts Found</h3>
              <p className="text-gray-400 mb-6">Try adjusting your search or filters</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setSearchTerm('')
                  setSelectedCategory('all')
                }}
                className="neon-button px-8 py-3 rounded-xl"
              >
                Clear Filters
              </motion.button>
            </motion.div>
          )}
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
          <div className="glass-dark rounded-3xl p-8 text-center border border-white/10">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6"
            >
              <Mail className="w-8 h-8 text-white" />
            </motion.div>
            <h3 className="text-3xl font-bold text-white mb-4">Stay Updated</h3>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Subscribe to our newsletter to get the latest travel stories, destination guides, 
              and exclusive tips delivered directly to your inbox.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto">
              <div className="flex space-x-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="flex-1 px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  required
                />
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="neon-button px-6 py-3 rounded-xl flex items-center space-x-2"
                >
                  <span>Subscribe</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </div>
            </form>
          </div>
        </div>
      </motion.section>
    </PageBackground>
  )
}
export default Blogs
