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
    compareAtPrice: 2199.99,
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
    compareAtPrice: 2199.00,
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
    priceRange: { min: 999.00, max: 1499.00 },
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
    basePrice: 89.50,
    compareAtPrice: 98.00,
    taxCode: 'txcd_99999999',
    weight: { value: 1.5, unit: 'lb' },
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-02-15'),
    seoTitle: 'Levi\'s 501 Original Jeans - Classic Straight Fit',
    seoDescription: 'Shop the iconic Levi\'s 501 Original jeans in classic straight fit. The original blue jean since 1873.'
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
