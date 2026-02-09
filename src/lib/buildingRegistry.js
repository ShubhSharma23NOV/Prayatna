/**
 * Building Registry - Central configuration for demo IFC models
 * Acts as a frontend-only database replacement
 */

export const buildingRegistry = [
  {
    id: 'residential-tower',
    name: 'Residential Tower',
    description: '15-storey residential building with shear walls',
    seismicZone: 'IV',
    storeys: 15,
    type: 'residential',
    ifcPath: '/demo/residential_tower_zone_iv.ifc',
    thumbnail: '🏢',
    color: '#4CAF50',
    // Default dimensions for visualization
    footing_length: 4.0,
    footing_width: 4.0,
    footing_depth: 2.0,
    column_width: 0.8,
    column_depth: 0.8,
    column_height: 3.5
  },
  {
    id: 'commercial-complex',
    name: 'Commercial Complex',
    description: 'Multi-storey commercial structure with moment frames',
    seismicZone: 'III',
    storeys: 8,
    type: 'commercial',
    ifcPath: '/demo/commercial_complex_zone_iii.ifc',
    thumbnail: '🏬',
    color: '#2196F3',
    footing_length: 5.0,
    footing_width: 5.0,
    footing_depth: 2.5,
    column_width: 1.0,
    column_depth: 1.0,
    column_height: 4.0
  },
  {
    id: 'hospital-building',
    name: 'Hospital Building',
    description: 'Critical facility with enhanced seismic design',
    seismicZone: 'V',
    storeys: 6,
    type: 'institutional',
    ifcPath: '/demo/hospital_zone_v.ifc',
    thumbnail: '🏥',
    color: '#FF9800',
    footing_length: 6.0,
    footing_width: 6.0,
    footing_depth: 3.0,
    column_width: 1.2,
    column_depth: 1.2,
    column_height: 4.5
  },
  {
    id: 'school-building',
    name: 'School Building',
    description: 'Educational facility with regular structural layout',
    seismicZone: 'II',
    storeys: 4,
    type: 'institutional',
    ifcPath: '/demo/school_zone_ii.ifc',
    thumbnail: '🏫',
    color: '#9C27B0',
    footing_length: 3.5,
    footing_width: 3.5,
    footing_depth: 1.8,
    column_width: 0.7,
    column_depth: 0.7,
    column_height: 3.5
  },
  {
    id: 'industrial-warehouse',
    name: 'Industrial Warehouse',
    description: 'Large span industrial structure with steel frames',
    seismicZone: 'III',
    storeys: 2,
    type: 'industrial',
    ifcPath: '/demo/warehouse_zone_iii.ifc',
    thumbnail: '🏭',
    color: '#FF5722',
    footing_length: 8.0,
    footing_width: 8.0,
    footing_depth: 3.5,
    column_width: 1.5,
    column_depth: 1.5,
    column_height: 7.0
  },
  {
    id: 'demo-building',
    name: 'Demo Building',
    description: 'Simple demonstration model for learning',
    seismicZone: 'III',
    storeys: 3,
    type: 'residential',
    ifcPath: '/demo/demo_building_zone_iii.ifc',
    thumbnail: '🏗️',
    color: '#607D8B',
    footing_length: 3.0,
    footing_width: 3.0,
    footing_depth: 1.5,
    column_width: 0.6,
    column_depth: 0.6,
    column_height: 3.0
  }
];

/**
 * Get building by ID
 */
export function getBuildingById(id) {
  return buildingRegistry.find(building => building.id === id);
}

/**
 * Filter buildings by type
 */
export function getBuildingsByType(type) {
  if (type === 'all') return buildingRegistry;
  return buildingRegistry.filter(building => building.type === type);
}

/**
 * Get all building types
 */
export function getBuildingTypes() {
  return [
    { value: 'all', label: 'All Buildings' },
    { value: 'residential', label: 'Residential' },
    { value: 'commercial', label: 'Commercial' },
    { value: 'institutional', label: 'Institutional' },
    { value: 'industrial', label: 'Industrial' }
  ];
}
