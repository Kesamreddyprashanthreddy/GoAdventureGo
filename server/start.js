
import { createRequire } from 'module'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import fs from 'fs'
import dotenv from 'dotenv'
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
dotenv.config({ path: join(__dirname, '.env') })
console.log('Starting from:', __dirname)
console.log('Looking for server.js at:', join(__dirname, 'server.js'))
console.log('MongoDB URI loaded:', process.env.MONGODB_URI ? 'Yes' : 'No')
console.log('MongoDB URI value:', process.env.MONGODB_URI || 'undefined')
if (fs.existsSync(join(__dirname, 'server.js'))) {
  console.log('✅ server.js found, importing...')
  try {
    await import('./server.js')
  } catch (error) {
    console.error('❌ Error importing server.js:', error)
  }
} else {
  console.error('❌ server.js not found')
}
