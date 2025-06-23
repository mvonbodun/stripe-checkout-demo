import { BaseModel, SEOFields, Status, MediaItem, Specification, PriceRange, ItemDefiningSpecification, Weight, Dimensions } from './common';

export interface Product extends BaseModel, SEOFields {
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  categoryId: string; // Primary category
  categoryIds: string[]; // Multiple category assignments
  brand?: string;
  status: Status;
  
  // Media
  images: MediaItem[];
  videos?: MediaItem[];
  documents?: MediaItem[];
  
  // Content
  features: string[];
  // Changed from 'specifications' to 'productLevelSpecifications'
  // These are specifications that apply to all variants of the product
  productLevelSpecifications: Specification[];
  // New: Defines what attributes differentiate items/variants (e.g., size, color)
  itemDefiningSpecifications?: ItemDefiningSpecification[];
  
  // Pricing
  basePrice: number;
  compareAtPrice?: number;
  priceRange?: PriceRange; // Computed from variants
  taxCode: string;
  
  // Physical attributes moved to item level
  // weight?: Weight;    // REMOVED - now at item level
  // dimensions?: Dimensions;  // REMOVED - now at item level
  
  // Computed fields
  variantCount?: number;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  totalInventory?: number;
}

export interface ProductWithVariants extends Product {
  variants: ProductVariant[];
}

export interface ProductVariant {
  id: string;
  productId: string;
  sku: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  inventoryQuantity: number;
  inventoryTracking: boolean;
  weight?: Weight;
  dimensions?: Dimensions;
  barcode?: string;
  status: Status;
  options: VariantOption[];
  images: MediaItem[];
  position: number;
}

export interface VariantOption {
  name: string; // e.g., "Color", "Size", "Capacity"
  value: string; // e.g., "Red", "Large", "256GB"
}

export interface ProductFilter {
  categoryId?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  status?: Status;
  search?: string;
}

export interface ProductSort {
  field: 'name' | 'price' | 'createdAt' | 'updatedAt';
  direction: 'asc' | 'desc';
}

// Mock product data
export const mockProducts: Product[] = [
  {
    id: 'prod_1',
    name: 'Samsung" OLED 4K Smart TV',
    slug: 'samsung-oled-4k-smart-tv',
    description: 'Experience stunning picture quality with this OLED 4K Smart TV featuring HDR10+ support, built-in streaming apps, and voice control.',
    shortDescription: 'Premium OLED 4K Smart TV with HDR10+ and streaming apps',
    categoryId: '111', // OLED TVs
    categoryIds: ['111', '11', '1'], // OLED TVs, TVs & Audio, Electronics
    brand: 'Samsung',
    status: Status.ACTIVE,
    images: [
      {
        id: 'img_1',
        url: 'https://placehold.co/600x600/e5e7eb/6b7280?text=Samsung%20OLED%20TV%20Front',
        altText: 'Samsung OLED TV front view',
        order: 1,
        type: 'image'
      },
      {
        id: 'img_2',
        url: 'https://placehold.co/600x600/e5e7eb/6b7280?text=Samsung%20OLED%20TV%20Side',
        altText: 'Samsung OLED TV side view',
        order: 2,
        type: 'image'
      }
    ],
    features: [
      'OLED Display Technology',
      '4K Ultra HD Resolution',
      'HDR10+ Support',
      'Smart TV Platform',
      'Voice Control',
      'Multiple HDMI Ports'
    ],
    productLevelSpecifications: [
      { name: 'Resolution', value: '3840 x 2160', group: 'Display' },
      { name: 'Display Type', value: 'OLED', group: 'Display' },
      { name: 'HDR Support', value: 'HDR10+', group: 'Display' },
      { name: 'Smart Platform', value: 'Tizen OS', group: 'Smart Features' },
      { name: 'WiFi', value: '802.11ac', group: 'Connectivity' },
      { name: 'HDMI Ports', value: '4', group: 'Connectivity' }
    ],
    itemDefiningSpecifications: [
      { name: 'Screen Size', group: 'Display Size' }
    ],
    basePrice: 1899.99,
    compareAtPrice: 1999.99,
    taxCode: 'txcd_99999999',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    seoTitle: 'Samsung" OLED 4K Smart TV - Premium Display Technology',
    seoDescription: 'Shop the Samsung" OLED 4K Smart TV with stunning picture quality, HDR10+ support, and smart features.'
  },
  {
    id: 'prod_2',
    name: 'Apple MacBook Pro 14-inch',
    slug: 'apple-macbook-pro-14-inch',
    description: 'Supercharged by M3 Pro chip, the 14-inch MacBook Pro delivers exceptional performance for demanding workflows with up to 18 hours of battery life.',
    shortDescription: 'M3 Pro chip, 14" Liquid Retina XDR display, up to 18hrs battery',
    categoryId: '121', // Laptops
    categoryIds: ['121', '12', '1'], // Laptops, Computers, Electronics
    brand: 'Apple',
    status: Status.ACTIVE,
    images: [
      {
        id: 'img_3',
        url: 'https://placehold.co/600x600/e5e7eb/6b7280?text=MacBook%20Pro%2014-inch%20Front',
        altText: 'MacBook Pro 14-inch in Space Gray',
        order: 1,
        type: 'image'
      },
      {
        id: 'img_4',
        url: 'https://placehold.co/600x600/e5e7eb/6b7280?text=MacBook%20Pro%2014-inch%20Open',
        altText: 'MacBook Pro 14-inch open view',
        order: 2,
        type: 'image'
      }
    ],
    features: [
      'M3 Pro chip',
      '14-inch Liquid Retina XDR display',
      'Up to 18 hours battery life',
      'Advanced camera and audio',
      'Multiple ports including Thunderbolt 4',
      'macOS Sonoma'
    ],
    productLevelSpecifications: [
      { name: 'Processor', value: 'Apple M3 Pro chip', group: 'Performance' },
      { name: 'Display', value: '14.2-inch Liquid Retina XDR', group: 'Display' },
      { name: 'Resolution', value: '3024 x 1964', group: 'Display' },
      { name: 'Memory', value: '18GB unified memory', group: 'Performance' },
      { name: 'Storage', value: '512GB SSD', group: 'Storage' },
      { name: 'Battery Life', value: 'Up to 18 hours', group: 'Power' }
    ],
    itemDefiningSpecifications: [
      { name: 'Color', group: 'Appearance' },
      { name: 'Storage', group: 'Capacity' }
    ],
    basePrice: 1999.00,
    compareAtPrice: 1999.00,
    taxCode: 'txcd_99999999',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
    seoTitle: 'Apple MacBook Pro 14-inch - M3 Pro Chip Performance',
    seoDescription: 'Experience pro-level performance with the MacBook Pro 14-inch featuring M3 Pro chip and Liquid Retina XDR display.'
  },
  {
    id: 'prod_3',
    name: 'iPhone 15 Pro',
    slug: 'iphone-15-pro',
    description: 'iPhone 15 Pro features a titanium design, A17 Pro chip, advanced camera system, and USB-C connectivity in a durable and lightweight form.',
    shortDescription: 'Titanium design, A17 Pro chip, advanced cameras, USB-C',
    categoryId: '131', // Smartphones
    categoryIds: ['131', '13', '1'], // Smartphones, Mobile Devices, Electronics
    brand: 'Apple',
    status: Status.ACTIVE,
    images: [
      {
        id: 'img_5',
        url: 'https://placehold.co/600x600/e5e7eb/6b7280?text=iPhone%2015%20Pro%20in%20Natural%20Titanium',
        altText: 'iPhone 15 Pro in Natural Titanium',
        order: 1,
        type: 'image'
      },
      {
        id: 'img_6',
        url: 'https://placehold.co/600x600/e5e7eb/6b7280?text=iPhone%2015%20Pro%20Camera%20System',
        altText: 'iPhone 15 Pro camera system',
        order: 2,
        type: 'image'
      }
    ],
    features: [
      'Titanium design',
      'A17 Pro chip',
      'Pro camera system',
      'Action Button',
      'USB-C connectivity',
      'iOS 17'
    ],
    productLevelSpecifications: [
      { name: 'Processor', value: 'A17 Pro chip', group: 'Performance' },
      { name: 'Display', value: '6.1-inch Super Retina XDR', group: 'Display' },
      { name: 'Storage Options', value: '128GB, 256GB, 512GB, 1TB', group: 'Storage' },
      { name: 'Camera', value: '48MP Main, 12MP Ultra Wide, 12MP Telephoto', group: 'Camera' },
      { name: 'Battery Life', value: 'Up to 23 hours video playback', group: 'Power' },
      { name: 'Connectivity', value: 'USB-C, 5G', group: 'Connectivity' },
      { name: 'Material', value: 'Titanium', group: 'Build' }
    ],
    itemDefiningSpecifications: [
      { name: 'Storage', group: 'Capacity' },
      { name: 'Color', group: 'Appearance' }
    ],
    basePrice: 999.00,
    priceRange: { min: 999, max: 1499 },
    taxCode: 'txcd_99999999',
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
    seoTitle: 'iPhone 15 Pro - Titanium Design with A17 Pro Chip',
    seoDescription: 'Discover the iPhone 15 Pro with titanium design, A17 Pro chip, and advanced camera system.'
  },
  {
    id: 'prod_4',
    name: 'Sony WH-1000XM5 Headphones',
    slug: 'sony-wh-1000xm5-headphones',
    description: 'Industry-leading noise canceling with the new Auto NC Optimizer, exceptional sound quality, crystal clear hands-free calling, and up to 30 hours battery life.',
    shortDescription: 'Premium noise-canceling headphones with 30hr battery',
    categoryId: '11', // TVs & Audio (using level 2 category)
    categoryIds: ['11', '1'], // TVs & Audio, Electronics
    brand: 'Sony',
    status: Status.ACTIVE,
    images: [
      {
        id: 'img_7',
        url: 'https://placehold.co/600x600/e5e7eb/6b7280?text=Sony%20WH-1000XM5%20Headphones%20in%20Black',
        altText: 'Sony WH-1000XM5 headphones in black',
        order: 1,
        type: 'image'
      }
    ],
    features: [
      'Industry-leading noise canceling',
      'Exceptional sound quality',
      '30-hour battery life',
      'Quick charge (3 min = 3 hours)',
      'Crystal clear hands-free calling',
      'Touch sensor controls'
    ],
    productLevelSpecifications: [
      { name: 'Driver Unit', value: '30mm', group: 'Audio' },
      { name: 'Frequency Response', value: '4Hz-40,000Hz', group: 'Audio' },
      { name: 'Battery Life', value: '30 hours (NC ON)', group: 'Power' },
      { name: 'Charging Time', value: '3.5 hours', group: 'Power' },
      { name: 'Weight', value: '250g', group: 'Physical' },
      { name: 'Connectivity', value: 'Bluetooth 5.2, NFC', group: 'Connectivity' }
    ],
    itemDefiningSpecifications: [
      { name: 'Color', group: 'Appearance' }
    ],
    basePrice: 399.99,
    compareAtPrice: 449.99,
    taxCode: 'txcd_99999999',
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-02-10'),
    seoTitle: 'Sony WH-1000XM5 - Premium Noise Canceling Headphones',
    seoDescription: 'Experience superior sound with Sony WH-1000XM5 noise canceling headphones featuring 30-hour battery life.'
  },
  {
    id: 'prod_5',
    name: 'Levi\'s 501 Original Jeans',
    slug: 'levis-501-original-jeans',
    description: 'The original blue jean since 1873. Levi\'s 501 Original jeans are a classic straight fit with a timeless style that never goes out of fashion.',
    shortDescription: 'Classic straight fit jeans, original since 1873',
    categoryId: '212', // Men's Pants
    categoryIds: ['212', '21', '2'], // Men's Pants, Men's Clothing, Clothing
    brand: 'Levi\'s',
    status: Status.ACTIVE,
    images: [
      {
        id: 'img_8',
        url: 'https://placehold.co/600x600/e5e7eb/6b7280?text=Levi%27s%20501%20Jeans%20in%20Dark%20Wash',
        altText: 'Levi\'s 501 jeans in dark wash',
        order: 1,
        type: 'image'
      }
    ],
    features: [
      'Original straight fit',
      '100% cotton denim',
      'Button fly',
      'Classic 5-pocket styling',
      'Sits at waist',
      'Straight through hip and thigh'
    ],
    productLevelSpecifications: [
      { name: 'Fit', value: 'Straight', group: 'Style' },
      { name: 'Material', value: '100% Cotton', group: 'Fabric' },
      { name: 'Closure', value: 'Button fly', group: 'Details' },
      { name: 'Rise', value: 'Mid rise', group: 'Fit' },
      { name: 'Leg Opening', value: '16.5 inches', group: 'Measurements' },
      { name: 'Care', value: 'Machine wash cold', group: 'Care' }
    ],
    itemDefiningSpecifications: [
      { name: 'Size', group: 'Sizing' },
      { name: 'Color', group: 'Appearance' }
    ],
    basePrice: 59.50,
    compareAtPrice: 68.00,
    taxCode: 'txcd_99999999',
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-02-15'),
    seoTitle: 'Levi\'s 501 Original Jeans - Classic Straight Fit',
    seoDescription: 'Shop the iconic Levi\'s 501 Original jeans in classic straight fit. The original blue jean since 1873.'
  },

  // Additional OLED TVs (7 more to make 8 total in category '111')
  {
    id: 'prod_6',
    name: 'Sony A90J OLED 4K HDR TV',
    slug: 'sony-a90j-oled-4k-hdr-tv',
    description: 'Premium Sony OLED TV with XR OLED Contrast Pro and Acoustic Surface Audio+',
    shortDescription: 'Premium Sony OLED with XR processor',
    categoryId: '111',
    categoryIds: ['1', '11', '111'],
    brand: 'Sony',
    status: Status.ACTIVE,
    images: [
      { id: 'img1', url: 'https://placehold.co/600x600/e5e7eb/6b7280?text=Sony%20A90J%20OLED%20TV', altText: 'Sony A90J OLED TV', type: 'image', order: 1 }
    ],
    features: ['OLED Display', '4K HDR', 'XR OLED Contrast Pro', 'Acoustic Surface Audio+', 'Google TV'],
    productLevelSpecifications: [
      { name: 'Resolution', value: '4K Ultra HD', group: 'Display' },
      { name: 'HDR', value: 'HDR10, Dolby Vision', group: 'Display' },
      { name: 'Display Type', value: 'OLED', group: 'Display' }
    ],
    itemDefiningSpecifications: [
      { name: 'Screen Size', group: 'Display Size' }
    ],
    basePrice: 1899.99,
    compareAtPrice: 1999.99,
    taxCode: 'txcd_99999999',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    seoTitle: 'Sony A90J OLED 4K HDR TV - Premium Picture Quality',
    seoDescription: 'Experience premium picture quality with Sony A90J OLED TV featuring XR processor and Acoustic Surface Audio+.'
  },
  {
    id: 'prod_7',
    name: 'Samsung S95BQD-OLED 4K TV',
    slug: 'samsung-s95bqd-oled-4k-tv',
    description: 'Samsung Quantum Dot OLED TV with Neural Quantum Processor 4K and ultra-slim design',
    shortDescription: 'Samsung QD-OLED with Quantum HDR',
    categoryId: '111',
    categoryIds: ['1', '11', '111'],
    brand: 'Samsung',
    status: Status.ACTIVE,
    images: [
      { id: 'img1', url: 'https://placehold.co/600x600/e5e7eb/6b7280?text=Samsung%20S95B%20QD-OLED%20TV', altText: 'Samsung S95B QD-OLED TV', type: 'image', order: 1 }
    ],
    features: ['QD-OLED Display', '4K HDR', 'Neural Quantum Processor 4K', 'Quantum HDR OLED', 'Tizen Smart TV'],
    productLevelSpecifications: [
      { name: 'Resolution', value: '4K Ultra HD', group: 'Display' },
      { name: 'HDR', value: 'HDR10+, Quantum HDR OLED', group: 'Display' }
    ],
    itemDefiningSpecifications: [
      { name: 'Screen Size', group: 'Display Size' }
    ],
    basePrice: 1799.99,
    compareAtPrice: 1999.99,
    taxCode: 'txcd_99999999',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
    seoTitle: 'Samsung S95B QD-OLED 4K TV - Quantum Dot OLED',
    seoDescription: 'Samsung S95B QD-OLED TV with Neural Quantum Processor 4K and stunning Quantum HDR OLED technology.'
  },
  {
    id: 'prod_8',
    name: 'Panasonic JZ2000 OLED 4K TV',
    slug: 'panasonic-jz2000-oled-4k-tv',
    description: 'Professional-grade Panasonic OLED TV with HCX Pro AI Processor and Dolby Vision IQ',
    shortDescription: 'Professional Panasonic OLED with HCX Pro AI',
    categoryId: '111',
    categoryIds: ['1', '11', '111'],
    brand: 'Panasonic',
    status: Status.ACTIVE,
    images: [
      { id: 'img1', url: 'https://placehold.co/600x600/e5e7eb/6b7280?text=Panasonic%20JZ2000%20OLED%20TV', altText: 'Panasonic JZ2000 OLED TV', type: 'image', order: 1 }
    ],
    features: ['OLED Display', '4K HDR', 'HCX Pro AI Processor', 'Dolby Vision IQ', 'My Home Screen'],
    productLevelSpecifications: [
      { name: 'Resolution', value: '4K Ultra HD', group: 'Display' },
      { name: 'HDR', value: 'HDR10+, Dolby Vision IQ', group: 'Display' }
    ],
    itemDefiningSpecifications: [
      { name: 'Screen Size', group: 'Display Size' }
    ],
    basePrice: 1999.99,
    compareAtPrice: 1999.99,
    taxCode: 'txcd_99999999',
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-01-25'),
    seoTitle: 'Panasonic JZ2000 OLED 4K TV - Professional Grade',
    seoDescription: 'Professional-grade Panasonic JZ2000 OLED TV with HCX Pro AI Processor and Dolby Vision IQ.'
  },
  {
    id: 'prod_9',
    name: 'Philips OLED806 4K Ambilight TV',
    slug: 'philips-oled806-4k-ambilight-tv',
    description: 'Philips OLED TV with unique 3-sided Ambilight technology and P5 AI Perfect Picture Engine',
    shortDescription: 'Philips OLED with 3-sided Ambilight',
    categoryId: '111',
    categoryIds: ['1', '11', '111'],
    brand: 'Philips',
    status: Status.ACTIVE,
    images: [
      { id: 'img1', url: 'https://placehold.co/600x600/e5e7eb/6b7280?text=Philips%20OLED806%20Ambilight%20TV', altText: 'Philips OLED806 Ambilight TV', type: 'image', order: 1 }
    ],
    features: ['OLED Display', '4K HDR', '3-sided Ambilight', 'P5 AI Perfect Picture', 'Android TV'],
    productLevelSpecifications: [
      { name: 'Resolution', value: '4K Ultra HD', group: 'Display' },
      { name: 'HDR', value: 'HDR10+, Dolby Vision', group: 'Display' }
    ],
    itemDefiningSpecifications: [
      { name: 'Screen Size', group: 'Display Size' }
    ],
    basePrice: 1399.99,
    compareAtPrice: 1599.99,
    taxCode: 'txcd_99999999',
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
    seoTitle: 'Philips OLED806 4K Ambilight TV - Unique Lighting Experience',
    seoDescription: 'Experience unique 3-sided Ambilight technology with Philips OLED806 featuring P5 AI Perfect Picture Engine.'
  },
  {
    id: 'prod_10',
    name: 'Hisense A7G OLED 4K TV',
    slug: 'hisense-a7g-oled-4k-tv',
    description: 'Affordable Hisense OLED TV with Quantum Dot Color and Dolby Vision support',
    shortDescription: 'Affordable Hisense OLED with Quantum Dot',
    categoryId: '111',
    categoryIds: ['1', '11', '111'],
    brand: 'Hisense',
    status: Status.ACTIVE,
    images: [
      { id: 'img1', url: 'https://placehold.co/600x600/e5e7eb/6b7280?text=Hisense%20A7G%20OLED%204K%20TV', altText: 'Hisense A7G OLED TV', type: 'image', order: 1 }
    ],
    features: ['OLED Display', '4K HDR', 'Quantum Dot Color', 'Dolby Vision', 'VIDAA Smart TV'],
    productLevelSpecifications: [
      { name: 'Resolution', value: '4K Ultra HD', group: 'Display' },
      { name: 'HDR', value: 'HDR10, Dolby Vision', group: 'Display' }
    ],
    itemDefiningSpecifications: [
      { name: 'Screen Size', group: 'Display Size' }
    ],
    basePrice: 999.99,
    compareAtPrice: 1199.99,
    taxCode: 'txcd_99999999',
    createdAt: new Date('2024-02-05'),
    updatedAt: new Date('2024-02-05'),
    seoTitle: 'Hisense A7G OLED 4K TV - Affordable OLED Excellence',
    seoDescription: 'Affordable OLED excellence with Hisense A7G featuring Quantum Dot Color and Dolby Vision support.'
  },
  {
    id: 'prod_11',
    name: 'Vizio OLED H1 4K HDR TV',
    slug: 'vizio-oled-h1-4k-hdr-tv',
    description: 'Vizio OLED TV with ProGaming Engine and Variable Refresh Rate for gaming enthusiasts',
    shortDescription: 'Vizio OLED with ProGaming Engine',
    categoryId: '111',
    categoryIds: ['1', '11', '111'],
    brand: 'Vizio',
    status: Status.ACTIVE,
    images: [
      { id: 'img1', url: 'https://placehold.co/600x600/e5e7eb/6b7280?text=Vizio%20OLED%20H1%20TV', altText: 'Vizio OLED H1 TV', type: 'image', order: 1 }
    ],
    features: ['OLED Display', '4K HDR', 'ProGaming Engine', 'Variable Refresh Rate', 'SmartCast'],
    productLevelSpecifications: [
      { name: 'Resolution', value: '4K Ultra HD', group: 'Display' },
      { name: 'HDR', value: 'HDR10, Dolby Vision', group: 'Display' }
    ],
    itemDefiningSpecifications: [
      { name: 'Screen Size', group: 'Display Size' }
    ],
    basePrice: 1699.99,
    compareAtPrice: 1899.99,
    taxCode: 'txcd_99999999',
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-02-10'),
    seoTitle: 'Vizio OLED H1 4K HDR TV - Gaming Excellence',
    seoDescription: 'Gaming excellence with Vizio OLED H1 featuring ProGaming Engine and Variable Refresh Rate technology.'
  },
  {
    id: 'prod_12',
    name: 'Xiaomi TV Master OLED',
    slug: 'xiaomi-tv-master-oled',
    description: 'Xiaomi TV Master OLED with MediaTek MT9650 processor and premium metal design',
    shortDescription: 'Xiaomi OLED with premium metal design',
    categoryId: '111',
    categoryIds: ['1', '11', '111'],
    brand: 'Xiaomi',
    status: Status.ACTIVE,
    images: [
      { id: 'img1', url: 'https://placehold.co/600x600/e5e7eb/6b7280?text=Xiaomi%20TV%20Master%20OLED', altText: 'Xiaomi TV Master OLED', type: 'image', order: 1 }
    ],
    features: ['OLED Display', '4K HDR', 'MediaTek MT9650', 'Premium Metal Design', 'Android TV'],
    productLevelSpecifications: [
      { name: 'Resolution', value: '4K Ultra HD', group: 'Display' },
      { name: 'HDR', value: 'HDR10, Dolby Vision', group: 'Display' }
    ],
    itemDefiningSpecifications: [
      { name: 'Screen Size', group: 'Display Size' }
    ],
    basePrice: 1299.99,
    compareAtPrice: 1499.99,
    taxCode: 'txcd_99999999',
    createdAt: new Date('2024-02-12'),
    updatedAt: new Date('2024-02-12'),
    seoTitle: 'Xiaomi TV Master OLED - Premium Design',
    seoDescription: 'Premium design meets OLED excellence in Xiaomi TV Master with MediaTek MT9650 processor.'
  },

  // QLED TVs (Category ID: '112') - 8 products
  {
    id: 'prod_13',
    name: 'Samsung QN90A Neo QLED 4K Smart TV',
    slug: 'samsung-qn90a-neo-qled-4k',
    description: 'Experience the next generation of QLED with Samsung Neo QLED technology featuring Quantum Mini LEDs for incredible contrast and brightness.',
    shortDescription: 'Neo QLED 4K Smart TV with Quantum Mini LEDs',
    categoryId: '112', // QLED TVs
    categoryIds: ['112', '11', '1'],
    brand: 'Samsung',
    status: 'active' as Status,
    images: [
      { id: 'img-qled-001-1', url: 'https://placehold.co/600x600/e5e7eb/6b7280?text=Samsung%20QN90A%20Neo%20QLED%20TV%20Front', altText: 'Samsung QN90A Neo QLED TV front view', type: 'image' as const, order: 1 }
    ],
    features: ['Neo QLED Technology', 'Quantum Mini LEDs', '4K AI Upscaling', 'Object Tracking Sound+', 'Gaming Hub'],
    productLevelSpecifications: [
      { name: 'Resolution', value: '3840 x 2160 (4K)', group: 'Display' },
      { name: 'HDR', value: 'HDR10+, Quantum HDR', group: 'Display' },
      { name: 'Refresh Rate', value: '120Hz', group: 'Performance' }
    ],
    itemDefiningSpecifications: [
      { name: 'Screen Size', group: 'Display Size' }
    ],
    basePrice: 1799.99,
    taxCode: 'txcd_99999999',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    seoTitle: 'Samsung QN90A Neo QLED 4K Smart TV',
    seoDescription: 'Premium Neo QLED TV with Quantum Mini LEDs and 4K AI upscaling technology.'
  },
  {
    id: 'prod_14',
    name: 'Samsung Q80A QLED 4K Smart TV',
    slug: 'samsung-q80a-qled-4k',
    description: 'Direct Full Array backlighting with Quantum HDR delivers exceptional contrast and color accuracy in this premium QLED display.',
    shortDescription: 'QLED 4K Smart TV with Direct Full Array',
    categoryId: '112', // QLED TVs
    categoryIds: ['112', '11', '1'],
    brand: 'Samsung',
    status: 'active' as Status,
    images: [
      { id: 'img-qled-002-1', url: 'https://placehold.co/600x600/e5e7eb/6b7280?text=Samsung%20Q80A%20QLED%20TV%20Front', altText: 'Samsung Q80A QLED TV front view', type: 'image' as const, order: 1 }
    ],
    features: ['Direct Full Array', 'Quantum HDR', 'Alexa Built-in', 'Motion Xcelerator Turbo+', 'Supreme UHD Dimming'],
    productLevelSpecifications: [
      { name: 'Resolution', value: '3840 x 2160 (4K)', group: 'Display' },
      { name: 'HDR', value: 'HDR10+, Quantum HDR', group: 'Display' },
      { name: 'Refresh Rate', value: '120Hz', group: 'Performance' }
    ],
    itemDefiningSpecifications: [
      { name: 'Screen Size', group: 'Display Size' }
    ],
    basePrice: 1299.99,
    taxCode: 'txcd_99999999',
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-18'),
    seoTitle: 'Samsung Q80A QLED 4K Smart TV',
    seoDescription: 'QLED TV with Direct Full Array backlighting and Quantum HDR technology.'
  },
  {
    id: 'prod_15',
    name: 'TCL 6-Series 65" QLED 4K HDR Smart TV',
    slug: 'tcl-6-series-65-qled-4k-hdr',
    description: 'Mini-LED backlighting with QLED quantum dots delivers stunning contrast and vibrant colors with Dolby Vision HDR support.',
    shortDescription: 'Mini-LED QLED TV with Dolby Vision',
    categoryId: '112', // QLED TVs
    categoryIds: ['112', '11', '1'],
    brand: 'TCL',
    status: 'active' as Status,
    images: [
      { id: 'img-qled-003-1', url: 'https://placehold.co/600x600/e5e7eb/6b7280?text=TCL%206-Series%20QLED%20TV%20Front', altText: 'TCL 6-Series QLED TV front view', type: 'image' as const, order: 1 }
    ],
    features: ['Mini-LED Backlighting', 'QLED Quantum Dots', 'Dolby Vision HDR', 'Variable Refresh Rate', 'Google TV'],
    productLevelSpecifications: [
      { name: 'Screen Size', value: '65 inches', group: 'Display' },
      { name: 'Resolution', value: '3840 x 2160 (4K)', group: 'Display' },
      { name: 'HDR', value: 'Dolby Vision, HDR10+', group: 'Display' },
      { name: 'Refresh Rate', value: '120Hz VRR', group: 'Performance' }
    ],
    basePrice: 999.99,
    taxCode: 'txcd_99999999',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
    seoTitle: 'TCL 6-Series 65" QLED 4K HDR Smart TV',
    seoDescription: 'Mini-LED QLED TV with quantum dots and Dolby Vision HDR technology.'
  },
  {
    id: 'prod_16',
    name: 'Hisense U8G 55" QLED 4K Android TV',
    slug: 'hisense-u8g-55-qled-4k-android',
    description: 'Quantum Dot Wide Color Gamut technology with Full Array Local Dimming delivers exceptional picture quality and gaming performance.',
    shortDescription: 'QLED Android TV with Full Array Local Dimming',
    categoryId: '112', // QLED TVs
    categoryIds: ['112', '11', '1'],
    brand: 'Hisense',
    status: 'active' as Status,
    images: [
      { id: 'img-qled-004-1', url: 'https://placehold.co/600x600/e5e7eb/6b7280?text=Hisense%20U8G%20QLED%20TV%20Front', altText: 'Hisense U8G QLED TV front view', type: 'image' as const, order: 1 }
    ],
    features: ['Quantum Dot Technology', 'Full Array Local Dimming', 'Dolby Vision HDR', 'Game Mode Pro', 'Android TV'],
    productLevelSpecifications: [
      { name: 'Screen Size', value: '55 inches', group: 'Display' },
      { name: 'Resolution', value: '3840 x 2160 (4K)', group: 'Display' },
      { name: 'HDR', value: 'Dolby Vision, HDR10+', group: 'Display' },
      { name: 'Refresh Rate', value: '120Hz', group: 'Performance' }
    ],
    basePrice: 749.99,
    taxCode: 'txcd_99999999',
    createdAt: new Date('2024-01-22'),
    updatedAt: new Date('2024-01-22'),
    seoTitle: 'Hisense U8G 55" QLED 4K Android TV',
    seoDescription: 'QLED Android TV with Quantum Dot technology and Full Array Local Dimming.'
  },

];

// Utility functions
export const getProductsByCategory = (categoryId: string): Product[] => {
  return mockProducts.filter(product => 
    product.categoryId === categoryId || product.categoryIds.includes(categoryId)
  );
};

// New function to get products from multiple categories (for hierarchy support)
export const getProductsByCategoryHierarchy = (categoryIds: string[]): Product[] => {
  if (categoryIds.length === 0) return [];
  
  return mockProducts.filter(product => 
    categoryIds.some(categoryId => 
      product.categoryId === categoryId || product.categoryIds.includes(categoryId)
    )
  );
};

export const getProductBySlug = (slug: string): Product | undefined => {
  return mockProducts.find(product => product.slug === slug);
};

export const getProductById = (id: string): Product | undefined => {
  return mockProducts.find(product => product.id === id);
};

export const searchProducts = (query: string): Product[] => {
  const searchTerm = query.toLowerCase();
  return mockProducts.filter(product =>
    product.name.toLowerCase().includes(searchTerm) ||
    product.description.toLowerCase().includes(searchTerm) ||
    product.brand?.toLowerCase().includes(searchTerm) ||
    product.features.some(feature => feature.toLowerCase().includes(searchTerm)) ||
    // Search in product-level specifications
    product.productLevelSpecifications.some(spec => 
      spec.name.toLowerCase().includes(searchTerm) ||
      spec.value.toLowerCase().includes(searchTerm)
    )
  );
};

export const filterProducts = (filter: ProductFilter): Product[] => {
  return mockProducts.filter(product => {
    if (filter.categoryId && !product.categoryIds.includes(filter.categoryId)) {
      return false;
    }
    if (filter.brand && product.brand !== filter.brand) {
      return false;
    }
    if (filter.minPrice && product.basePrice < filter.minPrice) {
      return false;
    }
    if (filter.maxPrice && product.basePrice > filter.maxPrice) {
      return false;
    }
    if (filter.status && product.status !== filter.status) {
      return false;
    }
    if (filter.search) {
      const searchResults = searchProducts(filter.search);
      return searchResults.some(p => p.id === product.id);
    }
    return true;
  });
};

export const sortProducts = (products: Product[], sort: ProductSort): Product[] => {
  return [...products].sort((a, b) => {
    let aValue: string | number;
    let bValue: string | number;
    
    if (sort.field === 'price') {
      aValue = a.basePrice;
      bValue = b.basePrice;
    } else if (sort.field === 'createdAt' || sort.field === 'updatedAt') {
      aValue = new Date(a[sort.field]).getTime();
      bValue = new Date(b[sort.field]).getTime();
    } else {
      aValue = a[sort.field];
      bValue = b[sort.field];
    }
    
    if (sort.direction === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });
};

// Find product by slug
export const findProductBySlug = (slug: string): Product | undefined => {
  return mockProducts.find(product => product.slug === slug);
};

// Get related products from same category
export const getRelatedProducts = (productId: string, categoryId: string, limit: number = 4): Product[] => {
  return mockProducts
    .filter(p => p.id !== productId && p.categoryIds.includes(categoryId))
    .slice(0, limit);
};

// New helper functions for product-item architecture

/**
 * Get a product with its default item data included
 * This combines product data with default item information for display purposes
 */
export const getProductWithDefaultItem = async (productId: string): Promise<{
  product: Product | undefined;
  defaultItem: import('./item').Item | undefined;
  hasVariants: boolean;
}> => {
  const product = mockProducts.find(p => p.id === productId);
  if (!product) {
    return { product: undefined, defaultItem: undefined, hasVariants: false };
  }

  // Import getDefaultItem and getItemsByProduct when implementing
  // For now, return basic structure
  const { getDefaultItem, getItemsByProduct } = await import('./item');
  const defaultItem = getDefaultItem(productId);
  const allItems = getItemsByProduct(productId);
  
  return {
    product,
    defaultItem,
    hasVariants: allItems.length > 1
  };
};

/**
 * Get products with specification filtering support
 * Enhanced version of filterProducts that works with the new specification structure
 */
export const filterProductsAdvanced = (filter: ProductFilter & {
  specificationFilters?: Record<string, string[]>; // spec name -> allowed values
}): Product[] => {
  return mockProducts.filter(product => {
    // Existing filters
    if (filter.categoryId && !product.categoryIds.includes(filter.categoryId)) {
      return false;
    }
    if (filter.brand && product.brand !== filter.brand) {
      return false;
    }
    if (filter.minPrice && product.basePrice < filter.minPrice) {
      return false;
    }
    if (filter.maxPrice && product.basePrice > filter.maxPrice) {
      return false;
    }
    if (filter.status && product.status !== filter.status) {
      return false;
    }
    if (filter.search) {
      const searchResults = searchProducts(filter.search);
      if (!searchResults.some(p => p.id === product.id)) {
        return false;
      }
    }

    // New specification filters
    if (filter.specificationFilters) {
      return Object.entries(filter.specificationFilters).every(([specName, allowedValues]) => {
        const productSpec = product.productLevelSpecifications.find(s => s.name === specName);
        return productSpec && allowedValues.includes(productSpec.value);
      });
    }

    return true;
  });
};

/**
 * Get all unique specification values across products for filtering UI
 */
export const getProductSpecificationValues = (specName: string, categoryId?: string): string[] => {
  let products = mockProducts;
  
  // Filter by category if specified
  if (categoryId) {
    products = products.filter(p => p.categoryIds.includes(categoryId));
  }

  const values = new Set<string>();
  products.forEach(product => {
    const spec = product.productLevelSpecifications.find(s => s.name === specName);
    if (spec) {
      values.add(spec.value);
    }
  });

  return Array.from(values).sort();
};

/**
 * Get product with comprehensive item information
 * Returns product along with all its items and available specification values
 */
export const getProductDetails = async (productId: string) => {
  const product = mockProducts.find(p => p.id === productId);
  if (!product) return null;

  const { getItemsByProduct, getAvailableSpecificationValues, getDefaultItem } = await import('./item');
  
  const items = getItemsByProduct(productId);
  const defaultItem = getDefaultItem(productId);
  
  // Get available values for each item-defining specification
  const availableSpecificationValues: Record<string, string[]> = {};
  if (product.itemDefiningSpecifications) {
    product.itemDefiningSpecifications.forEach(spec => {
      availableSpecificationValues[spec.name] = getAvailableSpecificationValues(productId, spec.name);
    });
  }

  return {
    product,
    items,
    defaultItem,
    availableSpecificationValues,
    hasVariants: items.length > 1
  };
};
