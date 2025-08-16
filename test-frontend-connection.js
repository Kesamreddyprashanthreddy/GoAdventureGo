// Test script to verify frontend-backend connection after Netlify deployment
// Run this in browser console on your Netlify site

const testConnection = async () => {
  console.log('🔍 Testing Frontend-Backend Connection...\n');
  
  // Get the API URL from environment
  const API_URL = import.meta.env.VITE_API_URL || 'https://goadventurego.onrender.com/api';
  
  console.log('📡 API URL:', API_URL);
  
  // Test 1: Health check
  try {
    console.log('\n1. Testing health endpoint...');
    const healthResponse = await fetch(`${API_URL}/health`);
    console.log('   Status:', healthResponse.status);
    
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log('   ✅ Health check passed:', healthData);
    } else {
      console.log('   ❌ Health check failed');
    }
  } catch (error) {
    console.log('   ❌ Health check error:', error.message);
  }
  
  // Test 2: CORS check
  try {
    console.log('\n2. Testing CORS...');
    const corsResponse = await fetch(`${API_URL}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Origin': window.location.origin
      }
    });
    
    if (corsResponse.ok) {
      console.log('   ✅ CORS working correctly');
    } else {
      console.log('   ⚠️ CORS might have issues, status:', corsResponse.status);
    }
  } catch (error) {
    console.log('   ❌ CORS error:', error.message);
  }
  
  // Test 3: Auth endpoint availability
  try {
    console.log('\n3. Testing auth endpoints...');
    const authResponse = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}) // Empty body to test endpoint existence
    });
    
    console.log('   Auth endpoint status:', authResponse.status);
    if (authResponse.status === 400 || authResponse.status === 422) {
      console.log('   ✅ Auth endpoint accessible (validation errors expected)');
    } else if (authResponse.status === 404) {
      console.log('   ❌ Auth endpoint not found');
    }
  } catch (error) {
    console.log('   ❌ Auth endpoint error:', error.message);
  }
  
  console.log('\n📋 Test Summary:');
  console.log('- If all tests pass, your connection is working!');
  console.log('- If CORS errors, check Render environment variables');
  console.log('- If 404 errors, check API URL configuration');
  console.log('\n🔧 Next: Try the signin/signup forms!');
};

// Export for use
window.testConnection = testConnection;

console.log('🧪 Connection test loaded! Run testConnection() to start testing.');
