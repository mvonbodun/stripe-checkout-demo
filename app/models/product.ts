import { BaseModel, SEOFields, Status, MediaItem, Dimensions, Weight, Specification, PriceRange } from './common';

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
  specifications: Specification[];
  
  // Pricing
  basePrice: number;
  compareAtPrice?: number;
  priceRange?: PriceRange; // Computed from variants
  taxCode: string;
  
  // Physical attributes
  weight?: Weight;
  dimensions?: Dimensions;
  
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
    name: 'Samsung 65" OLED 4K Smart TV',
    slug: 'samsung-65-oled-4k-smart-tv',
    description: 'Experience stunning picture quality with this 65-inch OLED 4K Smart TV featuring HDR10+ support, built-in streaming apps, and voice control.',
    shortDescription: 'Premium 65" OLED 4K Smart TV with HDR10+ and streaming apps',
    categoryId: '111', // OLED TVs
    categoryIds: ['111', '11', '1'], // OLED TVs, TVs & Audio, Electronics
    brand: 'Samsung',
    status: Status.ACTIVE,
    images: [
      {
        id: 'img_1',
        url: '/images/products/samsung-oled-tv-front.jpg',
        altText: 'Samsung 65" OLED TV front view',
        order: 1,
        type: 'image'
      },
      {
        id: 'img_2',
        url: '/images/products/samsung-oled-tv-side.jpg',
        altText: 'Samsung 65" OLED TV side view',
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
    specifications: [
      { name: 'Screen Size', value: '65 inches', group: 'Display' },
      { name: 'Resolution', value: '3840 x 2160', group: 'Display' },
      { name: 'Display Type', value: 'OLED', group: 'Display' },
      { name: 'HDR Support', value: 'HDR10+', group: 'Display' },
      { name: 'Smart Platform', value: 'Tizen OS', group: 'Smart Features' },
      { name: 'WiFi', value: '802.11ac', group: 'Connectivity' },
      { name: 'HDMI Ports', value: '4', group: 'Connectivity' }
    ],
    basePrice: 1899.99,
    compareAtPrice: 1999.99,
    taxCode: 'txcd_99999999',
    weight: { value: 55.1, unit: 'lb' },
    dimensions: { length: 57.1, width: 32.7, height: 2.4, unit: 'in' },
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    seoTitle: 'Samsung 65" OLED 4K Smart TV - Premium Display Technology',
    seoDescription: 'Shop the Samsung 65" OLED 4K Smart TV with stunning picture quality, HDR10+ support, and smart features.'
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
        url: '/images/products/macbook-pro-14-space-gray.jpg',
        altText: 'MacBook Pro 14-inch in Space Gray',
        order: 1,
        type: 'image'
      },
      {
        id: 'img_4',
        url: '/images/products/macbook-pro-14-open.jpg',
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
    specifications: [
      { name: 'Processor', value: 'Apple M3 Pro chip', group: 'Performance' },
      { name: 'Display', value: '14.2-inch Liquid Retina XDR', group: 'Display' },
      { name: 'Resolution', value: '3024 x 1964', group: 'Display' },
      { name: 'Memory', value: '18GB unified memory', group: 'Performance' },
      { name: 'Storage', value: '512GB SSD', group: 'Storage' },
      { name: 'Battery Life', value: 'Up to 18 hours', group: 'Power' },
      { name: 'Weight', value: '3.5 pounds', group: 'Physical' }
    ],
    basePrice: 1999.00,
    compareAtPrice: 1999.00,
    taxCode: 'txcd_99999999',
    weight: { value: 3.5, unit: 'lb' },
    dimensions: { length: 12.31, width: 8.71, height: 0.61, unit: 'in' },
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
        url: '/images/products/iphone-15-pro-titanium.jpg',
        altText: 'iPhone 15 Pro in Natural Titanium',
        order: 1,
        type: 'image'
      },
      {
        id: 'img_6',
        url: '/images/products/iphone-15-pro-cameras.jpg',
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
    specifications: [
      { name: 'Processor', value: 'A17 Pro chip', group: 'Performance' },
      { name: 'Display', value: '6.1-inch Super Retina XDR', group: 'Display' },
      { name: 'Storage Options', value: '128GB, 256GB, 512GB, 1TB', group: 'Storage' },
      { name: 'Camera', value: '48MP Main, 12MP Ultra Wide, 12MP Telephoto', group: 'Camera' },
      { name: 'Battery Life', value: 'Up to 23 hours video playback', group: 'Power' },
      { name: 'Connectivity', value: 'USB-C, 5G', group: 'Connectivity' },
      { name: 'Material', value: 'Titanium', group: 'Build' }
    ],
    basePrice: 999.00,
    priceRange: { min: 999, max: 1499 },
    taxCode: 'txcd_99999999',
    weight: { value: 6.60, unit: 'oz' },
    dimensions: { length: 5.77, width: 2.78, height: 0.32, unit: 'in' },
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
        url: '/images/products/sony-wh1000xm5-black.jpg',
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
    specifications: [
      { name: 'Driver Unit', value: '30mm', group: 'Audio' },
      { name: 'Frequency Response', value: '4Hz-40,000Hz', group: 'Audio' },
      { name: 'Battery Life', value: '30 hours (NC ON)', group: 'Power' },
      { name: 'Charging Time', value: '3.5 hours', group: 'Power' },
      { name: 'Weight', value: '250g', group: 'Physical' },
      { name: 'Connectivity', value: 'Bluetooth 5.2, NFC', group: 'Connectivity' }
    ],
    basePrice: 399.99,
    compareAtPrice: 449.99,
    taxCode: 'txcd_99999999',
    weight: { value: 8.8, unit: 'oz' },
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
        url: '/images/products/levis-501-dark-wash.jpg',
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
    specifications: [
      { name: 'Fit', value: 'Straight', group: 'Style' },
      { name: 'Material', value: '100% Cotton', group: 'Fabric' },
      { name: 'Closure', value: 'Button fly', group: 'Details' },
      { name: 'Rise', value: 'Mid rise', group: 'Fit' },
      { name: 'Leg Opening', value: '16.5 inches', group: 'Measurements' },
      { name: 'Care', value: 'Machine wash cold', group: 'Care' }
    ],
    basePrice: 59.50,
    compareAtPrice: 68.00,
    taxCode: 'txcd_99999999',
    weight: { value: 1.5, unit: 'lb' },
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-02-15'),
    seoTitle: 'Levi\'s 501 Original Jeans - Classic Straight Fit',
    seoDescription: 'Shop the iconic Levi\'s 501 Original jeans in classic straight fit. The original blue jean since 1873.'
  },

  // Additional OLED TVs (7 more to make 8 total in category '111')
  {
    id: 'prod-oled-tv-2',
    name: 'Sony A90J 65" OLED 4K HDR TV',
    slug: 'sony-a90j-65-oled-4k-hdr-tv',
    description: 'Premium Sony OLED TV with XR OLED Contrast Pro and Acoustic Surface Audio+',
    shortDescription: 'Premium Sony OLED with XR processor',
    categoryId: '111',
    categoryIds: ['1', '11', '111'],
    brand: 'Sony',
    status: Status.ACTIVE,
    images: [
      { id: 'img1', url: '/images/products/sony-a90j-oled.jpg', altText: 'Sony A90J OLED TV', type: 'image', order: 1 }
    ],
    features: ['65" OLED Display', '4K HDR', 'XR OLED Contrast Pro', 'Acoustic Surface Audio+', 'Google TV'],
    specifications: [
      { name: 'Screen Size', value: '65 inches', group: 'Display' },
      { name: 'Resolution', value: '4K Ultra HD', group: 'Display' },
      { name: 'HDR', value: 'HDR10, Dolby Vision', group: 'Display' }
    ],
    basePrice: 1899.99,
    compareAtPrice: 1999.99,
    taxCode: 'txcd_99999999',
    weight: { value: 55, unit: 'lb' },
    dimensions: { length: 57.25, width: 33, height: 14.375, unit: 'in' },
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    seoTitle: 'Sony A90J 65" OLED 4K HDR TV - Premium Picture Quality',
    seoDescription: 'Experience premium picture quality with Sony A90J OLED TV featuring XR processor and Acoustic Surface Audio+.'
  },
  {
    id: 'prod-oled-tv-3',
    name: 'Samsung S95B 55" QD-OLED 4K TV',
    slug: 'samsung-s95b-55-qd-oled-4k-tv',
    description: 'Samsung Quantum Dot OLED TV with Neural Quantum Processor 4K and ultra-slim design',
    shortDescription: 'Samsung QD-OLED with Quantum HDR',
    categoryId: '111',
    categoryIds: ['1', '11', '111'],
    brand: 'Samsung',
    status: Status.ACTIVE,
    images: [
      { id: 'img1', url: '/images/products/samsung-s95b-oled.jpg', altText: 'Samsung S95B QD-OLED TV', type: 'image', order: 1 }
    ],
    features: ['55" QD-OLED Display', '4K HDR', 'Neural Quantum Processor 4K', 'Quantum HDR OLED', 'Tizen Smart TV'],
    specifications: [
      { name: 'Screen Size', value: '55 inches', group: 'Display' },
      { name: 'Resolution', value: '4K Ultra HD', group: 'Display' },
      { name: 'HDR', value: 'HDR10+, Quantum HDR OLED', group: 'Display' }
    ],
    basePrice: 1799.99,
    compareAtPrice: 1999.99,
    taxCode: 'txcd_99999999',
    weight: { value: 45, unit: 'lb' },
    dimensions: { length: 48.4, width: 27.8, height: 11.2, unit: 'in' },
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
    seoTitle: 'Samsung S95B 55" QD-OLED 4K TV - Quantum Dot OLED',
    seoDescription: 'Samsung S95B QD-OLED TV with Neural Quantum Processor 4K and stunning Quantum HDR OLED technology.'
  },
  {
    id: 'prod-oled-tv-4',
    name: 'Panasonic JZ2000 77" OLED 4K TV',
    slug: 'panasonic-jz2000-77-oled-4k-tv',
    description: 'Professional-grade Panasonic OLED TV with HCX Pro AI Processor and Dolby Vision IQ',
    shortDescription: 'Professional Panasonic OLED with HCX Pro AI',
    categoryId: '111',
    categoryIds: ['1', '11', '111'],
    brand: 'Panasonic',
    status: Status.ACTIVE,
    images: [
      { id: 'img1', url: '/images/products/panasonic-jz2000-oled.jpg', altText: 'Panasonic JZ2000 OLED TV', type: 'image', order: 1 }
    ],
    features: ['77" OLED Display', '4K HDR', 'HCX Pro AI Processor', 'Dolby Vision IQ', 'My Home Screen'],
    specifications: [
      { name: 'Screen Size', value: '77 inches', group: 'Display' },
      { name: 'Resolution', value: '4K Ultra HD', group: 'Display' },
      { name: 'HDR', value: 'HDR10+, Dolby Vision IQ', group: 'Display' }
    ],
    basePrice: 1999.99,
    compareAtPrice: 1999.99,
    taxCode: 'txcd_99999999',
    weight: { value: 75, unit: 'lb' },
    dimensions: { length: 68.1, width: 39.1, height: 15.7, unit: 'in' },
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-01-25'),
    seoTitle: 'Panasonic JZ2000 77" OLED 4K TV - Professional Grade',
    seoDescription: 'Professional-grade Panasonic JZ2000 OLED TV with HCX Pro AI Processor and Dolby Vision IQ.'
  },
  {
    id: 'prod-oled-tv-5',
    name: 'Philips OLED806 48" 4K Ambilight TV',
    slug: 'philips-oled806-48-4k-ambilight-tv',
    description: 'Philips OLED TV with unique 3-sided Ambilight technology and P5 AI Perfect Picture Engine',
    shortDescription: 'Philips OLED with 3-sided Ambilight',
    categoryId: '111',
    categoryIds: ['1', '11', '111'],
    brand: 'Philips',
    status: Status.ACTIVE,
    images: [
      { id: 'img1', url: '/images/products/philips-oled806-ambilight.jpg', altText: 'Philips OLED806 Ambilight TV', type: 'image', order: 1 }
    ],
    features: ['48" OLED Display', '4K HDR', '3-sided Ambilight', 'P5 AI Perfect Picture', 'Android TV'],
    specifications: [
      { name: 'Screen Size', value: '48 inches', group: 'Display' },
      { name: 'Resolution', value: '4K Ultra HD', group: 'Display' },
      { name: 'HDR', value: 'HDR10+, Dolby Vision', group: 'Display' }
    ],
    basePrice: 1399.99,
    compareAtPrice: 1599.99,
    taxCode: 'txcd_99999999',
    weight: { value: 38, unit: 'lb' },
    dimensions: { length: 42.6, width: 24.6, height: 10.2, unit: 'in' },
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
    seoTitle: 'Philips OLED806 48" 4K Ambilight TV - Unique Lighting Experience',
    seoDescription: 'Experience unique 3-sided Ambilight technology with Philips OLED806 featuring P5 AI Perfect Picture Engine.'
  },
  {
    id: 'prod-oled-tv-6',
    name: 'Hisense A7G 50" OLED 4K TV',
    slug: 'hisense-a7g-50-oled-4k-tv',
    description: 'Affordable Hisense OLED TV with Quantum Dot Color and Dolby Vision support',
    shortDescription: 'Affordable Hisense OLED with Quantum Dot',
    categoryId: '111',
    categoryIds: ['1', '11', '111'],
    brand: 'Hisense',
    status: Status.ACTIVE,
    images: [
      { id: 'img1', url: '/images/products/hisense-a7g-oled.jpg', altText: 'Hisense A7G OLED TV', type: 'image', order: 1 }
    ],
    features: ['50" OLED Display', '4K HDR', 'Quantum Dot Color', 'Dolby Vision', 'VIDAA Smart TV'],
    specifications: [
      { name: 'Screen Size', value: '50 inches', group: 'Display' },
      { name: 'Resolution', value: '4K Ultra HD', group: 'Display' },
      { name: 'HDR', value: 'HDR10, Dolby Vision', group: 'Display' }
    ],
    basePrice: 999.99,
    compareAtPrice: 1199.99,
    taxCode: 'txcd_99999999',
    weight: { value: 42, unit: 'lb' },
    dimensions: { length: 44.1, width: 25.4, height: 11.8, unit: 'in' },
    createdAt: new Date('2024-02-05'),
    updatedAt: new Date('2024-02-05'),
    seoTitle: 'Hisense A7G 50" OLED 4K TV - Affordable OLED Excellence',
    seoDescription: 'Affordable OLED excellence with Hisense A7G featuring Quantum Dot Color and Dolby Vision support.'
  },
  {
    id: 'prod-oled-tv-7',
    name: 'Vizio OLED H1 65" 4K HDR TV',
    slug: 'vizio-oled-h1-65-4k-hdr-tv',
    description: 'Vizio OLED TV with ProGaming Engine and Variable Refresh Rate for gaming enthusiasts',
    shortDescription: 'Vizio OLED with ProGaming Engine',
    categoryId: '111',
    categoryIds: ['1', '11', '111'],
    brand: 'Vizio',
    status: Status.ACTIVE,
    images: [
      { id: 'img1', url: '/images/products/vizio-oled-h1.jpg', altText: 'Vizio OLED H1 TV', type: 'image', order: 1 }
    ],
    features: ['65" OLED Display', '4K HDR', 'ProGaming Engine', 'Variable Refresh Rate', 'SmartCast'],
    specifications: [
      { name: 'Screen Size', value: '65 inches', group: 'Display' },
      { name: 'Resolution', value: '4K Ultra HD', group: 'Display' },
      { name: 'HDR', value: 'HDR10, Dolby Vision', group: 'Display' }
    ],
    basePrice: 1699.99,
    compareAtPrice: 1899.99,
    taxCode: 'txcd_99999999',
    weight: { value: 52, unit: 'lb' },
    dimensions: { length: 57.1, width: 32.7, height: 13.4, unit: 'in' },
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-02-10'),
    seoTitle: 'Vizio OLED H1 65" 4K HDR TV - Gaming Excellence',
    seoDescription: 'Gaming excellence with Vizio OLED H1 featuring ProGaming Engine and Variable Refresh Rate technology.'
  },
  {
    id: 'prod-oled-tv-8',
    name: 'Xiaomi TV Master 55" OLED',
    slug: 'xiaomi-tv-master-55-oled',
    description: 'Xiaomi TV Master OLED with MediaTek MT9650 processor and premium metal design',
    shortDescription: 'Xiaomi OLED with premium metal design',
    categoryId: '111',
    categoryIds: ['1', '11', '111'],
    brand: 'Xiaomi',
    status: Status.ACTIVE,
    images: [
      { id: 'img1', url: '/images/products/xiaomi-tv-master-oled.jpg', altText: 'Xiaomi TV Master OLED', type: 'image', order: 1 }
    ],
    features: ['55" OLED Display', '4K HDR', 'MediaTek MT9650', 'Premium Metal Design', 'Android TV'],
    specifications: [
      { name: 'Screen Size', value: '55 inches', group: 'Display' },
      { name: 'Resolution', value: '4K Ultra HD', group: 'Display' },
      { name: 'HDR', value: 'HDR10, Dolby Vision', group: 'Display' }
    ],
    basePrice: 1299.99,
    compareAtPrice: 1499.99,
    taxCode: 'txcd_99999999',
    weight: { value: 46, unit: 'lb' },
    dimensions: { length: 48.7, width: 28.1, height: 11.6, unit: 'in' },
    createdAt: new Date('2024-02-12'),
    updatedAt: new Date('2024-02-12'),
    seoTitle: 'Xiaomi TV Master 55" OLED - Premium Design',
    seoDescription: 'Premium design meets OLED excellence in Xiaomi TV Master with MediaTek MT9650 processor.'
  },

  // QLED TVs (Category ID: '112') - 8 products
  {
    id: 'qled-001',
    name: 'Samsung QN90A 65" Neo QLED 4K Smart TV',
    slug: 'samsung-qn90a-65-neo-qled-4k',
    description: 'Experience the next generation of QLED with Samsung Neo QLED technology featuring Quantum Mini LEDs for incredible contrast and brightness.',
    shortDescription: 'Neo QLED 4K Smart TV with Quantum Mini LEDs',
    categoryId: '112', // QLED TVs
    categoryIds: ['112', '11', '1'],
    brand: 'Samsung',
    status: 'active' as Status,
    images: [
      { id: 'img-qled-001-1', url: '/images/samsung-qn90a-front.jpg', altText: 'Samsung QN90A Neo QLED TV front view', type: 'image' as const, order: 1 }
    ],
    features: ['Neo QLED Technology', 'Quantum Mini LEDs', '4K AI Upscaling', 'Object Tracking Sound+', 'Gaming Hub'],
    specifications: [
      { name: 'Screen Size', value: '65 inches', group: 'Display' },
      { name: 'Resolution', value: '3840 x 2160 (4K)', group: 'Display' },
      { name: 'HDR', value: 'HDR10+, Quantum HDR', group: 'Display' },
      { name: 'Refresh Rate', value: '120Hz', group: 'Performance' }
    ],
    basePrice: 1799.99,
    taxCode: 'txcd_99999999',
    weight: { value: 58.4, unit: 'lb' },
    dimensions: { length: 57.1, width: 32.7, height: 13.0, unit: 'in' },
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    seoTitle: 'Samsung QN90A 65" Neo QLED 4K Smart TV',
    seoDescription: 'Premium Neo QLED TV with Quantum Mini LEDs and 4K AI upscaling technology.'
  },
  {
    id: 'qled-002',
    name: 'Samsung Q80A 55" QLED 4K Smart TV',
    slug: 'samsung-q80a-55-qled-4k',
    description: 'Direct Full Array backlighting with Quantum HDR delivers exceptional contrast and color accuracy in this premium QLED display.',
    shortDescription: 'QLED 4K Smart TV with Direct Full Array',
    categoryId: '112', // QLED TVs
    categoryIds: ['112', '11', '1'],
    brand: 'Samsung',
    status: 'active' as Status,
    images: [
      { id: 'img-qled-002-1', url: '/images/samsung-q80a-front.jpg', altText: 'Samsung Q80A QLED TV front view', type: 'image' as const, order: 1 }
    ],
    features: ['Direct Full Array', 'Quantum HDR', 'Alexa Built-in', 'Motion Xcelerator Turbo+', 'Supreme UHD Dimming'],
    specifications: [
      { name: 'Screen Size', value: '55 inches', group: 'Display' },
      { name: 'Resolution', value: '3840 x 2160 (4K)', group: 'Display' },
      { name: 'HDR', value: 'HDR10+, Quantum HDR', group: 'Display' },
      { name: 'Refresh Rate', value: '120Hz', group: 'Performance' }
    ],
    basePrice: 1299.99,
    taxCode: 'txcd_99999999',
    weight: { value: 48.5, unit: 'lb' },
    dimensions: { length: 48.4, width: 27.8, height: 11.2, unit: 'in' },
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-18'),
    seoTitle: 'Samsung Q80A 55" QLED 4K Smart TV',
    seoDescription: 'QLED TV with Direct Full Array backlighting and Quantum HDR technology.'
  },
  {
    id: 'qled-003',
    name: 'TCL 6-Series 65" QLED 4K HDR Smart TV',
    slug: 'tcl-6-series-65-qled-4k-hdr',
    description: 'Mini-LED backlighting with QLED quantum dots delivers stunning contrast and vibrant colors with Dolby Vision HDR support.',
    shortDescription: 'Mini-LED QLED TV with Dolby Vision',
    categoryId: '112', // QLED TVs
    categoryIds: ['112', '11', '1'],
    brand: 'TCL',
    status: 'active' as Status,
    images: [
      { id: 'img-qled-003-1', url: '/images/tcl-6-series-front.jpg', altText: 'TCL 6-Series QLED TV front view', type: 'image' as const, order: 1 }
    ],
    features: ['Mini-LED Backlighting', 'QLED Quantum Dots', 'Dolby Vision HDR', 'Variable Refresh Rate', 'Google TV'],
    specifications: [
      { name: 'Screen Size', value: '65 inches', group: 'Display' },
      { name: 'Resolution', value: '3840 x 2160 (4K)', group: 'Display' },
      { name: 'HDR', value: 'Dolby Vision, HDR10+', group: 'Display' },
      { name: 'Refresh Rate', value: '120Hz VRR', group: 'Performance' }
    ],
    basePrice: 999.99,
    taxCode: 'txcd_99999999',
    weight: { value: 52.9, unit: 'lb' },
    dimensions: { length: 57.0, width: 32.9, height: 13.2, unit: 'in' },
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
    seoTitle: 'TCL 6-Series 65" QLED 4K HDR Smart TV',
    seoDescription: 'Mini-LED QLED TV with quantum dots and Dolby Vision HDR technology.'
  },
  {
    id: 'qled-004',
    name: 'Hisense U8G 55" QLED 4K Android TV',
    slug: 'hisense-u8g-55-qled-4k-android',
    description: 'Quantum Dot Wide Color Gamut technology with Full Array Local Dimming delivers exceptional picture quality and gaming performance.',
    shortDescription: 'QLED Android TV with Full Array Local Dimming',
    categoryId: '112', // QLED TVs
    categoryIds: ['112', '11', '1'],
    brand: 'Hisense',
    status: 'active' as Status,
    images: [
      { id: 'img-qled-004-1', url: '/images/hisense-u8g-front.jpg', altText: 'Hisense U8G QLED TV front view', type: 'image' as const, order: 1 }
    ],
    features: ['Quantum Dot Technology', 'Full Array Local Dimming', 'Dolby Vision HDR', 'Game Mode Pro', 'Android TV'],
    specifications: [
      { name: 'Screen Size', value: '55 inches', group: 'Display' },
      { name: 'Resolution', value: '3840 x 2160 (4K)', group: 'Display' },
      { name: 'HDR', value: 'Dolby Vision, HDR10+', group: 'Display' },
      { name: 'Refresh Rate', value: '120Hz', group: 'Performance' }
    ],
    basePrice: 749.99,
    taxCode: 'txcd_99999999',
    weight: { value: 46.7, unit: 'lb' },
    dimensions: { length: 48.4, width: 28.0, height: 11.8, unit: 'in' },
    createdAt: new Date('2024-01-22'),
    updatedAt: new Date('2024-01-22'),
    seoTitle: 'Hisense U8G 55" QLED 4K Android TV',
    seoDescription: 'QLED Android TV with Quantum Dot technology and Full Array Local Dimming.'
  },
  {
    id: 'qled-005',
    name: 'Sony X95J 75" QLED 4K Google TV',
    slug: 'sony-x95j-75-qled-4k-google',
    description: 'Full Array LED with XR Triluminos Pro delivers wide color gamut and precise contrast control for cinematic viewing experience.',
    shortDescription: 'Premium QLED Google TV with XR Triluminos Pro',
    categoryId: '112', // QLED TVs
    categoryIds: ['112', '11', '1'],
    brand: 'Sony',
    status: 'active' as Status,
    images: [
      { id: 'img-qled-005-1', url: '/images/sony-x95j-front.jpg', altText: 'Sony X95J QLED TV front view', type: 'image' as const, order: 1 }
    ],
    features: ['XR Triluminos Pro', 'Full Array LED', 'Cognitive Processor XR', 'Acoustic Multi-Audio', 'Google TV'],
    specifications: [
      { name: 'Screen Size', value: '75 inches', group: 'Display' },
      { name: 'Resolution', value: '3840 x 2160 (4K)', group: 'Display' },
      { name: 'HDR', value: 'Dolby Vision, HDR10', group: 'Display' },
      { name: 'Refresh Rate', value: '120Hz', group: 'Performance' }
    ],
    basePrice: 1999.99,
    taxCode: 'txcd_99999999',
    weight: { value: 83.6, unit: 'lb' },
    dimensions: { length: 65.9, width: 37.9, height: 15.4, unit: 'in' },
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-01-25'),
    seoTitle: 'Sony X95J 75" QLED 4K Google TV',
    seoDescription: 'Premium QLED TV with XR Triluminos Pro and Cognitive Processor XR technology.'
  },
  {
    id: 'qled-006',
    name: 'Samsung QN85A 70" Neo QLED 4K Smart TV',
    slug: 'samsung-qn85a-70-neo-qled-4k',
    description: 'Neo Quantum Processor 4K with Anti-Glare technology provides exceptional viewing in any lighting condition.',
    shortDescription: 'Neo QLED TV with Anti-Glare technology',
    categoryId: '112', // QLED TVs
    categoryIds: ['112', '11', '1'],
    brand: 'Samsung',
    status: 'active' as Status,
    images: [
      { id: 'img-qled-006-1', url: '/images/samsung-qn85a-front.jpg', altText: 'Samsung QN85A Neo QLED TV front view', type: 'image' as const, order: 1 }
    ],
    features: ['Neo Quantum Processor 4K', 'Anti-Glare Technology', 'Quantum HDR', 'SpaceFit Sound', 'Smart TV Hub'],
    specifications: [
      { name: 'Screen Size', value: '70 inches', group: 'Display' },
      { name: 'Resolution', value: '3840 x 2160 (4K)', group: 'Display' },
      { name: 'HDR', value: 'HDR10+, Quantum HDR', group: 'Display' },
      { name: 'Refresh Rate', value: '120Hz', group: 'Performance' }
    ],
    basePrice: 1999.99,
    taxCode: 'txcd_99999999',
    weight: { value: 72.1, unit: 'lb' },
    dimensions: { length: 61.9, width: 35.4, height: 14.1, unit: 'in' },
    createdAt: new Date('2024-01-28'),
    updatedAt: new Date('2024-01-28'),
    seoTitle: 'Samsung QN85A 70" Neo QLED 4K Smart TV',
    seoDescription: 'Neo QLED TV with Anti-Glare technology and Neo Quantum Processor 4K.'
  },
  {
    id: 'qled-007',
    name: 'LG QNED90UP 65" QLED NanoCell 4K TV',
    slug: 'lg-qned90up-65-qled-nanocell-4k',
    description: 'Quantum Dot NanoCell technology with Mini LED backlighting delivers pure colors and exceptional brightness.',
    shortDescription: 'QLED NanoCell TV with Mini LED',
    categoryId: '112', // QLED TVs
    categoryIds: ['112', '11', '1'],
    brand: 'LG',
    status: 'active' as Status,
    images: [
      { id: 'img-qled-007-1', url: '/images/lg-qned90up-front.jpg', altText: 'LG QNED90UP TV front view', type: 'image' as const, order: 1 }
    ],
    features: ['Quantum Dot NanoCell', 'Mini LED Backlighting', 'α7 Gen4 AI Processor', 'Dolby Vision IQ', 'webOS Smart TV'],
    specifications: [
      { name: 'Screen Size', value: '65 inches', group: 'Display' },
      { name: 'Resolution', value: '3840 x 2160 (4K)', group: 'Display' },
      { name: 'HDR', value: 'Dolby Vision IQ, HDR10 Pro', group: 'Display' },
      { name: 'Refresh Rate', value: '120Hz', group: 'Performance' }
    ],
    basePrice: 1499.99,
    taxCode: 'txcd_99999999',
    weight: { value: 55.8, unit: 'lb' },
    dimensions: { length: 57.2, width: 32.9, height: 12.9, unit: 'in' },
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
    seoTitle: 'LG QNED90UP 65" QLED NanoCell 4K TV',
    seoDescription: 'QLED NanoCell TV with Quantum Dot technology and Mini LED backlighting.'
  },
  {
    id: 'qled-008',
    name: 'Vizio P-Series Quantum X 85" 4K HDR Smart TV',
    slug: 'vizio-p-series-quantum-x-85-4k-hdr',
    description: 'Ultra Bright 3000 nits with Quantum Color delivers the ultimate HDR experience with Full Array backlighting.',
    shortDescription: 'Ultra Bright QLED TV with 3000 nits',
    categoryId: '112', // QLED TVs
    categoryIds: ['112', '11', '1'],
    brand: 'Vizio',
    status: 'active' as Status,
    images: [
      { id: 'img-qled-008-1', url: '/images/vizio-p-series-quantum-x-front.jpg', altText: 'Vizio P-Series Quantum X TV front view', type: 'image' as const, order: 1 }
    ],
    features: ['Ultra Bright 3000 nits', 'Quantum Color', 'Full Array LED', 'Variable Refresh Rate', 'SmartCast TV'],
    specifications: [
      { name: 'Screen Size', value: '85 inches', group: 'Display' },
      { name: 'Resolution', value: '3840 x 2160 (4K)', group: 'Display' },
      { name: 'HDR', value: 'Dolby Vision, HDR10+', group: 'Display' },
      { name: 'Refresh Rate', value: '120Hz VRR', group: 'Performance' }
    ],
    basePrice: 1899.99,
    taxCode: 'txcd_99999999',
    weight: { value: 108.5, unit: 'lb' },
    dimensions: { length: 74.8, width: 42.9, height: 16.8, unit: 'in' },
    createdAt: new Date('2024-02-05'),
    updatedAt: new Date('2024-02-05'),
    seoTitle: 'Vizio P-Series Quantum X 85" 4K HDR Smart TV',
    seoDescription: 'Ultra-bright QLED TV with 3000 nits brightness and Quantum Color technology.'
  },

  // Soundbars (Category ID: '113') - 8 products
  {
    id: 'soundbar-001',
    name: 'Samsung HW-Q950A 11.1.4ch Soundbar with Dolby Atmos',
    slug: 'samsung-hw-q950a-11-1-4ch-soundbar-dolby-atmos',
    description: 'Premium 11.1.4 channel soundbar with wireless rear speakers delivers immersive Dolby Atmos and DTS:X surround sound experience.',
    shortDescription: '11.1.4ch Soundbar with Dolby Atmos and rear speakers',
    categoryId: '113', // Soundbars
    categoryIds: ['113', '11', '1'],
    brand: 'Samsung',
    status: 'active' as Status,
    images: [
      { id: 'img-soundbar-001-1', url: '/images/samsung-hw-q950a-front.jpg', altText: 'Samsung HW-Q950A Soundbar system', type: 'image' as const, order: 1 }
    ],
    features: ['11.1.4 Channel Audio', 'Dolby Atmos & DTS:X', 'Wireless Rear Speakers', 'SpaceFit Sound', 'Q-Symphony'],
    specifications: [
      { name: 'Channels', value: '11.1.4', group: 'Audio' },
      { name: 'Total Power', value: '616W', group: 'Audio' },
      { name: 'Subwoofer', value: 'Wireless 8" Subwoofer', group: 'Audio' },
      { name: 'Connectivity', value: 'HDMI eARC, Bluetooth, Wi-Fi', group: 'Connectivity' }
    ],
    basePrice: 1499.99,
    taxCode: 'txcd_99999999',
    weight: { value: 32.4, unit: 'lb' },
    dimensions: { length: 48.5, width: 5.4, height: 2.3, unit: 'in' },
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
    seoTitle: 'Samsung HW-Q950A 11.1.4ch Soundbar with Dolby Atmos',
    seoDescription: 'Premium soundbar system with 11.1.4 channels, Dolby Atmos, and wireless rear speakers.'
  },
  {
    id: 'soundbar-002',
    name: 'Sonos Arc Premium Smart Soundbar',
    slug: 'sonos-arc-premium-smart-soundbar',
    description: 'Dolby Atmos soundbar with eleven high-performance drivers creates wide, tall soundstage that fills the room.',
    shortDescription: 'Premium Smart Soundbar with Dolby Atmos',
    categoryId: '113', // Soundbars
    categoryIds: ['113', '11', '1'],
    brand: 'Sonos',
    status: 'active' as Status,
    images: [
      { id: 'img-soundbar-002-1', url: '/images/sonos-arc-front.jpg', altText: 'Sonos Arc Premium Soundbar', type: 'image' as const, order: 1 }
    ],
    features: ['Dolby Atmos', '11 High-Performance Drivers', 'Voice Control', 'Trueplay Tuning', 'AirPlay 2'],
    specifications: [
      { name: 'Channels', value: '5.0.2', group: 'Audio' },
      { name: 'Drivers', value: '11 Class-D Digital Amplifiers', group: 'Audio' },
      { name: 'Voice Control', value: 'Amazon Alexa, Google Assistant', group: 'Smart Features' },
      { name: 'Connectivity', value: 'HDMI eARC, Wi-Fi, Ethernet', group: 'Connectivity' }
    ],
    basePrice: 899.99,
    taxCode: 'txcd_99999999',
    weight: { value: 13.78, unit: 'lb' },
    dimensions: { length: 45.0, width: 4.5, height: 3.4, unit: 'in' },
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-12'),
    seoTitle: 'Sonos Arc Premium Smart Soundbar',
    seoDescription: 'Premium Dolby Atmos soundbar with 11 drivers and smart home integration.'
  },
  {
    id: 'soundbar-003',
    name: 'Bose Soundbar 900 with Dolby Atmos',
    slug: 'bose-soundbar-900-dolby-atmos',
    description: 'Immersive soundbar with proprietary PhaseGuide technology creates spacious sound that goes beyond traditional soundbars.',
    shortDescription: 'Dolby Atmos Soundbar with PhaseGuide technology',
    categoryId: '113', // Soundbars
    categoryIds: ['113', '11', '1'],
    brand: 'Bose',
    status: 'active' as Status,
    images: [
      { id: 'img-soundbar-003-1', url: '/images/bose-soundbar-900-front.jpg', altText: 'Bose Soundbar 900 with Dolby Atmos', type: 'image' as const, order: 1 }
    ],
    features: ['Dolby Atmos & DTS:X', 'PhaseGuide Technology', 'Voice4Video Technology', 'ADAPTiQ Audio Calibration', 'Voice Control'],
    specifications: [
      { name: 'Channels', value: '5.1.2', group: 'Audio' },
      { name: 'Drivers', value: '9 Speakers including 2 Upfiring', group: 'Audio' },
      { name: 'Voice Control', value: 'Amazon Alexa, Google Assistant', group: 'Smart Features' },
      { name: 'Connectivity', value: 'HDMI eARC, Wi-Fi, Bluetooth', group: 'Connectivity' }
    ],
    basePrice: 949.99,
    taxCode: 'txcd_99999999',
    weight: { value: 12.5, unit: 'lb' },
    dimensions: { length: 41.1, width: 4.21, height: 2.29, unit: 'in' },
    createdAt: new Date('2024-01-14'),
    updatedAt: new Date('2024-01-14'),
    seoTitle: 'Bose Soundbar 900 with Dolby Atmos',
    seoDescription: 'Premium soundbar with PhaseGuide technology and immersive Dolby Atmos audio.'
  },
  {
    id: 'soundbar-004',
    name: 'JBL Bar 9.1 True Wireless Surround Soundbar',
    slug: 'jbl-bar-9-1-true-wireless-surround-soundbar',
    description: 'Revolutionary soundbar with detachable wireless surround speakers and 10" wireless subwoofer for true 9.1 surround sound.',
    shortDescription: 'True Wireless 9.1 Surround Soundbar',
    categoryId: '113', // Soundbars
    categoryIds: ['113', '11', '1'],
    brand: 'JBL',
    status: 'active' as Status,
    images: [
      { id: 'img-soundbar-004-1', url: '/images/jbl-bar-9-1-front.jpg', altText: 'JBL Bar 9.1 True Wireless Surround Soundbar', type: 'image' as const, order: 1 }
    ],
    features: ['Detachable Wireless Surround', '9.1 Channel Audio', 'Dolby Atmos & DTS:X', '10" Wireless Subwoofer', 'Chromecast Built-in'],
    specifications: [
      { name: 'Channels', value: '9.1', group: 'Audio' },
      { name: 'Total Power', value: '820W', group: 'Audio' },
      { name: 'Subwoofer', value: '10" Wireless Subwoofer', group: 'Audio' },
      { name: 'Connectivity', value: 'HDMI eARC, Bluetooth, Wi-Fi', group: 'Connectivity' }
    ],
    basePrice: 1199.99,
    taxCode: 'txcd_99999999',
    weight: { value: 28.7, unit: 'lb' },
    dimensions: { length: 48.0, width: 5.1, height: 2.4, unit: 'in' },
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-16'),
    seoTitle: 'JBL Bar 9.1 True Wireless Surround Soundbar',
    seoDescription: 'Revolutionary soundbar with detachable wireless surround speakers and true 9.1 audio.'
  },
  {
    id: 'soundbar-005',
    name: 'Sony HT-A7000 7.1.2ch Dolby Atmos Soundbar',
    slug: 'sony-ht-a7000-7-1-2ch-dolby-atmos-soundbar',
    description: 'Premium soundbar with 360 Spatial Sound Mapping and built-in dual subwoofers for powerful, immersive audio experience.',
    shortDescription: '7.1.2ch Dolby Atmos Soundbar with 360 Spatial Sound',
    categoryId: '113', // Soundbars
    categoryIds: ['113', '11', '1'],
    brand: 'Sony',
    status: 'active' as Status,
    images: [
      { id: 'img-soundbar-005-1', url: '/images/sony-ht-a7000-front.jpg', altText: 'Sony HT-A7000 Dolby Atmos Soundbar', type: 'image' as const, order: 1 }
    ],
    features: ['360 Spatial Sound Mapping', '7.1.2 Channel Audio', 'Built-in Dual Subwoofers', 'Acoustic Center Sync', 'Voice Enhancement'],
    specifications: [
      { name: 'Channels', value: '7.1.2', group: 'Audio' },
      { name: 'Total Power', value: '500W', group: 'Audio' },
      { name: 'Subwoofers', value: 'Built-in Dual Subwoofers', group: 'Audio' },
      { name: 'Connectivity', value: 'HDMI eARC, Bluetooth, Wi-Fi', group: 'Connectivity' }
    ],
    basePrice: 1299.99,
    taxCode: 'txcd_99999999',
    weight: { value: 18.7, unit: 'lb' },
    dimensions: { length: 51.1, width: 5.6, height: 2.7, unit: 'in' },
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-18'),
    seoTitle: 'Sony HT-A7000 7.1.2ch Dolby Atmos Soundbar',
    seoDescription: 'Premium soundbar with 360 Spatial Sound Mapping and built-in dual subwoofers.'
  },
  {
    id: 'soundbar-006',
    name: 'LG SP11RA 7.1.4 AI Sound Pro Soundbar',
    slug: 'lg-sp11ra-7-1-4-ai-sound-pro-soundbar',
    description: 'AI Sound Pro technology automatically optimizes audio based on content while Meridian Audio delivers audiophile-quality sound.',
    shortDescription: '7.1.4 AI Sound Pro Soundbar with Meridian Audio',
    categoryId: '113', // Soundbars
    categoryIds: ['113', '11', '1'],
    brand: 'LG',
    status: 'active' as Status,
    images: [
      { id: 'img-soundbar-006-1', url: '/images/lg-sp11ra-front.jpg', altText: 'LG SP11RA AI Sound Pro Soundbar', type: 'image' as const, order: 1 }
    ],
    features: ['AI Sound Pro', '7.1.4 Channel Audio', 'Meridian Audio Technology', 'Room Calibration', 'Wireless Rear Kit Ready'],
    specifications: [
      { name: 'Channels', value: '7.1.4', group: 'Audio' },
      { name: 'Total Power', value: '770W', group: 'Audio' },
      { name: 'Subwoofer', value: 'Wireless 8" Subwoofer', group: 'Audio' },
      { name: 'Connectivity', value: 'HDMI eARC, Bluetooth, Wi-Fi', group: 'Connectivity' }
    ],
    basePrice: 1599.99,
    taxCode: 'txcd_99999999',
    weight: { value: 25.4, unit: 'lb' },
    dimensions: { length: 55.5, width: 5.4, height: 2.5, unit: 'in' },
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
    seoTitle: 'LG SP11RA 7.1.4 AI Sound Pro Soundbar',
    seoDescription: 'AI-powered soundbar with Meridian Audio technology and 7.1.4 channel audio.'
  },
  {
    id: 'soundbar-007',
    name: 'Klipsch Cinema 1200 5.1.4 Dolby Atmos Soundbar',
    slug: 'klipsch-cinema-1200-5-1-4-dolby-atmos-soundbar',
    description: 'Horn-loaded technology delivers dynamic, detailed sound with wireless 12" subwoofer for powerful bass response.',
    shortDescription: '5.1.4 Dolby Atmos Soundbar with Horn-loaded Technology',
    categoryId: '113', // Soundbars
    categoryIds: ['113', '11', '1'],
    brand: 'Klipsch',
    status: 'active' as Status,
    images: [
      { id: 'img-soundbar-007-1', url: '/images/klipsch-cinema-1200-front.jpg', altText: 'Klipsch Cinema 1200 Dolby Atmos Soundbar', type: 'image' as const, order: 1 }
    ],
    features: ['Horn-loaded Technology', '5.1.4 Channel Audio', 'Wireless 12" Subwoofer', 'Dialogue Enhancement', 'Multiple EQ Settings'],
    specifications: [
      { name: 'Channels', value: '5.1.4', group: 'Audio' },
      { name: 'Total Power', value: '1200W', group: 'Audio' },
      { name: 'Subwoofer', value: 'Wireless 12" Subwoofer', group: 'Audio' },
      { name: 'Connectivity', value: 'HDMI eARC, Bluetooth, Optical', group: 'Connectivity' }
    ],
    basePrice: 1799.99,
    taxCode: 'txcd_99999999',
    weight: { value: 38.8, unit: 'lb' },
    dimensions: { length: 45.0, width: 6.5, height: 4.0, unit: 'in' },
    createdAt: new Date('2024-01-22'),
    updatedAt: new Date('2024-01-22'),
    seoTitle: 'Klipsch Cinema 1200 5.1.4 Dolby Atmos Soundbar',
    seoDescription: 'Premium soundbar with horn-loaded technology and wireless 12" subwoofer.'
  },
  {
    id: 'soundbar-008',
    name: 'Vizio Elevate 5.1.4 Rotating Dolby Atmos Soundbar',
    slug: 'vizio-elevate-5-1-4-rotating-dolby-atmos-soundbar',
    description: 'Unique rotating speakers automatically adjust for optimal Dolby Atmos and DTS:X performance with adaptive height virtualization.',
    shortDescription: '5.1.4 Rotating Dolby Atmos Soundbar',
    categoryId: '113', // Soundbars
    categoryIds: ['113', '11', '1'],
    brand: 'Vizio',
    status: 'active' as Status,
    images: [
      { id: 'img-soundbar-008-1', url: '/images/vizio-elevate-front.jpg', altText: 'Vizio Elevate Rotating Dolby Atmos Soundbar', type: 'image' as const, order: 1 }
    ],
    features: ['Rotating Speakers', '5.1.4 Channel Audio', 'Adaptive Height Virtualization', '8" Wireless Subwoofer', 'SmartCast Integration'],
    specifications: [
      { name: 'Channels', value: '5.1.4', group: 'Audio' },
      { name: 'Total Power', value: '548W', group: 'Audio' },
      { name: 'Subwoofer', value: 'Wireless 8" Subwoofer', group: 'Audio' },
      { name: 'Connectivity', value: 'HDMI eARC, Bluetooth, Wi-Fi', group: 'Connectivity' }
    ],
    basePrice: 799.99,
    taxCode: 'txcd_99999999',
    weight: { value: 19.4, unit: 'lb' },
    dimensions: { length: 48.0, width: 5.7, height: 3.0, unit: 'in' },
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-01-25'),
    seoTitle: 'Vizio Elevate 5.1.4 Rotating Dolby Atmos Soundbar',
    seoDescription: 'Innovative soundbar with rotating speakers and adaptive height virtualization.'
  }
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
    product.features.some(feature => feature.toLowerCase().includes(searchTerm))
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
