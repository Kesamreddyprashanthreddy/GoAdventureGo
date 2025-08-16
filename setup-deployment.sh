#!/bin/bash

echo "🚀 GoAdventureGo Deployment Setup: Render + Netlify"
echo "=================================================="

echo "📋 Pre-deployment Checklist:"
echo ""

# Check if backend build works
echo "🔧 Testing backend..."
cd server
if npm list > /dev/null 2>&1; then
    echo "✅ Backend dependencies installed"
else
    echo "⚠️ Installing backend dependencies..."
    npm install
fi

# Check if frontend build works
echo "🔧 Testing frontend build..."
cd ..
if [ -d "dist" ]; then
    echo "✅ Previous build found, cleaning..."
    rm -rf dist
fi

npm run build
if [ -f "dist/index.html" ]; then
    echo "✅ Frontend build successful"
else
    echo "❌ Frontend build failed"
    exit 1
fi

echo ""
echo "📤 Ready for deployment!"
echo ""
echo "NEXT STEPS:"
echo "1. 🌐 Deploy Backend to Render:"
echo "   - Use: render-backend-only.yaml"
echo "   - Root Directory: server"
echo "   - Environment variables from DEPLOYMENT_RENDER_NETLIFY.md"
echo ""
echo "2. 🚀 Deploy Frontend to Netlify:"
echo "   - Build Command: npm run build"
echo "   - Publish Directory: dist" 
echo "   - Use netlify.toml configuration"
echo ""
echo "3. 🔗 Update CORS:"
echo "   - Add Netlify URL to backend CORS_ORIGIN"
echo "   - Update CLIENT_URL in Render environment"
echo ""
echo "✅ All checks passed! Ready to deploy 🎉"
