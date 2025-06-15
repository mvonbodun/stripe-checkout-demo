import { BaseModel, Status, MediaItem, Dimensions, Weight } from './common';

export interface Item extends BaseModel {
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
  options: ItemOption[];
  images: MediaItem[];
  position: number;
  
  // Computed fields
  isInStock: boolean;
  isLowStock: boolean;
  lowStockThreshold: number;
}

export interface ItemOption {
  name: string; // e.g., "Color", "Size", "Storage"
  value: string; // e.g., "Space Gray", "Large", "256GB"
  displayName?: string; // e.g., "Space Gray", "L", "256 GB"
}

export interface ItemInventory {
  itemId: string;
  sku: string;
  quantity: number;
  reserved: number;
  available: number;
  lastUpdated: Date;
}

export interface ItemPricing {
  itemId: string;
  sku: string;
  basePrice: number;
  salePrice?: number;
  compareAtPrice?: number;
  costPrice?: number;
  margin?: number;
  effectiveDate: Date;
  expirationDate?: Date;
}

// Mock item/SKU data
export const mockItems: Item[] = [
  // iPhone 15 Pro variants
  {
    id: 'item_1',
    productId: 'prod_3',
    sku: 'IPHONE15PRO-128-TITANIUM',
    name: 'iPhone 15 Pro - 128GB - Natural Titanium',
    price: 999.00,
    compareAtPrice: 1099.00,
    inventoryQuantity: 25,
    inventoryTracking: true,
    weight: { value: 6.60, unit: 'oz' },
    dimensions: { length: 5.77, width: 2.78, height: 0.32, unit: 'in' },
    barcode: '194253433125',
    status: Status.ACTIVE,
    options: [
      { name: 'Storage', value: '128GB', displayName: '128 GB' },
      { name: 'Color', value: 'Natural Titanium', displayName: 'Natural Titanium' }
    ],
    images: [
      {
        id: 'img_iphone_nt_128',
        url: '/images/items/iphone-15-pro-natural-titanium.jpg',
        altText: 'iPhone 15 Pro 128GB Natural Titanium',
        order: 1,
        type: 'image'
      }
    ],
    position: 1,
    isInStock: true,
    isLowStock: false,
    lowStockThreshold: 5,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01')
  },
  {
    id: 'item_2',
    productId: 'prod_3',
    sku: 'IPHONE15PRO-256-TITANIUM',
    name: 'iPhone 15 Pro - 256GB - Natural Titanium',
    price: 1099.00,
    compareAtPrice: 1199.00,
    inventoryQuantity: 18,
    inventoryTracking: true,
    weight: { value: 6.60, unit: 'oz' },
    dimensions: { length: 5.77, width: 2.78, height: 0.32, unit: 'in' },
    barcode: '194253433132',
    status: Status.ACTIVE,
    options: [
      { name: 'Storage', value: '256GB', displayName: '256 GB' },
      { name: 'Color', value: 'Natural Titanium', displayName: 'Natural Titanium' }
    ],
    images: [
      {
        id: 'img_iphone_nt_256',
        url: '/images/items/iphone-15-pro-natural-titanium.jpg',
        altText: 'iPhone 15 Pro 256GB Natural Titanium',
        order: 1,
        type: 'image'
      }
    ],
    position: 2,
    isInStock: true,
    isLowStock: false,
    lowStockThreshold: 5,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01')
  },
  {
    id: 'item_3',
    productId: 'prod_3',
    sku: 'IPHONE15PRO-128-BLUE',
    name: 'iPhone 15 Pro - 128GB - Blue Titanium',
    price: 999.00,
    compareAtPrice: 1099.00,
    inventoryQuantity: 12,
    inventoryTracking: true,
    weight: { value: 6.60, unit: 'oz' },
    dimensions: { length: 5.77, width: 2.78, height: 0.32, unit: 'in' },
    barcode: '194253433149',
    status: Status.ACTIVE,
    options: [
      { name: 'Storage', value: '128GB', displayName: '128 GB' },
      { name: 'Color', value: 'Blue Titanium', displayName: 'Blue Titanium' }
    ],
    images: [
      {
        id: 'img_iphone_bt_128',
        url: '/images/items/iphone-15-pro-blue-titanium.jpg',
        altText: 'iPhone 15 Pro 128GB Blue Titanium',
        order: 1,
        type: 'image'
      }
    ],
    position: 3,
    isInStock: true,
    isLowStock: false,
    lowStockThreshold: 5,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01')
  },
  {
    id: 'item_4',
    productId: 'prod_3',
    sku: 'IPHONE15PRO-512-TITANIUM',
    name: 'iPhone 15 Pro - 512GB - Natural Titanium',
    price: 1299.00,
    compareAtPrice: 1399.00,
    inventoryQuantity: 8,
    inventoryTracking: true,
    weight: { value: 6.60, unit: 'oz' },
    dimensions: { length: 5.77, width: 2.78, height: 0.32, unit: 'in' },
    barcode: '194253433156',
    status: Status.ACTIVE,
    options: [
      { name: 'Storage', value: '512GB', displayName: '512 GB' },
      { name: 'Color', value: 'Natural Titanium', displayName: 'Natural Titanium' }
    ],
    images: [
      {
        id: 'img_iphone_nt_512',
        url: '/images/items/iphone-15-pro-natural-titanium.jpg',
        altText: 'iPhone 15 Pro 512GB Natural Titanium',
        order: 1,
        type: 'image'
      }
    ],
    position: 4,
    isInStock: true,
    isLowStock: false,
    lowStockThreshold: 5,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01')
  },

  // MacBook Pro variants
  {
    id: 'item_5',
    productId: 'prod_2',
    sku: 'MBP14-M3PRO-512-GRAY',
    name: 'MacBook Pro 14" - M3 Pro - 512GB - Space Gray',
    price: 1999.00,
    compareAtPrice: 2199.00,
    inventoryQuantity: 15,
    inventoryTracking: true,
    weight: { value: 3.5, unit: 'lb' },
    dimensions: { length: 12.31, width: 8.71, height: 0.61, unit: 'in' },
    barcode: '194253164531',
    status: Status.ACTIVE,
    options: [
      { name: 'Processor', value: 'M3 Pro', displayName: 'M3 Pro' },
      { name: 'Storage', value: '512GB', displayName: '512 GB SSD' },
      { name: 'Color', value: 'Space Gray', displayName: 'Space Gray' }
    ],
    images: [
      {
        id: 'img_mbp_gray_512',
        url: '/images/items/macbook-pro-14-space-gray.jpg',
        altText: 'MacBook Pro 14" M3 Pro 512GB Space Gray',
        order: 1,
        type: 'image'
      }
    ],
    position: 1,
    isInStock: true,
    isLowStock: false,
    lowStockThreshold: 3,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: 'item_6',
    productId: 'prod_2',
    sku: 'MBP14-M3PRO-1TB-GRAY',
    name: 'MacBook Pro 14" - M3 Pro - 1TB - Space Gray',
    price: 2399.00,
    compareAtPrice: 2599.00,
    inventoryQuantity: 8,
    inventoryTracking: true,
    weight: { value: 3.5, unit: 'lb' },
    dimensions: { length: 12.31, width: 8.71, height: 0.61, unit: 'in' },
    barcode: '194253164548',
    status: Status.ACTIVE,
    options: [
      { name: 'Processor', value: 'M3 Pro', displayName: 'M3 Pro' },
      { name: 'Storage', value: '1TB', displayName: '1 TB SSD' },
      { name: 'Color', value: 'Space Gray', displayName: 'Space Gray' }
    ],
    images: [
      {
        id: 'img_mbp_gray_1tb',
        url: '/images/items/macbook-pro-14-space-gray.jpg',
        altText: 'MacBook Pro 14" M3 Pro 1TB Space Gray',
        order: 1,
        type: 'image'
      }
    ],
    position: 2,
    isInStock: true,
    isLowStock: false,
    lowStockThreshold: 3,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: 'item_7',
    productId: 'prod_2',
    sku: 'MBP14-M3PRO-512-SILVER',
    name: 'MacBook Pro 14" - M3 Pro - 512GB - Silver',
    price: 1999.00,
    compareAtPrice: 2199.00,
    inventoryQuantity: 12,
    inventoryTracking: true,
    weight: { value: 3.5, unit: 'lb' },
    dimensions: { length: 12.31, width: 8.71, height: 0.61, unit: 'in' },
    barcode: '194253164555',
    status: Status.ACTIVE,
    options: [
      { name: 'Processor', value: 'M3 Pro', displayName: 'M3 Pro' },
      { name: 'Storage', value: '512GB', displayName: '512 GB SSD' },
      { name: 'Color', value: 'Silver', displayName: 'Silver' }
    ],
    images: [
      {
        id: 'img_mbp_silver_512',
        url: '/images/items/macbook-pro-14-silver.jpg',
        altText: 'MacBook Pro 14" M3 Pro 512GB Silver',
        order: 1,
        type: 'image'
      }
    ],
    position: 3,
    isInStock: true,
    isLowStock: false,
    lowStockThreshold: 3,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20')
  },

  // Levi's 501 Jeans variants
  {
    id: 'item_8',
    productId: 'prod_5',
    sku: 'LEVIS501-32X32-DARK',
    name: 'Levi\'s 501 Original Jeans - 32W x 32L - Dark Wash',
    price: 89.50,
    compareAtPrice: 98.00,
    inventoryQuantity: 20,
    inventoryTracking: true,
    weight: { value: 1.5, unit: 'lb' },
    barcode: '501320032001',
    status: Status.ACTIVE,
    options: [
      { name: 'Waist', value: '32', displayName: '32"' },
      { name: 'Length', value: '32', displayName: '32"' },
      { name: 'Wash', value: 'Dark', displayName: 'Dark Wash' }
    ],
    images: [
      {
        id: 'img_levis_32_dark',
        url: '/images/items/levis-501-dark-wash.jpg',
        altText: 'Levi\'s 501 32x32 Dark Wash',
        order: 1,
        type: 'image'
      }
    ],
    position: 1,
    isInStock: true,
    isLowStock: false,
    lowStockThreshold: 5,
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-02-15')
  },
  {
    id: 'item_9',
    productId: 'prod_5',
    sku: 'LEVIS501-34X32-DARK',
    name: 'Levi\'s 501 Original Jeans - 34W x 32L - Dark Wash',
    price: 89.50,
    compareAtPrice: 98.00,
    inventoryQuantity: 18,
    inventoryTracking: true,
    weight: { value: 1.5, unit: 'lb' },
    barcode: '501340032001',
    status: Status.ACTIVE,
    options: [
      { name: 'Waist', value: '34', displayName: '34"' },
      { name: 'Length', value: '32', displayName: '32"' },
      { name: 'Wash', value: 'Dark', displayName: 'Dark Wash' }
    ],
    images: [
      {
        id: 'img_levis_34_dark',
        url: '/images/items/levis-501-dark-wash.jpg',
        altText: 'Levi\'s 501 34x32 Dark Wash',
        order: 1,
        type: 'image'
      }
    ],
    position: 2,
    isInStock: true,
    isLowStock: false,
    lowStockThreshold: 5,
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-02-15')
  },
  {
    id: 'item_10',
    productId: 'prod_5',
    sku: 'LEVIS501-32X34-DARK',
    name: 'Levi\'s 501 Original Jeans - 32W x 34L - Dark Wash',
    price: 89.50,
    compareAtPrice: 98.00,
    inventoryQuantity: 3,
    inventoryTracking: true,
    weight: { value: 1.5, unit: 'lb' },
    barcode: '501320034001',
    status: Status.ACTIVE,
    options: [
      { name: 'Waist', value: '32', displayName: '32"' },
      { name: 'Length', value: '34', displayName: '34"' },
      { name: 'Wash', value: 'Dark', displayName: 'Dark Wash' }
    ],
    images: [
      {
        id: 'img_levis_32_34_dark',
        url: '/images/items/levis-501-dark-wash.jpg',
        altText: 'Levi\'s 501 32x34 Dark Wash',
        order: 1,
        type: 'image'
      }
    ],
    position: 3,
    isInStock: true,
    isLowStock: true,
    lowStockThreshold: 5,
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-02-15')
  },

  // Sony Headphones (single variant)
  {
    id: 'item_11',
    productId: 'prod_4',
    sku: 'SONY-WH1000XM5-BLACK',
    name: 'Sony WH-1000XM5 Headphones - Black',
    price: 399.99,
    compareAtPrice: 449.99,
    inventoryQuantity: 35,
    inventoryTracking: true,
    weight: { value: 8.8, unit: 'oz' },
    barcode: '027242920446',
    status: Status.ACTIVE,
    options: [
      { name: 'Color', value: 'Black', displayName: 'Black' }
    ],
    images: [
      {
        id: 'img_sony_black',
        url: '/images/items/sony-wh1000xm5-black.jpg',
        altText: 'Sony WH-1000XM5 Headphones Black',
        order: 1,
        type: 'image'
      }
    ],
    position: 1,
    isInStock: true,
    isLowStock: false,
    lowStockThreshold: 10,
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-02-10')
  },

  // Samsung TV (single variant)
  {
    id: 'item_12',
    productId: 'prod_1',
    sku: 'SAMSUNG-OLED65-2024',
    name: 'Samsung 65" OLED 4K Smart TV - 2024 Model',
    price: 1899.99,
    compareAtPrice: 2199.99,
    inventoryQuantity: 6,
    inventoryTracking: true,
    weight: { value: 55.1, unit: 'lb' },
    dimensions: { length: 57.1, width: 32.7, height: 2.4, unit: 'in' },
    barcode: '887276708539',
    status: Status.ACTIVE,
    options: [
      { name: 'Size', value: '65"', displayName: '65 inches' },
      { name: 'Year', value: '2024', displayName: '2024 Model' }
    ],
    images: [
      {
        id: 'img_samsung_oled_65',
        url: '/images/items/samsung-oled-65-2024.jpg',
        altText: 'Samsung 65" OLED 4K Smart TV 2024',
        order: 1,
        type: 'image'
      }
    ],
    position: 1,
    isInStock: true,
    isLowStock: false,
    lowStockThreshold: 2,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  }
];

// Utility functions
export const getItemsByProduct = (productId: string): Item[] => {
  return mockItems.filter(item => item.productId === productId);
};

export const getItemById = (id: string): Item | undefined => {
  return mockItems.find(item => item.id === id);
};

export const getItemBySku = (sku: string): Item | undefined => {
  return mockItems.find(item => item.sku === sku);
};

export const getInStockItems = (): Item[] => {
  return mockItems.filter(item => item.isInStock && item.inventoryQuantity > 0);
};

export const getLowStockItems = (): Item[] => {
  return mockItems.filter(item => item.isLowStock);
};

export const getItemsByOption = (optionName: string, optionValue: string): Item[] => {
  return mockItems.filter(item => 
    item.options.some(option => 
      option.name === optionName && option.value === optionValue
    )
  );
};

export const updateItemInventory = (itemId: string, quantity: number): Item | null => {
  const item = mockItems.find(item => item.id === itemId);
  if (item) {
    item.inventoryQuantity = quantity;
    item.isInStock = quantity > 0;
    item.isLowStock = quantity <= item.lowStockThreshold && quantity > 0;
    item.updatedAt = new Date();
    return item;
  }
  return null;
};

export const getItemPriceRange = (productId: string): { min: number; max: number } | null => {
  const items = getItemsByProduct(productId);
  if (items.length === 0) return null;
  
  const prices = items.map(item => item.price);
  return {
    min: Math.min(...prices),
    max: Math.max(...prices)
  };
};
