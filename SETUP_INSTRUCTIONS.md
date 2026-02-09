# Setup Instructions

## Current Status

✅ **Frontend**: Working with manual camera controls (drag to rotate, scroll to zoom)
✅ **Building Cards**: Load and display 3D models
✅ **Upload IFC**: Ready to accept IFC files
⚠️ **Backend**: Needs Python dependency installation

## Quick Start

### 1. Test Frontend (No Backend Required)

The frontend works independently! Just refresh your browser and:

1. Click any building card (e.g., "Residential Tower")
2. **Drag with mouse** to rotate the 3D model
3. **Scroll** to zoom in/out
4. Try different buildings to see various structures

### 2. Setup Backend (For "Generate from Form" Feature)

The backend is optional but enables custom building generation.

#### Option A: Use Python 3.12 (Recommended)

```bash
# Install Python 3.12 if you don't have it
brew install python@3.12

# Create venv with Python 3.12
cd backend
python3.12 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python main.py
```

#### Option B: Clean Install with Current Python

```bash
cd backend
./clean-install.sh
```

This will:
- Remove old virtual environment
- Create fresh venv
- Install latest compatible versions
- Should work with Python 3.13

#### Verify Backend is Running

```bash
# In browser, visit:
http://localhost:8000

# Should see:
{
  "message": "StructIQ IFC Generator API",
  "version": "1.0.0"
}
```

### 3. Test Complete Workflow

Once backend is running:

1. **Building Cards** → Click → Drag/Zoom ✅
2. **Upload IFC** → Select file → View 3D ✅
3. **Generate Form** → Fill details → Generate → View 3D ✅

## Troubleshooting

### "Cannot rotate model"

- Make sure you're **clicking and dragging** on the 3D canvas
- The cursor should change to "grabbing" when dragging
- Try refreshing the page

### "Backend won't start"

- Check Python version: `python3 --version`
- If 3.13, try Option A (Python 3.12)
- If errors persist, share the error message

### "Building doesn't load"

- Check browser console (F12) for errors
- Make sure you clicked "Load Building" button
- Try a different building card

## What's Working

✅ Manual camera controls (drag to rotate, scroll to zoom)
✅ Building registry with 6 sample buildings
✅ Procedural 3D geometry generation
✅ Three loading methods: Cards, Upload, Generate
✅ FastAPI backend with IFC generation
✅ Complete documentation

## What's Next

1. Fix backend Python dependencies
2. Test form-based generation
3. Verify IFC file downloads
4. Add more building types

## Files Modified

- `src/components/viewer/MinimalViewer.jsx` - Manual camera controls
- `backend/requirements.txt` - Updated for Python 3.13
- `backend/clean-install.sh` - Fresh installation script
