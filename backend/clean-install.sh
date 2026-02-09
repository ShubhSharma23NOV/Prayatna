#!/bin/bash

echo "🧹 Cleaning old virtual environment..."
rm -rf venv

echo "🔨 Creating fresh virtual environment..."
python3 -m venv venv

echo "✅ Activating virtual environment..."
source venv/bin/activate

echo "📦 Upgrading pip..."
pip install --upgrade pip

echo "📥 Installing dependencies..."
pip install -r requirements.txt

echo ""
echo "✅ Installation complete!"
echo ""
echo "To start the backend server:"
echo "  cd backend"
echo "  source venv/bin/activate"
echo "  python main.py"
echo ""
echo "Or simply run: ./start.sh"
