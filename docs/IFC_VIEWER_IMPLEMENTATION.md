# IFC Viewer Implementation Guide

## Overview
Frontend-only BIM visualization system using Three.js + ThatOpen Components (formerly web-ifc) to dynamically load and display real IFC building models.

## Architecture

### 1. Building Registry (`src/lib/buildingRegistry.js`)
Central configuration file that acts as a frontend database replacement.

**Structure:**
```javascript
{
  id: 'unique-building-id',
  name: 'Building Name',
  description: 'Building description',
  seismicZone: 'IV',
  storeys: 15,
  type: 'residential',
  ifcPath: '/demo/building.ifc',
  thumbnail: '🏢',
  color: '#4CAF50'
}
```

**Functions:**
- `getBuildingById(id)` - Retrieve specific building
- `getBuildingsByType(type)` - Filter by building type
- `getBuildingTypes()` - Get all available types

### 2. IFC Viewer Component (`src/components/viewer/IFCViewer.jsx`)
Real IFC geometry loader using ThatOpen Components.

**Key Features:**
- ✅ Loads actual IFC geometry (walls, slabs, columns, beams)
- ✅ Disposes previous models before loading new ones
- ✅ Memory-efficient (proper cleanup)
- ✅ Dark technical SaaS UI background
- ✅ Dynamic model switching without page reload

**API Methods:**
```javascript
// Load IFC file
await viewerRef.current.loadIfc(file, buildingDetails);

// Set camera views
viewerRef.current.setView('top' | 'front' | 'side' | 'reset');

// Dispose current model
viewerRef.current.dispose();
```

### 3. IFC Viewer Page (`src/app/(protected)/app/ifc-viewer/page.jsx`)
UI integration with building selection and viewer controls.

**Flow:**
1. User clicks building card
2. `handleLoadSample()` fetches IFC file from `/public/demo/`
3. File converted to Blob → File object
4. Passed to `IFCViewer.loadIfc()`
5. Real IFC geometry rendered in 3D canvas

## Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│ 1. USER CLICKS BUILDING CARD                                 │
│    Building ID: 'residential-tower'                          │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. LOOKUP IN BUILDING REGISTRY                               │
│    buildingRegistry.find(b => b.id === 'residential-tower') │
│    Returns: { name, ifcPath, storeys, zone, ... }           │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. FETCH IFC FILE FROM STATIC ASSETS                         │
│    fetch('/demo/residential_tower_zone_iv.ifc')             │
│    Response → Blob → File object                            │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. LOAD IFC INTO VIEWER                                      │
│    viewerRef.current.loadIfc(file, buildingDetails)         │
│                                                               │
│    a) Dispose previous model (memory cleanup)                │
│    b) Initialize ThatOpen IFC Loader                         │
│    c) Parse IFC file (extract geometry)                      │
│    d) Convert to Three.js meshes                             │
│    e) Add to scene                                           │
│    f) Fit camera to model bounds                             │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. RENDER REAL IFC GEOMETRY                                  │
│    • Walls, slabs, columns, beams from IFC                   │
│    • Proper materials and colors                             │
│    • User can orbit, zoom, pan                               │
│    • View controls (top, front, side, reset)                 │
└─────────────────────────────────────────────────────────────┘
```

## Key Differences from Previous Implementation

### Before (Procedural Generation)
```javascript
// Generated fake geometry
const building = new THREE.BoxGeometry(width, height, depth);
// Same model for all buildings
```

### After (Real IFC Parsing)
```javascript
// Loads actual IFC geometry
const model = await ifcLoader.load(ifcData);
// Each building shows its real structure
```

## Memory Management

**Proper Disposal Flow:**
```javascript
// Before loading new model
if (currentModelRef.current) {
  fragments.dispose(currentModelRef.current);
  currentModelRef.current = null;
}

// Load new model
const model = await ifcLoader.load(data);
currentModelRef.current = model;
```

**Why This Matters:**
- Prevents memory leaks
- Avoids scene clutter
- Maintains performance with multiple model switches

## Performance Optimizations

1. **Single Model Loading**: Only one IFC model loaded at a time
2. **Proper Disposal**: Old models fully removed before new load
3. **No Shadows**: Disabled for better performance
4. **Efficient Rendering**: ThatOpen Components optimized for BIM

## File Structure

```
src/
├── lib/
│   └── buildingRegistry.js          # Central building config
├── components/
│   └── viewer/
│       ├── IFCViewer.jsx            # Real IFC loader (ThatOpen)
│       └── SimpleThreeViewer.jsx    # Old procedural viewer (deprecated)
└── app/
    └── (protected)/
        └── app/
            └── ifc-viewer/
                └── page.jsx          # UI integration

public/
└── demo/
    ├── residential_tower_zone_iv.ifc
    ├── commercial_complex_zone_iii.ifc
    ├── hospital_zone_v.ifc
    ├── school_zone_ii.ifc
    ├── warehouse_zone_iii.ifc
    └── demo_building_zone_iii.ifc
```

## Adding New Buildings

1. **Add IFC file** to `/public/demo/`
2. **Register in buildingRegistry.js**:
```javascript
{
  id: 'new-building',
  name: 'New Building',
  description: 'Description',
  seismicZone: 'III',
  storeys: 5,
  type: 'commercial',
  ifcPath: '/demo/new_building.ifc',
  thumbnail: '🏢',
  color: '#FF5722'
}
```
3. **Done!** Building automatically appears in UI

## Dependencies

```json
{
  "@thatopen/components": "^3.3.1",
  "@thatopen/fragments": "latest",
  "@thatopen/ui": "latest",
  "three": "^0.182.0"
}
```

## Browser Console Logs

When loading a building, you'll see:
```
=== Loading Real IFC Model ===
Building: Residential Tower
File: residential_tower_zone_iv.ifc
Fetching IFC file: /demo/residential_tower_zone_iv.ifc
Loading IFC into viewer...
✓ IFC Model loaded successfully
Model UUID: abc-123-def
Fragments count: 42
✓ Camera positioned
Model bounds: { center: {x,y,z}, size: {x,y,z} }
✓ Building loaded successfully
```

## Viva Defense Statement

**"Multiple IFC models are dynamically loaded from static assets on the client side to demonstrate BIM visualization without backend dependencies."**

**Technical Justification:**
- IFC files stored as static assets in `/public/demo/`
- Building registry acts as frontend database
- ThatOpen Components parse real IFC geometry
- Dynamic switching without page reload
- Proper memory management with model disposal
- Demonstrates BIM concepts for educational purposes

## Troubleshooting

### Model Not Loading
- Check browser console for errors
- Verify IFC file exists in `/public/demo/`
- Ensure `ifcPath` in registry matches actual file path
- Check file is valid IFC format

### Memory Issues
- Ensure old models are disposed before loading new ones
- Check `currentModelRef.current` is properly cleared
- Monitor browser memory in DevTools

### Camera Not Fitting Model
- Model bounds calculation may fail for complex geometry
- Manually adjust camera distance in `setView()` method
- Check model has valid bounding box

## Future Enhancements

1. **IFC Property Extraction**: Display building properties from IFC
2. **Element Selection**: Click on walls/columns to see details
3. **Layer Filtering**: Show/hide structural elements
4. **Measurement Tools**: Distance and area calculations
5. **Export Views**: Screenshot/PDF generation
6. **Comparison Mode**: Load two models side-by-side
