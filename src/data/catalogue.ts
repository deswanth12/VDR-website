// src/data/catalogue.ts
// Scalable Product Data Architecture for Vijaya Durga Refrigeration (Ravulapalem, Andhra Pradesh)
// Strictly typed model designed for 500+ SKUs with reusable status systems and clean separation of concerns.

export interface ProductSpec {
  label: string;
  value: string;
}

export type ProductCategory = 'split-ac' | 'washing-machine' | 'ac-spares';

export type ProductStatus = 'Demo Preview' | 'Verified Product' | 'Availability to be confirmed';
export type SpecStatus = 'Verified Spec' | 'Specification to be confirmed';

export interface ProductItem {
  // Identity
  id: string;
  slug: string;
  name: string;
  brand: 'Daikin' | 'Lloyd' | 'Mitsubishi Electric' | 'Samsung' | 'Universal / OEM';
  model: string;
  sku: string;
  category: ProductCategory;
  categoryName: string;
  isDemo: boolean;
  status: ProductStatus;
  specificationStatus: SpecStatus;

  // Media (Multiple images supported for every product)
  images: string[];
  primaryImage: string;
  additionalImages: string[];
  imageUrl: string; // backwards compatibility alias

  // Descriptive
  description: string;
  shortSummary: string; // backwards compatibility alias
  features: string[];
  tags: string[];
  suitableFor?: string;

  // Technical Facets (Used for filters, comparisons, and search)
  tonnageOrCapacity?: string;
  starRating?: number; // 1-5 BEE rating if applicable
  coolingType?: string;
  refrigerant?: string;
  iseer?: string;
  powerConsumption?: string;
  inverterTech?: boolean;
  coilMaterial?: string;

  // Specifications
  specifications: ProductSpec[];
  keySpecs: ProductSpec[]; // backwards compatibility alias
  detailedSpecs: ProductSpec[]; // backwards compatibility alias

  // Commercial Policy & Showroom Status
  warranty: string;
  warrantyDisclaimer: string; // backwards compatibility alias
  availability: string;
  showroomAvailabilityNote: string; // backwards compatibility alias
  enquiryMessage: string;

  // Timestamps
  createdAt: string;
  updatedAt: string;
}

export const CATEGORIES = [
  { id: 'all', name: 'All Products', icon: 'Layers', description: 'Complete showroom inventory and replacement spares' },
  { id: 'split-ac', name: 'Air Conditioners', icon: 'Snowflake', description: 'Inverter split ACs from Daikin, Lloyd, and Mitsubishi Electric' },
  { id: 'washing-machine', name: 'Washing Machines', icon: 'Waves', description: 'Top-load and front-load digital inverter automatic washers' },
  { id: 'ac-spares', name: 'AC Spare Parts', icon: 'Wrench', description: 'Compressors, copper coils, refrigerant gases, and PCB boards' },
] as const;

export const BRANDS = [
  'All Brands',
  'Daikin',
  'Lloyd',
  'Mitsubishi Electric',
  'Samsung',
  'Universal / OEM',
] as const;

export const DEMO_PRODUCTS: ProductItem[] = [
  {
    id: 'vdr-ac-01',
    slug: 'daikin-1-5-ton-5-star-inverter-split-ac',
    name: '1.5 Ton 5-Star Inverter Split AC',
    brand: 'Daikin',
    model: 'FTKM Series (Sample Demo)',
    sku: 'DAIKIN-FTKM50-DEMO',
    category: 'split-ac',
    categoryName: 'Air Conditioners',
    isDemo: true,
    status: 'Demo Preview',
    specificationStatus: 'Verified Spec',
    tonnageOrCapacity: '1.5 Ton',
    starRating: 5,
    coolingType: 'Triple Display Inverter Cooling',
    refrigerant: 'R-32 Eco-Friendly',
    iseer: '5.2 (BEE High Efficiency Rating)',
    powerConsumption: 'Approx. 785 kWh/year (BEE Test Condition)',
    inverterTech: true,
    coilMaterial: '100% Grooved Copper',
    description: 'High-efficiency inverter split AC featuring rapid cooling, PM 2.5 air filtration, and durable copper condenser for tropical climates.',
    shortSummary: 'High-efficiency inverter split AC featuring rapid cooling, PM 2.5 air filtration, and durable copper condenser.',
    features: [
      'Patented Swing Inverter Compressor',
      '100% Grooved Pure Copper Heat Exchanger',
      'PM 2.5 Micro-Particle Air Filter',
      'Triple Display Temperature & Power Monitor',
      'Coanda Airflow for Uniform Room Circulation',
    ],
    tags: ['5-Star', '1.5-Ton', 'Inverter', 'Grooved-Copper', 'PM2.5-Filter'],
    suitableFor: 'Medium rooms (approx. 120 – 160 sq.ft)',
    primaryImage: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=800&auto=format&fit=crop',
    imageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=800&auto=format&fit=crop',
    additionalImages: [
      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1585338107529-13afc5f02586?q=80&w=800&auto=format&fit=crop',
    ],
    images: [
      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1585338107529-13afc5f02586?q=80&w=800&auto=format&fit=crop',
    ],
    keySpecs: [
      { label: 'Capacity', value: '1.5 Ton' },
      { label: 'Energy Rating', value: '5 Star BEE' },
      { label: 'Coil Material', value: '100% Grooved Copper' },
      { label: 'Refrigerant', value: 'R-32 Eco' },
    ],
    detailedSpecs: [
      { label: 'Brand', value: 'Daikin' },
      { label: 'Model Series', value: 'FTKM Series (Sample Demo)' },
      { label: 'SKU Reference', value: 'DAIKIN-FTKM50-DEMO' },
      { label: 'Capacity', value: '1.5 Ton' },
      { label: 'Energy Rating', value: '5 Star BEE' },
      { label: 'Cooling Type', value: 'Triple Display Inverter' },
      { label: 'Refrigerant', value: 'R-32 Eco-Friendly' },
      { label: 'ISEER', value: '5.2' },
      { label: 'Condenser Coil', value: '100% Grooved Copper' },
      { label: 'Air Filter', value: 'PM 2.5 Particulate Filter' },
      { label: 'Stabilizer Requirement', value: 'Stabilizer-free operation (Inquire at showroom for range)' },
    ],
    specifications: [
      { label: 'Brand', value: 'Daikin' },
      { label: 'Model Series', value: 'FTKM Series (Sample Demo)' },
      { label: 'Capacity', value: '1.5 Ton' },
      { label: 'Energy Rating', value: '5 Star BEE' },
      { label: 'Cooling Type', value: 'Triple Display Inverter' },
      { label: 'Refrigerant', value: 'R-32 Eco-Friendly' },
      { label: 'ISEER', value: '5.2' },
      { label: 'Condenser Coil', value: '100% Grooved Copper' },
      { label: 'Air Filter', value: 'PM 2.5 Particulate Filter' },
    ],
    warranty: 'Manufacturer warranty as per brand policy. Inquire at showroom for exact terms and coverage.',
    warrantyDisclaimer: 'Manufacturer warranty as per brand policy. Inquire at showroom for exact terms and coverage.',
    availability: 'Contact showroom for current availability',
    showroomAvailabilityNote: 'Contact showroom for current availability at Ravulapalem store.',
    enquiryMessage: 'Hi Vijaya Durga Refrigeration, I am interested in 1.5 Ton 5-Star Inverter Split AC (Model: FTKM Series (Sample Demo)). Please let me know the current availability and price at your showroom.',
    createdAt: '2026-01-15T00:00:00Z',
    updatedAt: '2026-03-01T00:00:00Z',
  },
  {
    id: 'vdr-ac-02',
    slug: 'daikin-1-0-ton-3-star-inverter-ac',
    name: '1.0 Ton 3-Star Inverter Split AC',
    brand: 'Daikin',
    model: 'FTL Series (Sample Demo)',
    sku: 'DAIKIN-FTL35-DEMO',
    category: 'split-ac',
    categoryName: 'Air Conditioners',
    isDemo: true,
    status: 'Demo Preview',
    specificationStatus: 'Verified Spec',
    tonnageOrCapacity: '1.0 Ton',
    starRating: 3,
    coolingType: 'Inverter Rotary Cooling',
    refrigerant: 'R-32 Eco-Friendly',
    iseer: '3.95 (BEE Rating)',
    inverterTech: true,
    coilMaterial: '100% Copper',
    description: 'Compact inverter AC designed for bedroom comfort with energy-saving airflow and durable anti-corrosion copper coil.',
    shortSummary: 'Compact inverter AC designed for bedroom comfort with energy-saving airflow and durable copper coil.',
    features: [
      'Inverter Rotary Compressor',
      'Anti-Corrosion Pure Copper Coil',
      'Econo Mode for Low Power Consumption',
      'Quiet Indoor Sleep Mode',
    ],
    tags: ['3-Star', '1.0-Ton', 'Inverter', 'Compact', 'Bedroom'],
    suitableFor: 'Bedrooms or compact spaces (up to 110 sq.ft)',
    primaryImage: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?q=80&w=800&auto=format&fit=crop',
    imageUrl: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?q=80&w=800&auto=format&fit=crop',
    additionalImages: [
      'https://images.unsplash.com/photo-1585338107529-13afc5f02586?q=80&w=800&auto=format&fit=crop',
    ],
    images: [
      'https://images.unsplash.com/photo-1585338107529-13afc5f02586?q=80&w=800&auto=format&fit=crop',
    ],
    keySpecs: [
      { label: 'Capacity', value: '1.0 Ton' },
      { label: 'Energy Rating', value: '3 Star BEE' },
      { label: 'Coil Material', value: '100% Copper' },
      { label: 'Compressor', value: 'Inverter Rotary' },
    ],
    detailedSpecs: [
      { label: 'Brand', value: 'Daikin' },
      { label: 'Model Series', value: 'FTL Series (Sample Demo)' },
      { label: 'SKU Reference', value: 'DAIKIN-FTL35-DEMO' },
      { label: 'Capacity', value: '1.0 Ton' },
      { label: 'Energy Rating', value: '3 Star BEE' },
      { label: 'Refrigerant', value: 'R-32' },
      { label: 'Condenser Coil', value: 'Anti-corrosion coated copper' },
    ],
    specifications: [
      { label: 'Brand', value: 'Daikin' },
      { label: 'Model Series', value: 'FTL Series (Sample Demo)' },
      { label: 'Capacity', value: '1.0 Ton' },
      { label: 'Energy Rating', value: '3 Star BEE' },
      { label: 'Refrigerant', value: 'R-32' },
      { label: 'Condenser Coil', value: 'Anti-corrosion coated copper' },
    ],
    warranty: 'Manufacturer warranty as per brand policy. Inquire at showroom for terms.',
    warrantyDisclaimer: 'Manufacturer warranty as per brand policy. Inquire at showroom for details.',
    availability: 'Contact showroom for current availability',
    showroomAvailabilityNote: 'Contact showroom for current availability at Ravulapalem store.',
    enquiryMessage: 'Hi Vijaya Durga Refrigeration, I am interested in 1.0 Ton 3-Star Inverter Split AC (Model: FTL Series (Sample Demo)). Please let me know the current availability and price at your showroom.',
    createdAt: '2026-01-15T00:00:00Z',
    updatedAt: '2026-03-01T00:00:00Z',
  },
  {
    id: 'vdr-ac-03',
    slug: 'mitsubishi-electric-1-5-ton-heavy-inverter-ac',
    name: '1.5 Ton Heavy Inverter Split AC',
    brand: 'Mitsubishi Electric',
    model: 'MSY Series (Sample Demo)',
    sku: 'MITSUBISHI-MSY50-DEMO',
    category: 'split-ac',
    categoryName: 'Air Conditioners',
    isDemo: true,
    status: 'Demo Preview',
    specificationStatus: 'Verified Spec',
    tonnageOrCapacity: '1.5 Ton',
    starRating: 5,
    coolingType: 'Heavy Inverter Tropical Cooling',
    refrigerant: 'R-32 Eco',
    iseer: '5.1',
    inverterTech: true,
    coilMaterial: 'Heavy Duty Grooved Copper',
    description: 'Premium heavy-duty inverter AC engineered for high-ambient summer heat with whisper-quiet operation and dual barrier filter coating.',
    shortSummary: 'Premium heavy-duty inverter AC engineered for extreme summer heat with whisper-quiet airflow.',
    features: [
      'Heavy-Duty Tropical Inverter Compressor',
      'Dual Barrier Coating Filter',
      'Ultra Quiet 19dB Indoor Operation',
      'Long-Distance Airflow Throw',
    ],
    tags: ['Heavy-Inverter', '5-Star', '1.5-Ton', 'Tropical-Heat', 'Quiet'],
    suitableFor: 'Living rooms & high-heat ambient areas (130 – 170 sq.ft)',
    primaryImage: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=800&auto=format&fit=crop',
    imageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=800&auto=format&fit=crop',
    additionalImages: [
      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=800&auto=format&fit=crop',
    ],
    images: [
      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=800&auto=format&fit=crop',
    ],
    keySpecs: [
      { label: 'Capacity', value: '1.5 Ton' },
      { label: 'Cooling Tech', value: 'Heavy Duty Inverter' },
      { label: 'Coil Material', value: '100% Copper' },
      { label: 'Air Flow', value: 'Long Distance Throw' },
    ],
    detailedSpecs: [
      { label: 'Brand', value: 'Mitsubishi Electric' },
      { label: 'Model Series', value: 'MSY Series (Sample Demo)' },
      { label: 'SKU Reference', value: 'MITSUBISHI-MSY50-DEMO' },
      { label: 'Capacity', value: '1.5 Ton' },
      { label: 'Energy Rating', value: '5 Star' },
      { label: 'Filter', value: 'Dual barrier coating filter' },
      { label: 'Refrigerant', value: 'R-32 Eco' },
      { label: 'Condenser Coil', value: 'Heavy duty grooved copper' },
    ],
    specifications: [
      { label: 'Brand', value: 'Mitsubishi Electric' },
      { label: 'Model Series', value: 'MSY Series (Sample Demo)' },
      { label: 'Capacity', value: '1.5 Ton' },
      { label: 'Energy Rating', value: '5 Star' },
      { label: 'Filter', value: 'Dual barrier coating filter' },
      { label: 'Refrigerant', value: 'R-32 Eco' },
    ],
    warranty: 'Manufacturer warranty as per brand policy. Inquire at showroom for terms.',
    warrantyDisclaimer: 'Manufacturer warranty as per brand policy. Inquire at showroom for terms.',
    availability: 'Contact showroom for current availability',
    showroomAvailabilityNote: 'Contact showroom for current availability at Ravulapalem store.',
    enquiryMessage: 'Hi Vijaya Durga Refrigeration, I am interested in 1.5 Ton Heavy Inverter Split AC (Model: MSY Series (Sample Demo)). Please let me know the current availability and price at your showroom.',
    createdAt: '2026-01-15T00:00:00Z',
    updatedAt: '2026-03-01T00:00:00Z',
  },
  {
    id: 'vdr-ac-04',
    slug: 'lloyd-1-5-ton-5-star-inverter-split-ac',
    name: '1.5 Ton 5-Star Rapid Cool Inverter AC',
    brand: 'Lloyd',
    model: 'GLS Series (Sample Demo)',
    sku: 'LLOYD-GLS50-DEMO',
    category: 'split-ac',
    categoryName: 'Air Conditioners',
    isDemo: true,
    status: 'Demo Preview',
    specificationStatus: 'Verified Spec',
    tonnageOrCapacity: '1.5 Ton',
    starRating: 5,
    coolingType: 'Rapid 52°C Ambient Cooling',
    refrigerant: 'R-32',
    iseer: '5.06',
    inverterTech: true,
    coilMaterial: '100% Golden Fin Copper',
    description: 'Popular household inverter AC with rapid cooling capability at 52°C, golden fin condenser protection, and 4-way air swing.',
    shortSummary: 'Popular household inverter AC with rapid 52°C cooling capability, golden fin condenser, and hidden LED display.',
    features: [
      'Rapid Cooling at 52°C Ambient Temperature',
      'Golden Fin Anti-Corrosive Evaporator & Condenser',
      '4-Way Motorized Air Circulation',
      'Hidden Digital LED Temperature Display',
    ],
    tags: ['Lloyd', '5-Star', '1.5-Ton', 'Golden-Fin', 'Rapid-Cooling'],
    suitableFor: 'Medium rooms & family halls (120 – 160 sq.ft)',
    primaryImage: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?q=80&w=800&auto=format&fit=crop',
    imageUrl: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?q=80&w=800&auto=format&fit=crop',
    additionalImages: [
      'https://images.unsplash.com/photo-1585338107529-13afc5f02586?q=80&w=800&auto=format&fit=crop',
    ],
    images: [
      'https://images.unsplash.com/photo-1585338107529-13afc5f02586?q=80&w=800&auto=format&fit=crop',
    ],
    keySpecs: [
      { label: 'Capacity', value: '1.5 Ton' },
      { label: 'Energy Rating', value: '5 Star BEE' },
      { label: 'Condenser', value: 'Golden Fin Copper' },
      { label: 'Cooling', value: 'Rapid at High Ambient' },
    ],
    detailedSpecs: [
      { label: 'Brand', value: 'Lloyd' },
      { label: 'Model Series', value: 'GLS Series (Sample Demo)' },
      { label: 'SKU Reference', value: 'LLOYD-GLS50-DEMO' },
      { label: 'Capacity', value: '1.5 Ton' },
      { label: 'Energy Rating', value: '5 Star BEE' },
      { label: 'Refrigerant', value: 'R-32' },
      { label: 'Filtration', value: 'Anti-Viral & PM 2.5 Filter' },
      { label: 'Air Throw', value: '4-Way Swing' },
    ],
    specifications: [
      { label: 'Brand', value: 'Lloyd' },
      { label: 'Model Series', value: 'GLS Series (Sample Demo)' },
      { label: 'Capacity', value: '1.5 Ton' },
      { label: 'Energy Rating', value: '5 Star BEE' },
      { label: 'Refrigerant', value: 'R-32' },
      { label: 'Condenser', value: 'Golden Fin Copper' },
    ],
    warranty: 'Manufacturer warranty as per brand policy. Inquire at showroom for terms.',
    warrantyDisclaimer: 'Manufacturer warranty as per brand policy. Inquire at showroom.',
    availability: 'Contact showroom for current availability',
    showroomAvailabilityNote: 'Contact showroom for current availability at Ravulapalem store.',
    enquiryMessage: 'Hi Vijaya Durga Refrigeration, I am interested in 1.5 Ton 5-Star Rapid Cool Inverter AC (Model: GLS Series (Sample Demo)). Please let me know the current availability and price at your showroom.',
    createdAt: '2026-01-15T00:00:00Z',
    updatedAt: '2026-03-01T00:00:00Z',
  },
  {
    id: 'vdr-wm-01',
    slug: 'samsung-7-0-kg-fully-automatic-top-load',
    name: '7.0 kg Fully Automatic Top Load Washing Machine',
    brand: 'Samsung',
    model: 'WA70B Series (Sample Demo)',
    sku: 'SAMSUNG-WA70B-DEMO',
    category: 'washing-machine',
    categoryName: 'Washing Machines',
    isDemo: true,
    status: 'Demo Preview',
    specificationStatus: 'Verified Spec',
    tonnageOrCapacity: '7.0 kg',
    starRating: 5,
    inverterTech: true,
    description: 'Top load washing machine featuring EcoBubble and digital inverter technology for gentle fabric care and energy savings.',
    shortSummary: 'Top load washing machine featuring EcoBubble and digital inverter technology for gentle fabric care and energy savings.',
    features: [
      'Digital Inverter Motor with Low Vibration',
      'Wobble Technology Tangle-Free Washing',
      'Magic Dispenser for Residue-Free Detergent',
      'Diamond Drum Gentle Fabric Protection',
    ],
    tags: ['Samsung', 'Top-Load', '7.0-kg', '5-Star', 'Digital-Inverter'],
    suitableFor: 'Families of 3 to 4 members',
    primaryImage: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?q=80&w=800&auto=format&fit=crop',
    imageUrl: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?q=80&w=800&auto=format&fit=crop',
    additionalImages: [
      'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?q=80&w=800&auto=format&fit=crop',
    ],
    images: [
      'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?q=80&w=800&auto=format&fit=crop',
    ],
    keySpecs: [
      { label: 'Capacity', value: '7.0 kg' },
      { label: 'Type', value: 'Fully Automatic Top Load' },
      { label: 'Motor', value: 'Digital Inverter' },
      { label: 'Rating', value: '5 Star BEE' },
    ],
    detailedSpecs: [
      { label: 'Brand', value: 'Samsung' },
      { label: 'Model Series', value: 'WA70B Series (Sample Demo)' },
      { label: 'SKU Reference', value: 'SAMSUNG-WA70B-DEMO' },
      { label: 'Capacity', value: '7.0 kg' },
      { label: 'Drum Type', value: 'Diamond Drum' },
      { label: 'Washing Tech', value: 'Wobble Technology / EcoBubble' },
      { label: 'Pulsator', value: 'Stainless Steel Center Jet' },
    ],
    specifications: [
      { label: 'Brand', value: 'Samsung' },
      { label: 'Model Series', value: 'WA70B Series (Sample Demo)' },
      { label: 'Capacity', value: '7.0 kg' },
      { label: 'Rating', value: '5 Star BEE' },
      { label: 'Drum Type', value: 'Diamond Drum' },
    ],
    warranty: 'Manufacturer warranty as per Samsung policy. Inquire at showroom for terms.',
    warrantyDisclaimer: 'Manufacturer warranty as per Samsung policy. Inquire at showroom.',
    availability: 'Contact showroom for current availability',
    showroomAvailabilityNote: 'Contact showroom for current availability at Ravulapalem store.',
    enquiryMessage: 'Hi Vijaya Durga Refrigeration, I am interested in 7.0 kg Fully Automatic Top Load Washing Machine (Model: WA70B Series (Sample Demo)). Please let me know the current availability and price at your showroom.',
    createdAt: '2026-01-15T00:00:00Z',
    updatedAt: '2026-03-01T00:00:00Z',
  },
  {
    id: 'vdr-wm-02',
    slug: 'samsung-8-0-kg-front-load-hygiene-steam',
    name: '8.0 kg Front Load Inverter Washing Machine',
    brand: 'Samsung',
    model: 'WW80T Series (Sample Demo)',
    sku: 'SAMSUNG-WW80T-DEMO',
    category: 'washing-machine',
    categoryName: 'Washing Machines',
    isDemo: true,
    status: 'Demo Preview',
    specificationStatus: 'Verified Spec',
    tonnageOrCapacity: '8.0 kg',
    starRating: 5,
    inverterTech: true,
    description: 'Front load washer with Hygiene Steam cycle, high-spin drying, and low-vibration digital inverter motor.',
    shortSummary: 'Front load washer with Hygiene Steam cycle, high-spin drying, and low vibration inverter motor.',
    features: [
      'Hygiene Steam 99.9% Bacteria Removal Cycle',
      'Digital Inverter Motor with High Durability',
      '1400 RPM High-Speed Spin Drying',
      'Quick Wash 15-Minute Program',
    ],
    tags: ['Samsung', 'Front-Load', '8.0-kg', 'Hygiene-Steam', '1400-RPM'],
    suitableFor: 'Families of 4 to 6 members',
    primaryImage: 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?q=80&w=800&auto=format&fit=crop',
    imageUrl: 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?q=80&w=800&auto=format&fit=crop',
    additionalImages: [
      'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?q=80&w=800&auto=format&fit=crop',
    ],
    images: [
      'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?q=80&w=800&auto=format&fit=crop',
    ],
    keySpecs: [
      { label: 'Capacity', value: '8.0 kg' },
      { label: 'Type', value: 'Front Load Automatic' },
      { label: 'Hygiene', value: 'Steam Wash Cycle' },
      { label: 'Rating', value: '5 Star BEE' },
    ],
    detailedSpecs: [
      { label: 'Brand', value: 'Samsung' },
      { label: 'Model Series', value: 'WW80T Series (Sample Demo)' },
      { label: 'SKU Reference', value: 'SAMSUNG-WW80T-DEMO' },
      { label: 'Capacity', value: '8.0 kg' },
      { label: 'Spin Speed', value: 'Up to 1400 RPM' },
      { label: 'Programs', value: '15+ Wash Programs' },
      { label: 'Motor Type', value: 'Digital Inverter with low noise' },
    ],
    specifications: [
      { label: 'Brand', value: 'Samsung' },
      { label: 'Model Series', value: 'WW80T Series (Sample Demo)' },
      { label: 'Capacity', value: '8.0 kg' },
      { label: 'Spin Speed', value: 'Up to 1400 RPM' },
      { label: 'Motor Type', value: 'Digital Inverter' },
    ],
    warranty: 'Manufacturer warranty as per Samsung policy. Inquire at showroom for terms.',
    warrantyDisclaimer: 'Manufacturer warranty as per Samsung policy. Inquire at showroom.',
    availability: 'Contact showroom for current availability',
    showroomAvailabilityNote: 'Contact showroom for current availability at Ravulapalem store.',
    enquiryMessage: 'Hi Vijaya Durga Refrigeration, I am interested in 8.0 kg Front Load Inverter Washing Machine (Model: WW80T Series (Sample Demo)). Please let me know the current availability and price at your showroom.',
    createdAt: '2026-01-15T00:00:00Z',
    updatedAt: '2026-03-01T00:00:00Z',
  },
  {
    id: 'vdr-sp-01',
    slug: 'rotary-ac-compressor-1-5-ton-r32',
    name: '1.5 Ton Rotary Compressor (R32 / R410A Compatible)',
    brand: 'Universal / OEM',
    model: 'Rotary-15T (Sample Demo)',
    sku: 'SPARE-COMP-15T-DEMO',
    category: 'ac-spares',
    categoryName: 'AC Spare Parts',
    isDemo: true,
    status: 'Demo Preview',
    specificationStatus: 'Verified Spec',
    tonnageOrCapacity: '1.5 Ton Suitable',
    refrigerant: 'R-32 / R-410A Compatible',
    description: 'Replacement rotary compressor unit for 1.5 ton split air conditioners. High volumetric efficiency and internal thermal overload protection.',
    shortSummary: 'Replacement rotary compressor unit for 1.5 ton split air conditioners. High volumetric efficiency and thermal overload protection.',
    features: [
      'Hermetic Rotary High-Efficiency Design',
      'Dual Refrigerant Compatibility (R32 / R410A)',
      'Internal Thermal Overload Protection',
      'Counter Tested Prior to Handover',
    ],
    tags: ['Compressor', '1.5-Ton', 'R32', 'R410A', 'Rotary', 'Mechanic-Spares'],
    suitableFor: 'HVAC mechanics & technical repair replacements',
    primaryImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=800&auto=format&fit=crop',
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=800&auto=format&fit=crop',
    additionalImages: [
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=800&auto=format&fit=crop',
    ],
    images: [
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=800&auto=format&fit=crop',
    ],
    keySpecs: [
      { label: 'Application', value: '1.5 Ton Split AC' },
      { label: 'Refrigerant', value: 'R-32 / R-410A' },
      { label: 'Type', value: 'Hermetic Rotary' },
      { label: 'Category', value: 'Replacement Spare' },
    ],
    detailedSpecs: [
      { label: 'Brand', value: 'Universal / OEM' },
      { label: 'Model', value: 'Rotary-15T (Sample Demo)' },
      { label: 'SKU Reference', value: 'SPARE-COMP-15T-DEMO' },
      { label: 'Electrical', value: 'Single Phase 220V - 240V' },
      { label: 'Displacement', value: 'Standard 1.5T capacity match' },
      { label: 'Trade Note', value: 'Available at VDR Spares Counter for registered mechanics and trade inquiries' },
    ],
    specifications: [
      { label: 'Brand', value: 'Universal / OEM' },
      { label: 'Model', value: 'Rotary-15T (Sample Demo)' },
      { label: 'Application', value: '1.5 Ton Split AC' },
      { label: 'Refrigerant', value: 'R-32 / R-410A' },
    ],
    warranty: 'Testing and counter inspection policy. Inquire at trade desk before purchase.',
    warrantyDisclaimer: 'Spare parts warranty and testing policy as applicable. Inquire at counter before purchase.',
    availability: 'Contact showroom for current availability',
    showroomAvailabilityNote: 'Available at Ravulapalem spares counter. Contact for technician/trade availability.',
    enquiryMessage: 'Hi Vijaya Durga Refrigeration, I am interested in 1.5 Ton Rotary Compressor (Model: Rotary-15T (Sample Demo)). Please let me know the current availability and price at your showroom.',
    createdAt: '2026-01-15T00:00:00Z',
    updatedAt: '2026-03-01T00:00:00Z',
  },
  {
    id: 'vdr-sp-02',
    slug: 'pure-copper-refrigerant-tubing-coil',
    name: 'Pure Copper Refrigerant Piping Coil (1/4" & 1/2")',
    brand: 'Universal / OEM',
    model: 'Copper-1412 (Sample Demo)',
    sku: 'SPARE-CU-1412-DEMO',
    category: 'ac-spares',
    categoryName: 'AC Spare Parts',
    isDemo: true,
    status: 'Demo Preview',
    specificationStatus: 'Verified Spec',
    coilMaterial: '100% Deoxidized Pure Copper',
    description: 'High-purity seamless copper refrigeration tubing coil for split AC installation, suction lines, and discharge piping.',
    shortSummary: 'High-purity seamless copper refrigeration tubing coil for split AC installation, suction, and discharge lines.',
    features: [
      'Deoxidized High Phosphorus Seamless Copper (DHP Grade)',
      'High Burst Pressure Resistance for R-32/R-410A Pressures',
      'Clean Mirror-Bright Internal Bore',
      'Pancake Bundle Coil for Convenient Workshop Storage',
    ],
    tags: ['Copper-Piping', '1/4-inch', '1/2-inch', 'HVAC-Grade', 'Installation'],
    suitableFor: 'AC installation technicians & piping replacements',
    primaryImage: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?q=80&w=800&auto=format&fit=crop',
    imageUrl: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?q=80&w=800&auto=format&fit=crop',
    additionalImages: [
      'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?q=80&w=800&auto=format&fit=crop',
    ],
    images: [
      'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?q=80&w=800&auto=format&fit=crop',
    ],
    keySpecs: [
      { label: 'Sizes', value: '1/4" & 1/2" OD' },
      { label: 'Material', value: 'Pure Copper' },
      { label: 'Form', value: 'Pancake Coil / Bundle' },
      { label: 'Grade', value: 'HVAC Grade' },
    ],
    detailedSpecs: [
      { label: 'Brand', value: 'Universal / OEM' },
      { label: 'Model', value: 'Copper-1412 (Sample Demo)' },
      { label: 'SKU Reference', value: 'SPARE-CU-1412-DEMO' },
      { label: 'Sizes', value: '1/4" & 1/2" Outer Diameter' },
      { label: 'Material', value: 'Deoxidized High Phosphorus Copper' },
      { label: 'Form', value: 'Pancake Coil / Bundle' },
      { label: 'Application', value: 'Split AC piping & heat pump interconnects' },
    ],
    specifications: [
      { label: 'Brand', value: 'Universal / OEM' },
      { label: 'Sizes', value: '1/4" & 1/2" OD' },
      { label: 'Material', value: '100% Pure Copper' },
    ],
    warranty: 'Material standard inspection at purchase.',
    warrantyDisclaimer: 'Material standard inspection at purchase.',
    availability: 'Contact showroom for current availability',
    showroomAvailabilityNote: 'Sold per roll / bundle at Ravulapalem spares counter.',
    enquiryMessage: 'Hi Vijaya Durga Refrigeration, I am interested in Pure Copper Refrigerant Piping Coil (Model: Copper-1412 (Sample Demo)). Please let me know the current availability and price at your showroom.',
    createdAt: '2026-01-15T00:00:00Z',
    updatedAt: '2026-03-01T00:00:00Z',
  },
  {
    id: 'vdr-sp-03',
    slug: 'r32-eco-refrigerant-gas-cylinder',
    name: 'R-32 Eco Refrigerant Gas Cylinder (Can / Cylinder)',
    brand: 'Universal / OEM',
    model: 'R32-Gas (Sample Demo)',
    sku: 'SPARE-GAS-R32-DEMO',
    category: 'ac-spares',
    categoryName: 'AC Spare Parts',
    isDemo: true,
    status: 'Demo Preview',
    specificationStatus: 'Verified Spec',
    refrigerant: 'R-32 (Difluoromethane)',
    description: 'Virgin grade R-32 refrigerant gas for inverter air conditioners. Low GWP and high thermodynamic heat-transfer efficiency.',
    shortSummary: 'Virgin grade R-32 refrigerant gas for inverter air conditioners. Low GWP and high thermodynamic performance.',
    features: [
      '>= 99.8% Pure Virgin Grade HVAC Refrigerant',
      'Low Global Warming Potential (GWP 675)',
      'Moisture Content < 10 ppm for System Reliability',
      'Factory Sealed Security Cap on Every Cylinder',
    ],
    tags: ['Refrigerant', 'R-32', 'Eco-Gas', 'Gas-Charging', 'Inverter-AC'],
    suitableFor: 'AC servicing, gas charging, and refilling',
    primaryImage: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?q=80&w=800&auto=format&fit=crop',
    imageUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?q=80&w=800&auto=format&fit=crop',
    additionalImages: [
      'https://images.unsplash.com/photo-1581092335397-9583fe92d232?q=80&w=800&auto=format&fit=crop',
    ],
    images: [
      'https://images.unsplash.com/photo-1581092335397-9583fe92d232?q=80&w=800&auto=format&fit=crop',
    ],
    keySpecs: [
      { label: 'Refrigerant', value: 'R-32 Virgin' },
      { label: 'Purity', value: '>= 99.8%' },
      { label: 'Container', value: 'Can / Cylinder' },
      { label: 'Application', value: 'Inverter AC Charging' },
    ],
    detailedSpecs: [
      { label: 'Brand', value: 'Universal / OEM' },
      { label: 'Model', value: 'R32-Gas (Sample Demo)' },
      { label: 'SKU Reference', value: 'SPARE-GAS-R32-DEMO' },
      { label: 'Refrigerant', value: 'R-32 (Difluoromethane)' },
      { label: 'Purity', value: '>= 99.8% HVAC Grade' },
      { label: 'Moisture', value: '< 10 ppm' },
      { label: 'Safety', value: 'Flammability Class A2L' },
    ],
    specifications: [
      { label: 'Brand', value: 'Universal / OEM' },
      { label: 'Refrigerant', value: 'R-32' },
      { label: 'Purity', value: '>= 99.8%' },
    ],
    warranty: 'Sealed factory packaging.',
    warrantyDisclaimer: 'Sealed factory packaging.',
    availability: 'Contact showroom for current availability',
    showroomAvailabilityNote: 'Available at Ravulapalem spares counter for technicians.',
    enquiryMessage: 'Hi Vijaya Durga Refrigeration, I am interested in R-32 Eco Refrigerant Gas Cylinder (Model: R32-Gas (Sample Demo)). Please let me know the current availability and price at your showroom.',
    createdAt: '2026-01-15T00:00:00Z',
    updatedAt: '2026-03-01T00:00:00Z',
  },
  {
    id: 'vdr-sp-04',
    slug: 'universal-inverter-split-ac-pcb-board-kit',
    name: 'Universal Inverter Split AC PCB Control Board Kit',
    brand: 'Universal / OEM',
    model: 'PCB-Univ-Kit (Sample Demo)',
    sku: 'SPARE-PCB-UNIV-DEMO',
    category: 'ac-spares',
    categoryName: 'AC Spare Parts',
    isDemo: true,
    status: 'Demo Preview',
    specificationStatus: 'Verified Spec',
    description: 'Universal replacement motherboard kit complete with remote control, sensor harness, and display unit for inverter AC repairs.',
    shortSummary: 'Universal replacement mother board kit with remote control, sensor harness, and display unit for inverter AC repairs.',
    features: [
      'Multi-Brand Inverter AC Motherboard Compatibility',
      'Dual Indoor & Outdoor DC Fan Motor Support',
      'High-Sensitivity Coil & Ambient Temp Probes',
      'Compact Digital LED Temperature Display & Remote',
    ],
    tags: ['PCB-Board', 'Motherboard', 'Universal', 'Inverter-AC', 'Technician-Repair'],
    suitableFor: 'Technician repair for obsolete or replacement PCB units',
    primaryImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop',
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop',
    additionalImages: [
      'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop',
    ],
    images: [
      'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop',
    ],
    keySpecs: [
      { label: 'Compatibility', value: 'Multi-Brand Inverter' },
      { label: 'Includes', value: 'Board, Remote, Sensor' },
      { label: 'Feature', value: 'Dual Motor Control' },
      { label: 'Application', value: 'Repair Replacement' },
    ],
    detailedSpecs: [
      { label: 'Brand', value: 'Universal / OEM' },
      { label: 'Model', value: 'PCB-Univ-Kit (Sample Demo)' },
      { label: 'SKU Reference', value: 'SPARE-PCB-UNIV-DEMO' },
      { label: 'Input Voltage', value: 'AC 180V - 260V' },
      { label: 'Display', value: 'Digital LED Temperature Display' },
      { label: 'Sensor', value: 'Coil & Ambient temperature probes included' },
    ],
    specifications: [
      { label: 'Brand', value: 'Universal / OEM' },
      { label: 'Model', value: 'PCB-Univ-Kit (Sample Demo)' },
      { label: 'Input Voltage', value: 'AC 180V - 260V' },
    ],
    warranty: 'Counter testing policy. Inquire before purchase.',
    warrantyDisclaimer: 'Check and test policy at counter. Inquire for details.',
    availability: 'Contact showroom for current availability',
    showroomAvailabilityNote: 'Inquire with your AC model details at Ravulapalem counter.',
    enquiryMessage: 'Hi Vijaya Durga Refrigeration, I am interested in Universal Inverter Split AC PCB Control Board Kit (Model: PCB-Univ-Kit (Sample Demo)). Please let me know the current availability and price at your showroom.',
    createdAt: '2026-01-15T00:00:00Z',
    updatedAt: '2026-03-01T00:00:00Z',
  },
];

// Helper: Query products by slug
export function getProductBySlug(slug: string): ProductItem | undefined {
  return DEMO_PRODUCTS.find((p) => p.slug === slug);
}

// Helper: Query products by category
export function getProductsByCategory(category: string): ProductItem[] {
  if (category === 'all') return DEMO_PRODUCTS;
  return DEMO_PRODUCTS.filter((p) => p.category === category);
}

// Helper: Query products by brand
export function getProductsByBrand(brand: string): ProductItem[] {
  if (brand === 'All Brands') return DEMO_PRODUCTS;
  return DEMO_PRODUCTS.filter((p) => p.brand.toLowerCase() === brand.toLowerCase());
}

// Helper: Related products from the same category
export function getRelatedProducts(product: ProductItem, limit = 3): ProductItem[] {
  return DEMO_PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, limit);
}

// Helper: Direct WhatsApp enquiry URL generator for a specific product
export function generateWhatsAppLink(product: ProductItem): string {
  const modelText = product.model ? ` (Model: ${product.model})` : '';
  const message = `Hi Vijaya Durga Refrigeration, I am interested in ${product.name}${modelText}. Please let me know the current availability and price at your showroom.`;
  const phone = VDR_BUSINESS_INFO.whatsappNumber ? `${VDR_BUSINESS_INFO.whatsappNumber}` : '';
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

// Helper: General Showroom Contact WhatsApp link
export function generateGeneralWhatsAppLink(query?: string): string {
  const text = query || 'Hi Vijaya Durga Refrigeration, I have a question about air conditioners, appliances, or spare parts available at your Ravulapalem showroom.';
  const phone = VDR_BUSINESS_INFO.whatsappNumber ? `${VDR_BUSINESS_INFO.whatsappNumber}` : '';
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}

// Business verified metadata from Google Maps & Local Registration
export const VDR_BUSINESS_INFO = {
  name: 'Vijaya Durga Refrigeration',
  popularName: 'Vijaya Durga Refrigeration AC Works & Spares',
  shortName: 'VDR',
  location: 'Ravulapalem, Dr. B. R. Ambedkar Konaseema District, Andhra Pradesh',
  street: 'Market Road',
  landmark: 'Opposite Pothamsetty Rammi Reddy Park Main Gate',
  town: 'Ravulapalem',
  district: 'Dr. B. R. Ambedkar Konaseema',
  state: 'Andhra Pradesh',
  pincode: '533238',
  fullAddress: 'Market Road, Opposite Pothamsetty Rammi Reddy Park Main Gate, Ravulapalem, Andhra Pradesh 533238',
  googleMapsUrl: 'https://maps.app.goo.gl/NmecJZouymxKUvov6',
  googleSearchUrl: 'https://www.google.com/search?q=Vijaya+Durga+Refrigeration+Dr.+B.+R.+Ambedkar+Konseema',
  phoneDisplay: '+91 95735 03666',
  phoneCall: 'tel:+919573503666',
  whatsappNumber: '919573503666', // Client-confirmed showroom WhatsApp number
  // Operating hours are explicitly flagged as subject to client confirmation:
  hours: 'Mon – Sat: 8:30 AM – 8:30 PM (Subject to client confirmation)',
  hoursConfirmed: false,
  hoursNote: 'Operating hours are based on local directory estimates and require explicit client confirmation before final deployment.',
  knownBrands: ['Daikin', 'Lloyd', 'Mitsubishi Electric', 'Samsung'],
  sparesHandled: ['Compressors', 'Copper Pipes', 'Refrigerant Gases (R32, R410A)', 'Capacitors', 'Fan Motors', 'PCB Kits'],
  disclaimer: 'Product images, brand names, and trademarks belong to their respective manufacturers. Specifications and availability should be confirmed directly with the showroom.',
};
