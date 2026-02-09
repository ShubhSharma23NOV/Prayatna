#!/bin/bash

# Clean Next.js cache and macOS resource forks
echo "🧹 Cleaning Next.js cache..."
rm -rf .next

echo "🧹 Removing macOS resource forks..."
find . -name "._*" -type f -not -path "./node_modules/*" -delete 2>/dev/null

echo "✅ Cache cleaned! You can now run: npm run dev"
