// Test script to diagnose Render backend issues
const testBackendConnection = async () => {
  const backendUrl = 'https://goadventurego.onrender.com';
  
  console.log('🔍 Testing Render Backend Status...\n');
  
  // Test 1: Root endpoint
  try {
    console.log('1. Testing root endpoint:', backendUrl);
    const rootResponse = await fetch(backendUrl, { 
      method: 'GET',
      headers: { 'User-Agent': 'Backend-Health-Check/1.0' }
    });
    console.log('   Status:', rootResponse.status);
    if (rootResponse.ok) {
      const data = await rootResponse.text();
      console.log('   Response:', data.substring(0, 200) + '...');
    }
  } catch (error) {
    console.log('   ❌ Root endpoint failed:', error.message);
  }
  
  // Test 2: Health endpoint
  try {
    console.log('\n2. Testing health endpoint:', `${backendUrl}/api/health`);
    const healthResponse = await fetch(`${backendUrl}/api/health`, {
      method: 'GET',
      headers: { 'User-Agent': 'Backend-Health-Check/1.0' }
    });
    console.log('   Status:', healthResponse.status);
    if (healthResponse.ok) {
      const data = await healthResponse.json();
      console.log('   ✅ Health check passed:', data);
    } else {
      const errorText = await healthResponse.text();
      console.log('   ⚠️ Health check failed:', errorText.substring(0, 200));
    }
  } catch (error) {
    console.log('   ❌ Health endpoint failed:', error.message);
  }
  
  // Test 3: Auth endpoints
  try {
    console.log('\n3. Testing auth endpoint:', `${backendUrl}/api/auth`);
    const authResponse = await fetch(`${backendUrl}/api/auth`, {
      method: 'GET',
      headers: { 'User-Agent': 'Backend-Health-Check/1.0' }
    });
    console.log('   Status:', authResponse.status);
  } catch (error) {
    console.log('   ❌ Auth endpoint failed:', error.message);
  }
  
  console.log('\n🔧 Troubleshooting Steps:');
  console.log('1. Check Render Dashboard for deployment logs');
  console.log('2. Verify environment variables are set');
  console.log('3. Check if service is sleeping (free tier)');
  console.log('4. Ensure build completed successfully');
  console.log('5. Verify MongoDB connection string is correct');
};

// Run test
testBackendConnection();
