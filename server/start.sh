#!/bin/bash
# Render startup script for backend

echo "🚀 Starting GoAdventureGo Backend..."
echo "📊 Environment: $NODE_ENV"
echo "🔗 Port: $PORT"

# Validate required environment variables
if [ -z "$MONGODB_URI" ]; then
    echo "❌ MONGODB_URI is not set!"
    exit 1
fi

if [ -z "$JWT_SECRET" ]; then
    echo "❌ JWT_SECRET is not set!"
    exit 1
fi

echo "✅ Environment variables validated"

# Start the server
npm start
