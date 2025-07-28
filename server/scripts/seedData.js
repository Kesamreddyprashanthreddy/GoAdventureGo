import mongoose from 'mongoose'
import dotenv from 'dotenv'
import User from '../models/User.js'
import Package from '../models/Package.js'
import bcrypt from 'bcryptjs'
dotenv.config()
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI)
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`)
  } catch (error) {
    console.error('❌ Database connection failed:', error.message)
    process.exit(1)
  }
}
const users = [
  {
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@goadventurego.com',
    password: 'Admin123!',
    role: 'admin',
    phoneNumber: '+919876543210',
    isEmailVerified: true,
    preferences: {
      travelStyle: 'luxury',
      favoriteDestinations: ['Paris', 'Switzerland', 'Japan']
    }
  },
  {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    password: 'User123!',
    role: 'user',
    phoneNumber: '+919876543211',
    isEmailVerified: true,
    preferences: {
      travelStyle: 'adventure',
      favoriteDestinations: ['Himalayas', 'Amazon', 'Iceland'],
      budget: { min: 20000, max: 80000 }
    }
  },
  {
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane@example.com',
    password: 'User123!',
    role: 'user',
    phoneNumber: '+919876543212',
    isEmailVerified: true,
    preferences: {
      travelStyle: 'cultural',
      favoriteDestinations: ['Rome', 'Kyoto', 'Egypt'],
      budget: { min: 30000, max: 100000 }
    }
  }
]
const packages = [
  {
    name: 'Andaman and Nicobar Islands',
    description: 'The most beautiful blue spread of eastern oceans. Famous for serene, white sandy beaches and delicious sea food of Port Blair. Experience crystal-clear waters, vibrant coral reefs, and pristine beaches.',
    shortDescription: 'Tropical paradise with pristine beaches and crystal-clear waters',
    category: 'seas',
    destination: {
      country: 'India',
      city: 'Port Blair',
      region: 'Andaman and Nicobar Islands',
      coordinates: {
        latitude: 11.7401,
        longitude: 92.6586
      }
    },
    pricing: {
      basePrice: 25000,
      currency: 'INR',
      priceIncludes: ['Accommodation', 'All meals', 'Local transportation', 'Guided tours', 'Entry fees'],
      priceExcludes: ['Flight tickets', 'Travel insurance', 'Personal expenses', 'Tips']
    },
    duration: {
      days: 5,
      nights: 4
    },
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Port Blair',
        description: 'Arrive at Port Blair airport, check-in to hotel, visit Cellular Jail',
        activities: ['Airport pickup', 'Hotel check-in', 'Cellular Jail visit', 'Light & Sound show'],
        meals: { breakfast: false, lunch: true, dinner: true },
        accommodation: '3-star hotel in Port Blair'
      },
      {
        day: 2,
        title: 'Havelock Island',
        description: 'Ferry to Havelock Island, Radhanagar Beach visit',
        activities: ['Ferry ride', 'Radhanagar Beach', 'Swimming', 'Beach walk'],
        meals: { breakfast: true, lunch: true, dinner: true },
        accommodation: 'Beach resort in Havelock'
      }
    ],
    images: {
      main: '/css/images/andaman.jpg',
      gallery: ['/css/images/andaman2.jpg', '/css/images/andaman3.jpg'],
      thumbnail: '/css/images/andaman.jpg'
    },
    features: {
      difficulty: 'easy',
      groupSize: { min: 2, max: 15 },
      ageRestriction: { min: 5, max: 70 },
      physicalRequirements: ['Basic swimming ability recommended'],
      equipment: ['Snorkeling gear provided', 'Life jackets provided']
    },
    availability: {
      seasons: ['summer', 'winter'],
      availableDates: [
        {
          startDate: new Date('2024-12-01'),
          endDate: new Date('2024-12-31'),
          available: true,
          bookedSpots: 0
        }
      ]
    },
    ratings: {
      average: 4.8,
      count: 125,
      breakdown: {
        five: 95,
        four: 25,
        three: 3,
        two: 1,
        one: 1
      }
    },
    tags: ['beach', 'tropical', 'islands', 'snorkeling', 'relaxation'],
    isActive: true,
    isFeatured: true
  },
  {
    name: 'Mount Fuji Experience',
    description: 'The splendid snow-covered volcano which has seen a gargantuan development of my most favourite culture in the world, Japan. Experience traditional Japanese culture, stunning views, and spiritual journey.',
    shortDescription: 'Iconic Japanese mountain with cultural immersion',
    category: 'mountains',
    destination: {
      country: 'Japan',
      city: 'Fujinomiya',
      region: 'Honshu',
      coordinates: {
        latitude: 35.3606,
        longitude: 138.7274
      }
    },
    pricing: {
      basePrice: 65000,
      currency: 'INR',
      priceIncludes: ['Accommodation', 'All meals', 'Local transportation', 'Guided tours', 'Entry fees', 'Cultural experiences'],
      priceExcludes: ['International flights', 'Visa fees', 'Travel insurance', 'Personal expenses']
    },
    duration: {
      days: 8,
      nights: 7
    },
    itinerary: [
      {
        day: 1,
        title: 'Tokyo Arrival',
        description: 'Arrive in Tokyo, explore traditional neighborhoods',
        activities: ['Airport pickup', 'Hotel check-in', 'Asakusa district tour', 'Traditional dinner'],
        meals: { breakfast: false, lunch: false, dinner: true },
        accommodation: 'Traditional ryokan in Tokyo'
      }
    ],
    images: {
      main: '/css/images/fuji.jpg',
      gallery: ['/css/images/fuji2.jpg', '/css/images/fuji3.jpg'],
      thumbnail: '/css/images/fuji.jpg'
    },
    features: {
      difficulty: 'moderate',
      groupSize: { min: 4, max: 12 },
      ageRestriction: { min: 12, max: 65 },
      physicalRequirements: ['Good physical fitness required', 'Ability to walk long distances'],
      equipment: ['Hiking boots recommended', 'Warm clothing provided']
    },
    availability: {
      seasons: ['spring', 'summer', 'autumn'],
      availableDates: [
        {
          startDate: new Date('2024-12-15'),
          endDate: new Date('2025-03-31'),
          available: true,
          bookedSpots: 2
        }
      ]
    },
    ratings: {
      average: 4.9,
      count: 87,
      breakdown: {
        five: 78,
        four: 7,
        three: 1,
        two: 1,
        one: 0
      }
    },
    tags: ['mountain', 'culture', 'spiritual', 'hiking', 'japan'],
    isActive: true,
    isFeatured: true
  },
  {
    name: 'Iceland Adventure',
    description: 'Land of the vikings and beautiful waterfalls, also widely known as "The Land of Fire and Ice". Iceland is home to some of the largest glaciers in Europe and spectacular northern lights.',
    shortDescription: 'Fire and ice adventure with glaciers and northern lights',
    category: 'landscapes',
    destination: {
      country: 'Iceland',
      city: 'Reykjavik',
      region: 'Capital Region',
      coordinates: {
        latitude: 64.1466,
        longitude: -21.9426
      }
    },
    pricing: {
      basePrice: 75000,
      currency: 'INR',
      priceIncludes: ['Accommodation', 'All meals', 'Local transportation', 'Guided tours', 'Equipment', 'Northern lights tour'],
      priceExcludes: ['International flights', 'Travel insurance', 'Personal expenses', 'Alcohol']
    },
    duration: {
      days: 10,
      nights: 9
    },
    itinerary: [
      {
        day: 1,
        title: 'Reykjavik Exploration',
        description: 'Explore the colorful capital city of Iceland',
        activities: ['City tour', 'Hallgrimskirkja Church', 'Harpa Concert Hall', 'Local cuisine'],
        meals: { breakfast: false, lunch: true, dinner: true },
        accommodation: 'Boutique hotel in Reykjavik'
      }
    ],
    images: {
      main: '/css/images/iceland.jpg',
      gallery: ['/css/images/iceland2.jpg', '/css/images/iceland3.jpg'],
      thumbnail: '/css/images/iceland.jpg'
    },
    features: {
      difficulty: 'challenging',
      groupSize: { min: 6, max: 14 },
      ageRestriction: { min: 16, max: 60 },
      physicalRequirements: ['Excellent physical fitness', 'Cold weather tolerance', 'Adventure experience preferred'],
      equipment: ['Winter gear provided', 'Ice climbing equipment', 'Photography equipment available']
    },
    availability: {
      seasons: ['winter', 'spring'],
      availableDates: [
        {
          startDate: new Date('2024-12-01'),
          endDate: new Date('2025-03-15'),
          available: true,
          bookedSpots: 4
        }
      ]
    },
    ratings: {
      average: 4.7,
      count: 56,
      breakdown: {
        five: 42,
        four: 10,
        three: 3,
        two: 1,
        one: 0
      }
    },
    tags: ['adventure', 'northern lights', 'glaciers', 'waterfalls', 'volcanic'],
    isActive: true,
    isFeatured: true
  }
]
const importData = async () => {
  try {
    await connectDB()
    console.log('🗑️  Clearing existing data...')
    await User.deleteMany({})
    await Package.deleteMany({})
    console.log('👤 Creating users...')
    const usersWithHashedPasswords = await Promise.all(users.map(async (user) => {
      const salt = await bcrypt.genSalt(12)
      const hashedPassword = await bcrypt.hash(user.password, salt)
      return {
        ...user,
        password: hashedPassword
      }
    }))
    const createdUsers = await User.insertMany(usersWithHashedPasswords)
    const adminUser = createdUsers.find(user => user.role === 'admin')
    const packagesWithCreator = packages.map(pkg => ({
      ...pkg,
      createdBy: adminUser._id
    }))
    console.log('📦 Creating packages...')
    await Package.insertMany(packagesWithCreator)
    console.log('✅ Data imported successfully!')
    console.log('\n📊 Summary:')
    console.log(`   Users created: ${createdUsers.length}`)
    console.log(`   Packages created: ${packagesWithCreator.length}`)
    console.log('\n🔑 Admin Login:')
    console.log('   Email: admin@goadventurego.com')
    console.log('   Password: Admin123!')
    console.log('\n👤 Test User Login:')
    console.log('   Email: john@example.com')
    console.log('   Password: User123!')
    process.exit()
  } catch (error) {
    console.error('❌ Error importing data:', error)
    process.exit(1)
  }
}
const deleteData = async () => {
  try {
    await connectDB()
    console.log('🗑️  Deleting data...')
    await User.deleteMany({})
    await Package.deleteMany({})
    console.log('✅ Data deleted successfully!')
    process.exit()
  } catch (error) {
    console.error('❌ Error deleting data:', error)
    process.exit(1)
  }
}
if (process.argv[2] === '--delete') {
  deleteData()
} else {
  importData()
}
