# StructIQ 🏗️

**Advanced Civil Engineering Platform for Structural Analysis & BIM Visualization**

StructIQ is a modern web-based platform that combines Building Information Modeling (BIM) with structural analysis tools, designed for both professional engineers and civil engineering students. Built with cutting-edge web technologies, it provides real-time 3D visualization, interactive learning modules, and comprehensive structural analysis capabilities.

---

## 🌟 Key Features

### 🎯 Dual-Mode Interface

**Engineer Mode**
- Professional structural analysis workspace
- Custom parameter inputs (soil type, seismic zones, dimensions)
- Real-time calculation engine for foundation and column design
- Comprehensive analysis reports with compliance checking
- IFC file upload and visualization
- Export capabilities for engineering documentation

**Student Mode**
- Interactive learning laboratory
- Guided tutorials on structural engineering concepts
- Educational case studies (residential, commercial, institutional buildings)
- Progress tracking with badges and achievements
- Beginner to advanced lesson paths
- Visual demonstrations of structural principles

### 🏢 3D BIM Visualization

**IFC Viewer**
- Full 360° rotation and zoom controls
- Multiple building types with context-specific designs:
  - **Residential Towers**: Narrow footprint, shear wall systems
  - **Commercial Buildings**: Open floor plans, moment frames
  - **Hospitals**: Heavy-duty columns, helipad on roof
  - **Schools**: Educational facility layouts, natural lighting
  - **Industrial Warehouses**: Large spans, loading docks, pitched roofs
- Procedurally generated buildings with realistic BIM elements
- Structural components: columns, beams, slabs, curtain walls, foundations
- Material-accurate rendering (concrete, glass, steel)

**Structural Analysis Viewer**
- Real-time stress/strain visualization
- Color-coded stress indicators (green → yellow → orange → red)
- Load distribution arrows
- Displacement vectors showing deformation
- Interactive frame analysis with 5-storey demonstration model
- Pulsing stress indicators for critical zones

### 📊 Analysis Capabilities

- **Seismic Design**: Zone II through Zone V calculations
- **Foundation Analysis**: Footing dimensions, depth calculations
- **Column Design**: Size optimization, reinforcement requirements
- **Load Calculations**: Dead load, live load, seismic forces
- **Compliance Checking**: IS Code standards verification
- **Risk Assessment**: Structural safety evaluation

### 🎓 Educational Content

**Learning Modules**
1. **Structural Basics**: Load types, stress & strain, material properties
2. **Seismic Design**: Seismic zones, base isolation, ductility concepts
3. **Analysis Methods**: FEA basics, load paths, deflection analysis
4. **Case Studies**: Real-world building examples and analysis

**Interactive Lessons**
- Understanding Column Stress (Beginner, 5 min)
- Load Distribution in Beams (Beginner, 8 min)
- Seismic Force Calculation (Intermediate, 12 min)
- Foundation Design Basics (Intermediate, 10 min)
- Moment Frame Analysis (Advanced, 15 min)

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/structiq.git
cd structiq

# Install dependencies (use --legacy-peer-deps for compatibility)
npm install --legacy-peer-deps

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### First Time Setup

1. **Login Page**: Choose your role (Engineer or Student)
2. **Dashboard**: Explore available tools and features
3. **IFC Viewer**: Click building cards to load 3D models
4. **Analysis**: Access structural analysis tools (Engineer) or learning modules (Student)

---

## 📦 Technology Stack

### Frontend Framework
- **Next.js 16**: React-based framework with App Router
- **React 19**: Latest React with concurrent features
- **TypeScript/JavaScript**: Type-safe development

### 3D Graphics & Visualization
- **Three.js 0.182**: WebGL-based 3D rendering engine
- **React Three Fiber**: React renderer for Three.js
- **@react-three/drei**: Useful helpers for 3D scenes
- **web-ifc**: IFC file parsing (Industry Foundation Classes)
- **web-ifc-three**: Three.js integration for IFC models

### UI & Styling
- **Tailwind CSS 4**: Utility-first CSS framework
- **Radix UI**: Accessible component primitives
- **shadcn/ui**: Beautiful, customizable UI components
- **Lucide React**: Icon library
- **Framer Motion**: Animation library

### State Management & Data
- **React Context API**: Global state management
- **Custom Hooks**: Reusable logic patterns

### Build & Deployment
- **Turbopack**: Next.js 16 bundler (faster than Webpack)
- **Netlify**: Serverless deployment platform
- **ESLint**: Code quality and consistency

---

## 📁 Project Structure

```
structiq/
├── src/
│   ├── app/                              # Next.js App Router
│   │   ├── (public)/                     # Public routes (no auth)
│   │   │   ├── login/                    # Login page
│   │   │   ├── register/                 # Registration page
│   │   │   └── page.jsx                  # Landing page
│   │   ├── (protected)/                  # Protected routes (auth required)
│   │   │   ├── dashboard/                # Main dashboard
│   │   │   └── app/                      # Application pages
│   │   │       ├── analysis/             # Structural analysis workspace
│   │   │       ├── calculator/           # Engineering calculator
│   │   │       ├── compliance/           # Code compliance checker
│   │   │       ├── ifc-viewer/           # 3D BIM viewer
│   │   │       ├── projects/             # Project management
│   │   │       ├── reports/              # Analysis reports
│   │   │       ├── resources/            # Learning resources
│   │   │       ├── results/              # Calculation results
│   │   │       └── risk-assessment/      # Risk evaluation
│   │   ├── layout.jsx                    # Root layout
│   │   ├── globals.css                   # Global styles
│   │   └── favicon.ico                   # Site icon
│   │
│   ├── components/
│   │   ├── viewer/                       # 3D Visualization Components
│   │   │   ├── FinalViewer.jsx          # Main IFC viewer (used in IFC Viewer page)
│   │   │   ├── StructuralAnalysisViewer.jsx  # Stress analysis viewer (used in Analysis page)
│   │   │   ├── IFCViewer.jsx            # Base IFC viewer component
│   │   │   ├── ViewerToolbar.jsx        # 3D viewer controls
│   │   │   └── overlays/                # Visualization overlays
│   │   │       ├── FoundationOverlay.js
│   │   │       ├── RiskOverlay.js
│   │   │       └── ShearWallOverlay.js
│   │   │
│   │   ├── layout/                       # Layout Components
│   │   │   ├── TopBar.jsx               # Navigation header
│   │   │   ├── InputPanel.jsx           # Engineering input forms
│   │   │   ├── ViewerPanel.jsx          # 3D viewer container
│   │   │   └── ResultsPanel.jsx         # Analysis results display
│   │   │
│   │   ├── public/                       # Public Page Components
│   │   │   └── PublicNavbar.jsx         # Landing page navigation
│   │   │
│   │   └── ui/                           # UI Components (shadcn)
│   │       ├── button.jsx
│   │       ├── card.jsx
│   │       ├── input.jsx
│   │       ├── dialog.jsx
│   │       ├── tabs.jsx
│   │       └── ... (20+ components)
│   │
│   ├── context/
│   │   └── AppContext.jsx                # Global state management
│   │
│   └── lib/
│       ├── buildingRegistry.js           # Building metadata & configurations
│       ├── ruleEngine.js                 # Structural analysis rules
│       └── utils.js                      # Utility functions
│
├── public/
│   ├── demo/                             # Sample IFC files
│   │   ├── residential_tower_zone_iv.ifc
│   │   ├── commercial_complex_zone_iii.ifc
│   │   ├── hospital_zone_v.ifc
│   │   ├── school_zone_ii.ifc
│   │   ├── warehouse_zone_iii.ifc
│   │   └── demo_building_zone_iii.ifc
│   │
│   ├── wasm/                             # WebAssembly files for IFC parsing
│   │   ├── web-ifc.wasm
│   │   ├── web-ifc-mt.wasm
│   │   └── web-ifc-node.wasm
│   │
│   └── *.svg                             # Static assets
│
├── netlify.toml                          # Netlify deployment config
├── next.config.mjs                       # Next.js configuration
├── tailwind.config.js                    # Tailwind CSS config
├── package.json                          # Dependencies
├── DEPLOYMENT_GUIDE.md                   # Deployment instructions
├── DEPLOYMENT_CHECKLIST.md               # Pre-deployment checklist
└── README.md                             # This file
```

---

## 🎨 Key Components Explained

### 1. FinalViewer.jsx (IFC Viewer)
**Purpose**: Main 3D building viewer for the IFC Viewer page

**Features**:
- Procedural building generation based on building type
- Context-specific designs (residential, commercial, hospital, school, industrial)
- Full 360° manual rotation controls
- Dynamic camera positioning based on building height
- Realistic BIM elements: columns, beams, slabs, curtain walls, foundations
- Building-specific features (helipad for hospitals, loading dock for warehouses)

**Building Types**:
- **Residential**: 4x4 column grid, standard glass, roof parapet
- **Hospital**: 5x5 column grid (heavy equipment), helipad with "H" marking
- **Commercial**: 3x3 column grid (open plans), modern dark mullions
- **School**: 4x4 grid, warm yellow glass, no parapet
- **Industrial**: 3x3 grid with thick columns (1.0m), sloped roof with trusses, loading dock

### 2. StructuralAnalysisViewer.jsx (Analysis Viewer)
**Purpose**: Stress/strain visualization for the Analysis page

**Features**:
- 5-storey structural frame with 3x3 bay layout
- Color-coded stress visualization (green → yellow → orange → red)
- Stress indicators on columns (0-100% capacity)
- Load arrows showing applied forces
- Displacement vectors showing deformation
- Pulsing animations for critical stress zones
- Real-time FEA-style visualization

### 3. AppContext.jsx (State Management)
**Purpose**: Global state management for the entire application

**State Managed**:
- User role (Engineer/Student)
- Project data and metadata
- Input parameters (soil type, seismic zone, dimensions)
- Analysis results and calculations
- UI state (loading, errors, overlays)
- Overlay toggles for visualization

### 4. buildingRegistry.js (Building Database)
**Purpose**: Central configuration for all building types

**Data Structure**:
```javascript
{
  id: 'residential-tower',
  name: 'Residential Tower',
  type: 'residential',
  storeys: 15,
  seismicZone: 'IV',
  ifcPath: '/demo/residential_tower_zone_iv.ifc',
  dimensions: { footing, column, height }
}
```

---

## 🔧 Configuration Files

### netlify.toml
Configures Netlify deployment:
- Build command: `npm run build`
- Publish directory: `.next`
- Node version: 18
- WASM file headers for proper Content-Type
- Redirects for client-side routing
- Security headers

### next.config.mjs
Next.js configuration:
- Turbopack enabled for faster builds
- Webpack configuration for WASM files
- CORS headers for WASM files
- Async WebAssembly support

---

## 🌐 Deployment

### Deploy to Netlify (Recommended)

1. **Push to GitHub**:
```bash
git add .
git commit -m "StructIQ v1.0 - Production ready"
git push origin main
```

2. **Connect to Netlify**:
   - Go to [https://app.netlify.com](https://app.netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect your GitHub repository
   - Netlify will auto-detect settings from `netlify.toml`

3. **Deploy**:
   - Click "Deploy site"
   - Wait for build to complete (~3-5 minutes)
   - Your site will be live at `https://your-site-name.netlify.app`

### Environment Variables (Optional)
If you add backend integration later:
- `NEXT_PUBLIC_API_URL`: Backend API endpoint
- `NEXT_PUBLIC_SITE_URL`: Frontend URL

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed instructions.

---

## 🎯 Usage Guide

### For Engineers

1. **Login** as Engineer
2. **Dashboard**: Overview of projects and tools
3. **Analysis Page**:
   - Input panel: Enter soil type, seismic zone, dimensions
   - 3D viewer: See structural frame with stress visualization
   - Results panel: View calculations, compliance status, reports
4. **IFC Viewer**: Upload or select building models
5. **Calculator**: Quick engineering calculations
6. **Reports**: Generate and export analysis reports

### For Students

1. **Login** as Student
2. **Dashboard**: Learning hub with educational content
3. **Analysis Page**:
   - Learning panel: Browse modules and lessons
   - 3D viewer: Interactive structural demonstrations
   - Results panel: Educational explanations
4. **IFC Viewer**: Explore sample buildings
5. **Resources**: Access learning materials
6. **Progress**: Track completed lessons and badges

---

## 🛠️ Development

### Available Scripts

```bash
# Development server with hot reload
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Clean build artifacts and cache
npm run clean
```

### Adding New Building Types

1. Add entry to `src/lib/buildingRegistry.js`
2. Update `createBuilding()` in `FinalViewer.jsx` with new type logic
3. Add corresponding IFC file to `public/demo/`

### Creating New Pages

1. Create folder in `src/app/(protected)/app/`
2. Add `page.jsx` file
3. Update navigation in `TopBar.jsx`

---

## 🐛 Troubleshooting

### Build Fails
- Ensure Node.js 18+ is installed
- Run `npm install --legacy-peer-deps`
- Clear cache: `npm run clean`

### 3D Models Not Showing
- Check browser console for errors
- Verify WASM files are in `public/wasm/`
- Try different browser (Chrome recommended)

### Slow Performance
- Reduce number of building elements
- Lower shadow quality in viewer settings
- Use production build (`npm run build`)

---

## 📚 Learning Resources

### Structural Engineering Concepts
- **Load Types**: Dead, live, wind, seismic
- **Stress Analysis**: Axial, bending, shear
- **Seismic Design**: Zone factors, response spectrum
- **Foundation Design**: Bearing capacity, settlement

### BIM & IFC Standards
- **IFC Schema**: Industry Foundation Classes
- **BIM Levels**: LOD 100-500
- **Coordination**: Clash detection, model federation

---

## 🤝 Contributing

This is an educational project. Contributions are welcome!

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---


**Built with ❤️ for civil engineering education and professional practice**

*StructIQ - Intelligent Structural Engineering Platform*
# Prayatna
