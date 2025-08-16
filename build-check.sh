#!/bin/bash

echo "🔧 GoAdventureGo Frontend Build Fix"
echo "=================================="

# Build the frontend
echo "📦 Building frontend..."
npm install
npm run build

# Check if dist directory was created
if [ -d "./dist" ]; then
    echo "✅ dist directory created successfully"
    
    # Check if index.html exists
    if [ -f "./dist/index.html" ]; then
        echo "✅ index.html found in dist directory"
        echo "📁 Contents of dist directory:"
        ls -la ./dist/
    else
        echo "❌ index.html not found in dist directory"
        echo "📁 Contents of dist directory:"
        ls -la ./dist/
        exit 1
    fi
else
    echo "❌ dist directory not created"
    echo "📁 Current directory contents:"
    ls -la ./
    exit 1
fi

echo "🎉 Build verification complete!"
