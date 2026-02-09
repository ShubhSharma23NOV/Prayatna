# Building Dimensions Reference

## Expected Visual Differences

When you click on different buildings, here's what you SHOULD see:

### 1. Residential Tower (🏢 Green)
- **Storeys**: 15 floors
- **Width**: 18m
- **Depth**: 14m  
- **Floor Height**: 3m
- **Total Height**: 45m
- **Footprint**: 252 m²
- **Visual**: TALL and NARROW (like a pencil)

### 2. Commercial Complex (🏬 Blue)
- **Storeys**: 8 floors
- **Width**: 30m
- **Depth**: 25m
- **Floor Height**: 4.5m
- **Total Height**: 36m
- **Footprint**: 750 m²
- **Visual**: MEDIUM height, WIDER base

### 3. Hospital Building (🏥 Orange)
- **Storeys**: 6 floors
- **Width**: 35m
- **Depth**: 30m
- **Floor Height**: 4.5m
- **Total Height**: 27m
- **Footprint**: 1,050 m²
- **Visual**: SHORT and VERY WIDE (large floor plates)

### 4. School Building (🏫 Purple)
- **Storeys**: 4 floors
- **Width**: 45m
- **Depth**: 30m
- **Floor Height**: 4.5m
- **Total Height**: 18m
- **Footprint**: 1,350 m²
- **Visual**: VERY SHORT and EXTREMELY WIDE (largest footprint)

### 5. Industrial Warehouse (🏭 Red)
- **Storeys**: 2 floors
- **Width**: 50m
- **Depth**: 40m
- **Floor Height**: 7m
- **Total Height**: 14m
- **Footprint**: 2,000 m²
- **Visual**: SHORTEST but WIDEST (massive footprint, tall ceilings)

### 6. Demo Building (🏗️ Gray)
- **Storeys**: 3 floors
- **Width**: 18m
- **Depth**: 14m
- **Floor Height**: 3m
- **Total Height**: 9m
- **Footprint**: 252 m²
- **Visual**: VERY SHORT and COMPACT

## Visual Comparison Chart

```
Height Comparison (tallest to shortest):
Residential Tower:    45m  ████████████████████████████████████████████
Commercial Complex:   36m  ████████████████████████████████████
Hospital:             27m  ███████████████████████████
School:               18m  ██████████████████
Warehouse:            14m  ██████████████
Demo:                  9m  █████████

Footprint Comparison (largest to smallest):
Warehouse:      2,000 m²  ████████████████████████████████████████████
School:         1,350 m²  ██████████████████████████████
Hospital:       1,050 m²  █████████████████████
Commercial:       750 m²  ███████████████
Residential:      252 m²  █████
Demo:             252 m²  █████
```

## Color Coding

Each building has a colored marker cube on top:
- 🟢 **Green** = Residential
- 🔵 **Blue** = Commercial  
- 🟠 **Orange** = Institutional (Hospital)
- 🟣 **Purple** = Institutional (School)
- 🔴 **Red** = Industrial

## What to Look For

1. **Click Residential Tower** → Should see a TALL, THIN building (45m high)
2. **Click Warehouse** → Should see a SHORT, WIDE building (14m high, huge base)
3. **Compare side-by-side** → Warehouse should be 3x wider but 3x shorter than Residential

## Debugging Steps

If all buildings look the same:

1. **Open Browser Console** (F12)
2. **Click a building**
3. **Look for logs**:
   ```
   === Loading Building Model ===
   Building: Residential Tower
   Type: residential
   Storeys: 15
   === BUILDING DIMENSIONS ===
   Width: 18 m
   Depth: 14 m
   Floor Height: 3 m
   Total Height: 45 m
   Footprint: 252 m²
   ```

4. **Click another building** (e.g., Warehouse)
5. **Compare the dimensions** in console:
   ```
   === BUILDING DIMENSIONS ===
   Width: 50 m
   Depth: 40 m
   Floor Height: 7 m
   Total Height: 14 m
   Footprint: 2000 m²
   ```

If the console shows DIFFERENT dimensions but the models LOOK the same, the issue is:
- Camera not adjusting properly
- Models overlapping (old model not removed)
- Visual scale making differences hard to see

If the console shows SAME dimensions for all buildings, the issue is:
- Building details not being passed correctly
- Registry lookup failing
- Type field not matching switch cases
