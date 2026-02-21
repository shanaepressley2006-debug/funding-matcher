#!/bin/bash

# Test script for Farm Funding Swipe Matcher

echo "🌱 Farm Funding Swipe Matcher - Test Script"
echo "==========================================="
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "⚠️  Warning: .env file not found"
    echo "Creating .env from .env.example..."
    cp .env.example .env
    echo "✅ Please configure your AWS credentials in .env"
    echo ""
fi

# Start the server
echo "🚀 Starting server..."
echo "📂 Swipe interface will be available at:"
echo "   http://localhost:3000/swipe.html"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

node server.js
