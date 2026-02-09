#!/bin/bash

# Deployment script for Netlify
echo "🚀 Preparing for deployment..."

# Clean build artifacts
echo "🧹 Cleaning previous builds..."
npm run clean

# Install dependencies
echo "📦 Installing dependencies..."
npm install --legacy-peer-deps

# Run build
echo "🔨 Building production bundle..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "📋 Next steps:"
    echo "1. Commit your changes: git add . && git commit -m 'Ready for deployment'"
    echo "2. Push to GitHub: git push origin main"
    echo "3. Netlify will automatically deploy!"
    echo ""
    echo "Or deploy manually with: netlify deploy --prod"
else
    echo "❌ Build failed! Please check the errors above."
    exit 1
fi
