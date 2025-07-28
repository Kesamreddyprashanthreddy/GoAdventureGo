import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User, 
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  MapPin,
  Calendar,
  CreditCard,
  Plane,
  Hotel,
  Package,
  ArrowRight,
  Brain,
  Zap
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'
const ModernAIAssistant = () => {
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { 
      type: 'bot', 
      text: `Hello! ✨ I'm Hail, your AI travel companion. I'm here to make your travel dreams come true!`,
      timestamp: new Date(),
      suggestions: ['Explore Destinations', 'Book a Trip', 'Travel Tips', 'Help Me Plan']
    }
  ])
  const [inputText, setInputText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const [conversationContext, setConversationContext] = useState({
    intent: null,
    entities: {},
    stage: 'greeting'
  })
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const recognition = useRef(null)
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }
  useEffect(() => {
    scrollToBottom()
  }, [messages])
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition
      recognition.current = new SpeechRecognition()
      recognition.current.continuous = false
      recognition.current.interimResults = false
      recognition.current.lang = 'en-US'
      recognition.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        setInputText(transcript)
        setIsListening(false)
      }
      recognition.current.onerror = () => {
        setIsListening(false)
        toast.error('Speech recognition failed. Please try again.')
      }
      recognition.current.onend = () => {
        setIsListening(false)
      }
    }
  }, [])
  const addMessage = (type, content) => {
    const newMessage = {
      type,
      ...content,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, newMessage])
  }
  const analyzeIntent = (message) => {
    const lowerMessage = message.toLowerCase()
    const intents = {
      booking: /book|reserve|buy|purchase|order/,
      destination: /destination|place|where|travel to|visit/,
      hotel: /hotel|accommodation|stay|lodge|resort/,
      flight: /flight|fly|airline|plane|airport/,
      package: /package|deal|tour|trip|vacation/,
      price: /price|cost|budget|cheap|expensive|how much/,
      weather: /weather|climate|temperature|season/,
      recommendation: /recommend|suggest|best|top|popular/,
      help: /help|assist|support|guide|how/,
      greeting: /hello|hi|hey|good morning|good afternoon|good evening/
    }
    for (const [intent, pattern] of Object.entries(intents)) {
      if (pattern.test(lowerMessage)) {
        return intent
      }
    }
    return 'general'
  }
  const extractEntities = (message) => {
    const entities = {}
    const lowerMessage = message.toLowerCase()
    const locations = ['paris', 'london', 'tokyo', 'new york', 'dubai', 'bali', 'maldives', 'switzerland', 'norway', 'iceland', 'andaman', 'goa', 'kerala', 'rajasthan', 'himalaya']
    locations.forEach(location => {
      if (lowerMessage.includes(location)) {
        entities.destination = location
      }
    })
    const datePattern = /(\d{1,2}[-/]\d{1,2}[-/]\d{2,4})|tomorrow|today|next week|next month/
    const dateMatch = message.match(datePattern)
    if (dateMatch) {
      entities.date = dateMatch[0]
    }
    const numberPattern = /\b\d+\b/g
    const numbers = message.match(numberPattern)
    if (numbers) {
      entities.numbers = numbers
    }
    return entities
  }
  const generateResponse = (message, intent, entities) => {
    const userName = user?.firstName || 'there'
    switch (intent) {
      case 'greeting':
        return {
          text: `Hello ${userName}! 🌟 I'm Hail, and I'm absolutely thrilled to help you plan an incredible journey! What kind of adventure are you dreaming of today?`,
          suggestions: ['Beach Paradise', 'Mountain Adventure', 'City Explorer', 'Cultural Journey'],
          quickActions: [
            { text: 'Show Popular Destinations', action: 'destinations' },
            { text: 'Browse Packages', action: 'packages' }
          ]
        }
      case 'destination':
        if (entities.destination) {
          return {
            text: `Excellent choice! ${entities.destination.charAt(0).toUpperCase() + entities.destination.slice(1)} is absolutely magical! ✨ Let me show you what we have there...`,
            card: {
              title: `${entities.destination.charAt(0).toUpperCase() + entities.destination.slice(1)} Adventure`,
              description: 'Discover amazing experiences in this beautiful destination',
              image: `/css/images/${entities.destination}.jpg`,
              price: 'From $1,299',
              action: 'View Packages'
            },
            suggestions: ['See Hotels', 'Check Flights', 'View Packages', 'Travel Tips']
          }
        }
        return {
          text: `I'd love to help you find the perfect destination! 🗺️ What type of experience are you looking for?`,
          suggestions: ['Beach & Islands', 'Mountains & Adventure', 'Cities & Culture', 'Wildlife & Nature'],
          carousel: [
            { title: 'Tropical Paradise', image: '/css/images/andaman.jpg', description: 'Crystal clear waters' },
            { title: 'Mountain Escape', image: '/css/images/himalaya.jpg', description: 'Breathtaking views' },
            { title: 'Cultural Journey', image: '/css/images/fuji.jpg', description: 'Rich heritage' }
          ]
        }
      case 'booking':
        if (!isAuthenticated) {
          return {
            text: `I'd love to help you book! But first, you'll need to sign in to your account. Don't worry, it's quick and easy! 🔐`,
            suggestions: ['Sign In', 'Create Account'],
            quickActions: [
              { text: 'Sign In', action: 'signin' },
              { text: 'Register', action: 'register' }
            ]
          }
        }
        return {
          text: `Perfect! I'm ready to help you book an amazing trip, ${userName}! 🎉 What would you like to book?`,
          suggestions: ['Complete Package', 'Flight Only', 'Hotel Only', 'Custom Trip'],
          quickActions: [
            { text: 'Browse Packages', action: 'packages' },
            { text: 'Find Flights', action: 'flights' },
            { text: 'Book Hotels', action: 'hotels' }
          ]
        }
      case 'package':
        return {
          text: `Our packages are designed to give you the complete experience! 📦 Here are some of our most popular ones:`,
          packageGrid: [
            {
              name: 'Andaman Paradise',
              price: '$1,299',
              duration: '5 Days',
              image: '/css/images/andaman.jpg',
              highlights: ['Pristine Beaches', 'Water Sports', 'Island Hopping']
            },
            {
              name: 'Himalaya Adventure',
              price: '$1,899',
              duration: '7 Days',
              image: '/css/images/himalaya.jpg',
              highlights: ['Trekking', 'Mountain Views', 'Local Culture']
            },
            {
              name: 'Iceland Discovery',
              price: '$2,499',
              duration: '6 Days',
              image: '/css/images/iceland.jpg',
              highlights: ['Northern Lights', 'Glaciers', 'Hot Springs']
            }
          ],
          suggestions: ['View All Packages', 'Custom Package', 'Budget Options']
        }
      case 'flight':
        return {
          text: `Let's get you flying! ✈️ I can help you find the best flights with great prices and convenient timings.`,
          suggestions: ['Domestic Flights', 'International', 'Round Trip', 'One Way'],
          quickActions: [
            { text: 'Search Flights', action: 'flights' }
          ]
        }
      case 'hotel':
        return {
          text: `I'll help you find the perfect place to stay! 🏨 From budget-friendly to luxury, we have options for every traveler.`,
          suggestions: ['Budget Hotels', 'Luxury Resorts', 'Business Hotels', 'Boutique Hotels'],
          quickActions: [
            { text: 'Find Hotels', action: 'hotels' }
          ]
        }
      case 'price':
        return {
          text: `Great question about pricing! 💰 Our packages are designed for every budget:\n\n🌟 Budget: $500-1,200\n✨ Premium: $1,200-2,500\n👑 Luxury: $2,500+\n\nWhat's your budget range?`,
          suggestions: ['Under $1000', '$1000-2000', '$2000-3000', 'Above $3000']
        }
      case 'help':
        return {
          text: `I'm here to help! 🤝 I can assist you with:\n\n🎯 Finding destinations\n📦 Booking packages\n✈️ Flight bookings\n🏨 Hotel reservations\n💡 Travel tips\n🔧 Technical support\n\nWhat do you need help with?`,
          suggestions: ['Booking Help', 'Travel Tips', 'Account Issues', 'Payment Support']
        }
      default:
        return {
          text: `I understand you're interested in travel! 🌍 I'm here to help make your journey amazing. What specific aspect of your trip can I assist with?`,
          suggestions: ['Plan Trip', 'Book Now', 'Get Recommendations', 'Ask Question']
        }
    }
  }
  const handleSendMessage = async () => {
    if (inputText.trim() === '') return
    const userMessage = inputText.trim()
    addMessage('user', { text: userMessage })
    setInputText('')
    setIsTyping(true)
    const intent = analyzeIntent(userMessage)
    const entities = extractEntities(userMessage)
    setConversationContext(prev => ({
      ...prev,
      intent,
      entities: { ...prev.entities, ...entities },
      stage: intent
    }))
    const typingDelay = 1000 + Math.random() * 1500
    setTimeout(() => {
      const response = generateResponse(userMessage, intent, entities)
      addMessage('bot', response)
      setIsTyping(false)
      if (voiceEnabled && response.text) {
        speakText(response.text.replace(/[✨🌟🎉🔐📦💰🤝🌍]/g, ''))
      }
    }, typingDelay)
  }
  const handleSuggestionClick = (suggestion) => {
    setInputText(suggestion)
    setTimeout(() => handleSendMessage(), 100)
  }
  const handleQuickAction = (action) => {
    switch (action) {
      case 'destinations':
      case 'packages':
        navigate('/packages')
        toast.success('Taking you to our packages!')
        break
      case 'flights':
        navigate('/flight')
        toast.success('Opening flight search!')
        break
      case 'hotels':
        navigate('/hotels')
        toast.success('Finding hotels for you!')
        break
      case 'signin':
        navigate('/signin')
        toast.success('Opening sign in page!')
        break
      case 'register':
        navigate('/register')
        toast.success('Opening registration!')
        break
      default:
        toast.info('Feature coming soon!')
    }
    setIsOpen(false)
  }
  const startListening = () => {
    if (recognition.current && !isListening) {
      setIsListening(true)
      recognition.current.start()
    }
  }
  const speakText = (text) => {
    if ('speechSynthesis' in window && voiceEnabled) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.9
      utterance.pitch = 1.1
      speechSynthesis.speak(utterance)
    }
  }
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }
  const toggleChatbot = () => {
    setIsOpen(!isOpen)
    if (!isOpen) {
      toast.success('Hail is here to help! 🌟')
    }
  }
  return (
    <>
      {}
      <motion.div className="fixed bottom-6 right-6 z-50">
        <motion.button
          onClick={toggleChatbot}
          className={`relative w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 ${
            isOpen 
              ? 'bg-red-500 hover:bg-red-600' 
              : 'bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500 hover:from-purple-600 hover:via-blue-600 hover:to-cyan-600'
          }`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          animate={{ 
            rotate: isOpen ? 180 : 0,
          }}
        >
          {}
          {!isOpen && (
            <motion.div
              className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.7, 0, 0.7]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          )}
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -180, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 180, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className="w-6 h-6 text-white" />
              </motion.div>
            ) : (
              <motion.div
                key="ai"
                initial={{ rotate: 180, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -180, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="relative"
              >
                <Brain className="w-6 h-6 text-white" />
                <Sparkles className="absolute -top-1 -right-1 w-3 h-3 text-yellow-300" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </motion.div>
      {}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-24 right-6 w-96 h-[600px] glass-dark rounded-2xl shadow-2xl z-40 flex flex-col overflow-hidden border border-white/10"
          >
            {}
            <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
                </div>
                <div>
                  <h3 className="font-semibold text-white flex items-center gap-2">
                    Hail AI Assistant
                    <Sparkles className="w-4 h-4 text-yellow-300" />
                  </h3>
                  <p className="text-blue-100 text-sm">Ready to plan your adventure</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setVoiceEnabled(!voiceEnabled)}
                  className="p-1 rounded-full hover:bg-white/10 transition-colors"
                  title={voiceEnabled ? 'Disable voice' : 'Enable voice'}
                >
                  {voiceEnabled ? (
                    <Volume2 className="w-4 h-4 text-white" />
                  ) : (
                    <VolumeX className="w-4 h-4 text-white" />
                  )}
                </button>
              </div>
            </div>
            {}
            <div className="flex-1 p-4 overflow-y-auto custom-scrollbar space-y-4">
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start space-x-2 max-w-[85%] ${
                    message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}>
                    {}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.type === 'user' 
                        ? 'bg-gradient-to-br from-green-400 to-blue-500' 
                        : 'bg-gradient-to-br from-purple-400 via-blue-400 to-cyan-400'
                    }`}>
                      {message.type === 'user' ? (
                        <User className="w-4 h-4 text-white" />
                      ) : (
                        <Brain className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <div className="space-y-2">
                      {}
                      <div className={`p-3 rounded-2xl ${
                        message.type === 'user'
                          ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white'
                          : 'bg-white/10 text-white border border-white/10 backdrop-blur-sm'
                      }`}>
                        <p className="text-sm whitespace-pre-line">{message.text}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      {}
                      {message.packageGrid && (
                        <div className="grid gap-2">
                          {message.packageGrid.map((pkg, pkgIndex) => (
                            <motion.div
                              key={pkgIndex}
                              whileHover={{ scale: 1.02 }}
                              className="bg-white/5 border border-white/10 rounded-xl p-3 cursor-pointer hover:bg-white/10 transition-all"
                              onClick={() => navigate('/packages')}
                            >
                              <div className="flex items-center space-x-3">
                                <img 
                                  src={pkg.image} 
                                  alt={pkg.name}
                                  className="w-12 h-12 rounded-lg object-cover"
                                />
                                <div className="flex-1">
                                  <h4 className="font-semibold text-white text-sm">{pkg.name}</h4>
                                  <p className="text-xs text-gray-300">{pkg.duration} • {pkg.price}</p>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {pkg.highlights.map((highlight, hIndex) => (
                                      <span 
                                        key={hIndex}
                                        className="text-xs bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full"
                                      >
                                        {highlight}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      )}
                      {}
                      {message.card && (
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          className="bg-white/5 border border-white/10 rounded-xl overflow-hidden cursor-pointer hover:bg-white/10 transition-all"
                          onClick={() => navigate('/packages')}
                        >
                          <img 
                            src={message.card.image} 
                            alt={message.card.title}
                            className="w-full h-24 object-cover"
                          />
                          <div className="p-3">
                            <h4 className="font-semibold text-white text-sm">{message.card.title}</h4>
                            <p className="text-xs text-gray-300 mt-1">{message.card.description}</p>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-blue-300 font-semibold text-sm">{message.card.price}</span>
                              <button className="text-xs bg-blue-500 text-white px-2 py-1 rounded-md hover:bg-blue-600 transition-colors">
                                {message.card.action}
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                      {}
                      {message.quickActions && (
                        <div className="flex flex-wrap gap-2">
                          {message.quickActions.map((action, actionIndex) => (
                            <motion.button
                              key={actionIndex}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleQuickAction(action.action)}
                              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs px-3 py-1.5 rounded-full hover:from-blue-600 hover:to-purple-600 transition-all flex items-center gap-1"
                            >
                              <Zap className="w-3 h-3" />
                              {action.text}
                            </motion.button>
                          ))}
                        </div>
                      )}
                      {}
                      {message.suggestions && (
                        <div className="flex flex-wrap gap-1">
                          {message.suggestions.map((suggestion, suggestionIndex) => (
                            <motion.button
                              key={suggestionIndex}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleSuggestionClick(suggestion)}
                              className="bg-white/10 border border-white/20 text-white text-xs px-2 py-1 rounded-full hover:bg-white/20 transition-all"
                            >
                              {suggestion}
                            </motion.button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
              {}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="flex items-start space-x-2 max-w-[80%]">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br from-purple-400 via-blue-400 to-cyan-400">
                      <Brain className="w-4 h-4 text-white" />
                    </div>
                    <div className="p-3 rounded-2xl bg-white/10 text-white border border-white/10">
                      <div className="flex items-center space-x-1">
                        <span className="text-xs text-gray-300">Hail is thinking</span>
                        <div className="flex space-x-1 ml-2">
                          <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>
            {}
            <div className="p-4 border-t border-white/10 bg-black/20">
              <div className="flex items-center space-x-2">
                <div className="flex-1 relative">
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Ask Hail anything about travel..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-2 pr-12 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
                    disabled={isTyping}
                  />
                  {}
                  {recognition.current && (
                    <button
                      onClick={startListening}
                      disabled={isListening || isTyping}
                      className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded-md transition-all ${
                        isListening 
                          ? 'bg-red-500 text-white animate-pulse' 
                          : 'text-gray-400 hover:text-white hover:bg-white/10'
                      } disabled:opacity-50`}
                    >
                      {isListening ? (
                        <MicOff className="w-4 h-4" />
                      ) : (
                        <Mic className="w-4 h-4" />
                      )}
                    </button>
                  )}
                </div>
                <motion.button
                  onClick={handleSendMessage}
                  disabled={isTyping || inputText.trim() === ''}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 p-2 rounded-xl hover:from-purple-600 hover:via-blue-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg"
                >
                  <Send className="w-5 h-5 text-white" />
                </motion.button>
              </div>
              {isListening && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs text-red-300 mt-2 flex items-center gap-1"
                >
                  <Mic className="w-3 h-3 animate-pulse" />
                  Listening... Speak now
                </motion.p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
export default ModernAIAssistant
