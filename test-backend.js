// Test script to verify backend connection
const testBackendConnection = async () => {
  const backendUrl = 'https://goadventurego.onrender.com';
  
  try {
    console.log('🔍 Testing connection to:', `${backendUrl}/api/health`);
    
    const response = await fetch(`${backendUrl}/api/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    console.log('Response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Backend is accessible:', data);
    } else {
      const errorText = await response.text();
      console.log('⚠️ Backend error response:', errorText);
    }
  } catch (error) {
    console.log('❌ Connection failed:', error.message);
  }
  
  // Also test the root endpoint
  try {
    console.log('🔍 Testing root endpoint:', backendUrl);
    const rootResponse = await fetch(backendUrl);
    console.log('Root endpoint status:', rootResponse.status);
  } catch (error) {
    console.log('❌ Root endpoint failed:', error.message);
  }
};

// Run test
testBackendConnection();
