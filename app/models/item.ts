import { BaseModel, Status, MediaItem, Dimensions, Weight, ItemDefiningSpecificationValue } from './common';

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
  // Changed from 'options' to 'itemDefiningSpecificationValues'
  // These are the actual values for the specifications that define this item
  itemDefiningSpecificationValues: ItemDefiningSpecificationValue[];
  images: MediaItem[];
  position: number;
  
  // Computed fields
  isInStock: boolean;
  isLowStock: boolean;
  lowStockThreshold: number;
}

// Deprecated: Use ItemDefiningSpecificationValue instead
// Keeping for backward compatibility during transition
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
    itemDefiningSpecificationValues: [
      { name: 'Storage', value: '128GB', displayName: '128 GB' },
      { name: 'Color', value: 'Natural Titanium', displayName: 'Natural Titanium' }
    ],
    images: [
      {
        id: 'img_iphone_nt_128',
        url: 'https://placehold.co/600x600/e5e7eb/6b7280?text=iPhone%2015%20Pro%20128GB%20Natural%20Titanium',
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
    itemDefiningSpecificationValues: [
      { name: 'Storage', value: '256GB', displayName: '256 GB' },
      { name: 'Color', value: 'Natural Titanium', displayName: 'Natural Titanium' }
    ],
    images: [
      {
        id: 'img_iphone_nt_256',
        url: 'https://placehold.co/600x600/e5e7eb/6b7280?text=iPhone%2015%20Pro%20256GB%20Natural%20Titanium',
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
    itemDefiningSpecificationValues: [
      { name: 'Storage', value: '128GB', displayName: '128 GB' },
      { name: 'Color', value: 'Blue Titanium', displayName: 'Blue Titanium' }
    ],
    images: [
      {
        id: 'img_iphone_bt_128',
        url: 'https://placehold.co/600x600/e5e7eb/6b7280?text=iPhone%2015%20Pro%20128GB%20Blue%20Titanium',
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
    itemDefiningSpecificationValues: [
      { name: 'Storage', value: '512GB', displayName: '512 GB' },
      { name: 'Color', value: 'Natural Titanium', displayName: 'Natural Titanium' }
    ],
    images: [
      {
        id: 'img_iphone_nt_512',
        url: 'https://placehold.co/600x600/e5e7eb/6b7280?text=iPhone%2015%20Pro%20512GB%20Natural%20Titanium',
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
    itemDefiningSpecificationValues: [
      { name: 'Processor', value: 'M3 Pro', displayName: 'M3 Pro' },
      { name: 'Storage', value: '512GB', displayName: '512 GB SSD' },
      { name: 'Color', value: 'Space Gray', displayName: 'Space Gray' }
    ],
    images: [
      {
        id: 'img_mbp_gray_512',
        url: 'https://placehold.co/600x600/e5e7eb/6b7280?text=MacBook%20Pro%2014%22%20M3%20Pro%20512GB%20Space%20Gray',
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
    itemDefiningSpecificationValues: [
      { name: 'Processor', value: 'M3 Pro', displayName: 'M3 Pro' },
      { name: 'Storage', value: '1TB', displayName: '1 TB SSD' },
      { name: 'Color', value: 'Space Gray', displayName: 'Space Gray' }
    ],
    images: [
      {
        id: 'img_mbp_gray_1tb',
        url: 'https://placehold.co/600x600/e5e7eb/6b7280?text=MacBook%20Pro%2014%22%20M3%20Pro%201TB%20Space%20Gray',
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
    itemDefiningSpecificationValues: [
      { name: 'Processor', value: 'M3 Pro', displayName: 'M3 Pro' },
      { name: 'Storage', value: '512GB', displayName: '512 GB SSD' },
      { name: 'Color', value: 'Silver', displayName: 'Silver' }
    ],
    images: [
      {
        id: 'img_mbp_silver_512',
        url: 'https://placehold.co/600x600/e5e7eb/6b7280?text=MacBook%20Pro%2014%22%20M3%20Pro%20512GB%20Silver',
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
    itemDefiningSpecificationValues: [
      { name: 'Waist', value: '32', displayName: '32"' },
      { name: 'Length', value: '32', displayName: '32"' },
      { name: 'Wash', value: 'Dark', displayName: 'Dark Wash' }
    ],
    images: [
      {
        id: 'img_levis_32_dark',
        url: 'https://placehold.co/600x600/e5e7eb/6b7280?text=Levi%27s%20501%2032x32%20Dark%20Wash',
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
    itemDefiningSpecificationValues: [
      { name: 'Waist', value: '34', displayName: '34"' },
      { name: 'Length', value: '32', displayName: '32"' },
      { name: 'Wash', value: 'Dark', displayName: 'Dark Wash' }
    ],
    images: [
      {
        id: 'img_levis_34_dark',
        url: 'https://placehold.co/600x600/e5e7eb/6b7280?text=Levi%27s%20501%2034x32%20Dark%20Wash',
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
    itemDefiningSpecificationValues: [
      { name: 'Waist', value: '32', displayName: '32"' },
      { name: 'Length', value: '34', displayName: '34"' },
      { name: 'Wash', value: 'Dark', displayName: 'Dark Wash' }
    ],
    images: [
      {
        id: 'img_levis_32_34_dark',
        url: 'https://placehold.co/600x600/e5e7eb/6b7280?text=Levi%27s%20501%2032x34%20Dark%20Wash',
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
    itemDefiningSpecificationValues: [
      { name: 'Color', value: 'Black', displayName: 'Black' }
    ],
    images: [
      {
        id: 'img_sony_black',
        url: 'https://placehold.co/600x600/e5e7eb/6b7280?text=Sony%20WH-1000XM5%20Headphones%20Black',
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
    itemDefiningSpecificationValues: [
      { name: 'Screen Size', value: '65"', displayName: '65 inches' },
    ],
    images: [
      {
        id: 'img_1',
        url: 'https://placehold.co/600x600/e5e7eb/6b7280?text=Samsung%2065%22%20OLED%20TV%20Front',
        altText: 'Samsung 65" OLED TV front view',
        order: 1,
        type: 'image'
      },
      {
        id: 'img_2',
        url: 'https://placehold.co/600x600/e5e7eb/6b7280?text=Samsung%2065%22%20OLED%20TV%20Side',
        altText: 'Samsung 65" OLED TV side view',
        order: 2,
        type: 'image'
      }
    ],
    position: 1,
    isInStock: true,
    isLowStock: false,
    lowStockThreshold: 2,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'item_13',
    productId: 'prod_1',
    sku: 'SAMSUNG-OLED75-2024',
    name: 'Samsung 75" OLED 4K Smart TV - 2024 Model',
    price: 1999.99,
    compareAtPrice: 2299.99,
    inventoryQuantity: 6,
    inventoryTracking: true,
    weight: { value: 55.1, unit: 'lb' },
    dimensions: { length: 57.1, width: 32.7, height: 2.4, unit: 'in' },
    barcode: '887276708530',
    status: Status.ACTIVE,
    itemDefiningSpecificationValues: [
      { name: 'Size', value: '75"', displayName: '75 inches' },
    ],
    images: [
      {
        id: 'img_samsung_oled_75',
        url: 'https://placehold.co/600x600/e5e7eb/6b7280?text=Samsung%2075%22%20OLED%204K%20Smart%20TV%202024',
        altText: 'Samsung 75" OLED 4K Smart TV 2024',
        order: 1,
        type: 'image'
      },
      {
        id: 'img_2',
        url: 'https://placehold.co/600x600/e5e7eb/6b7280?text=Samsung%2075%22%20OLED%20TV%20Side',
        altText: 'Samsung 75" OLED TV side view',
        order: 2,
        type: 'image'
      }
    ],
    position: 1,
    isInStock: true,
    isLowStock: false,
    lowStockThreshold: 2,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'item_14',
    productId: 'prod_1',
    sku: 'SAMSUNG-OLED85-2024',
    name: 'Samsung 85" OLED 4K Smart TV - 2024 Model',
    price: 2899.99,
    compareAtPrice: 3199.99,
    inventoryQuantity: 6,
    inventoryTracking: true,
    weight: { value: 55.1, unit: 'lb' },
    dimensions: { length: 57.1, width: 32.7, height: 2.4, unit: 'in' },
    barcode: '887276708539',
    status: Status.ACTIVE,
    itemDefiningSpecificationValues: [
      { name: 'Size', value: '85"', displayName: '85 inches' },
    ],
    images: [
      {
        id: 'img_samsung_oled_85',
        url: 'https://placehold.co/600x600/e5e7eb/6b7280?text=Samsung%2085%22%20OLED%204K%20Smart%20TV%202024',
        altText: 'Samsung 85" OLED 4K Smart TV 2024',
        order: 1,
        type: 'image'
      },
      {
        id: 'img_2',
        url: 'https://placehold.co/600x600/e5e7eb/6b7280?text=Samsung%2085%22%20OLED%20TV%20Side',
        altText: 'Samsung 85" OLED TV side view',
        order: 2,
        type: 'image'
      }

    ],
    position: 1,
    isInStock: true,
    isLowStock: false,
    lowStockThreshold: 2,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'item_15',
    productId: 'prod_8',
    sku: 'PANASONIC-OLED85-2024',
    name: 'Panasonic 85" OLED 4K Smart TV - 2024 Model',
    price: 2899.99,
    compareAtPrice: 3199.99,
    inventoryQuantity: 6,
    inventoryTracking: true,
    weight: { value: 55.1, unit: 'lb' },
    dimensions: { length: 57.1, width: 32.7, height: 2.4, unit: 'in' },
    barcode: '887276708100',
    status: Status.ACTIVE,
    itemDefiningSpecificationValues: [
      { name: 'Size', value: '85"', displayName: '85 inches' },
    ],
    images: [
      {
        id: 'img_panasonic_oled_85',
        url: 'https://placehold.co/600x600/e5e7eb/6b7280?text=Panasonic%2085%22%20OLED%204K%20Smart%20TV%202024',
        altText: 'Panasonic 85" OLED 4K Smart TV 2024',
        order: 1,
        type: 'image'
      },
      {
        id: 'img_2',
        url: 'https://placehold.co/600x600/e5e7eb/6b7280?text=Panasonic%2085%22%20OLED%20TV%20Side',
        altText: 'Panasonic 85" OLED TV side view',
        order: 2,
        type: 'image'
      }

    ],
    position: 1,
    isInStock: true,
    isLowStock: false,
    lowStockThreshold: 2,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'item_16',
    productId: 'prod_9',
    sku: 'PHILIPS-OLED45-2024',
    name: 'Philips 45" OLED 4K Smart TV - 2024 Model',
    price: 2899.99,
    compareAtPrice: 3199.99,
    inventoryQuantity: 6,
    inventoryTracking: true,
    weight: { value: 55.1, unit: 'lb' },
    dimensions: { length: 57.1, width: 32.7, height: 2.4, unit: 'in' },
    barcode: '887276709100',
    status: Status.ACTIVE,
    itemDefiningSpecificationValues: [
      { name: 'Size', value: '45"', displayName: '45 inches' },
    ],
    images: [
      {
        id: 'img_philips_oled_45',
        url: 'https://placehold.co/600x600/e5e7eb/6b7280?text=Philips%2045%22%20OLED%204K%20Smart%20TV%202024',
        altText: 'Philips 45" OLED 4K Smart TV 2024',
        order: 1,
        type: 'image'
      },
      {
        id: 'img_2',
        url: 'https://placehold.co/600x600/e5e7eb/6b7280?text=Philips%2045%22%20OLED%20TV%20Side',
        altText: 'Philips 45" OLED TV side view',
        order: 2,
        type: 'image'
      }

    ],
    position: 1,
    isInStock: true,
    isLowStock: false,
    lowStockThreshold: 2,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'item_17',
    productId: 'prod_10',
    sku: 'HISENSE-OLED85-2024',
    name: 'Hisense 85" OLED 4K Smart TV - 2024 Model',
    price: 2899.99,
    compareAtPrice: 3199.99,
    inventoryQuantity: 6,
    inventoryTracking: true,
    weight: { value: 55.1, unit: 'lb' },
    dimensions: { length: 57.1, width: 32.7, height: 2.4, unit: 'in' },
    barcode: '887276707100',
    status: Status.ACTIVE,
    itemDefiningSpecificationValues: [
      { name: 'Size', value: '85"', displayName: '85 inches' },
    ],
    images: [
      {
        id: 'img_hisense_oled_85',
        url: 'https://placehold.co/600x600/e5e7eb/6b7280?text=Hisense%2085%22%20OLED%204K%20Smart%20TV%202024',
        altText: 'Hisense 85" OLED 4K Smart TV 2024',
        order: 1,
        type: 'image'
      },
      {
        id: 'img_2',
        url: 'https://placehold.co/600x600/e5e7eb/6b7280?text=Hisense%2085%22%20OLED%20TV%20Side',
        altText: 'Hisense 85" OLED TV side view',
        order: 2,
        type: 'image'
      }

    ],
    position: 1,
    isInStock: true,
    isLowStock: false,
    lowStockThreshold: 2,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'item_18',
    productId: 'prod_11',
    sku: 'VIZIO-OLED55-2024',
    name: 'Vizio 55" OLED 4K Smart TV - 2024 Model',
    price: 2899.99,
    compareAtPrice: 3199.99,
    inventoryQuantity: 6,
    inventoryTracking: true,
    weight: { value: 55.1, unit: 'lb' },
    dimensions: { length: 57.1, width: 32.7, height: 2.4, unit: 'in' },
    barcode: '887276706100',
    status: Status.ACTIVE,
    itemDefiningSpecificationValues: [
      { name: 'Size', value: '55"', displayName: '55 inches' },
    ],
    images: [
      {
        id: 'img_vizio_oled_55',
        url: 'https://placehold.co/600x600/e5e7eb/6b7280?text=Vizio%2055%22%20OLED%204K%20Smart%20TV%202024',
        altText: 'Vizio 55" OLED 4K Smart TV 2024',
        order: 1,
        type: 'image'
      },
      {
        id: 'img_2',
        url: 'https://placehold.co/600x600/e5e7eb/6b7280?text=Vizio%2055%22%20OLED%20TV%20Side',
        altText: 'Vizio 55" OLED TV side view',
        order: 2,
        type: 'image'
      }

    ],
    position: 1,
    isInStock: true,
    isLowStock: false,
    lowStockThreshold: 2,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'item_19',
    productId: 'prod_12',
    sku: 'XAOMI-OLED75-2024',
    name: 'XAOMI 75" OLED 4K Smart TV - 2024 Model',
    price: 2899.99,
    compareAtPrice: 3199.99,
    inventoryQuantity: 6,
    inventoryTracking: true,
    weight: { value: 55.1, unit: 'lb' },
    dimensions: { length: 57.1, width: 32.7, height: 2.4, unit: 'in' },
    barcode: '887276755100',
    status: Status.ACTIVE,
    itemDefiningSpecificationValues: [
      { name: 'Size', value: '75"', displayName: '75 inches' },
    ],
    images: [
      {
        id: 'img_xaomi_oled_75',
        url: 'https://placehold.co/600x600/e5e7eb/6b7280?text=XAOMI%2075%22%20OLED%204K%20Smart%20TV%202024',
        altText: 'XAOMI 75" OLED 4K Smart TV 2024',
        order: 1,
        type: 'image'
      },
      {
        id: 'img_2',
        url: 'https://placehold.co/600x600/e5e7eb/6b7280?text=XAOMI%2075%22%20OLED%20TV%20Side',
        altText: 'XAOMI 75" OLED TV side view',
        order: 2,
        type: 'image'
      }

    ],
    position: 1,
    isInStock: true,
    isLowStock: false,
    lowStockThreshold: 2,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'item_20',
    productId: 'prod_13',
    sku: 'SAMSUNG-QN90A-2024',
    name: 'SAMSUNG 95" QLED 4K Smart TV - 2024 Model',
    price: 2899.99,
    compareAtPrice: 3199.99,
    inventoryQuantity: 6,
    inventoryTracking: true,
    weight: { value: 55.1, unit: 'lb' },
    dimensions: { length: 57.1, width: 32.7, height: 2.4, unit: 'in' },
    barcode: '889976708100',
    status: Status.ACTIVE,
    itemDefiningSpecificationValues: [
      { name: 'Size', value: '95"', displayName: '95 inches' },
    ],
    images: [
      {
        id: 'img_samsung_oled_95',
        url: 'https://placehold.co/600x600/e5e7eb/6b7280?text=SAMSUNG%2095%22%20QLED%204K%20Smart%20TV%202024',
        altText: 'SAMSUNG 95" QLED 4K Smart TV 2024',
        order: 1,
        type: 'image'
      },
      {
        id: 'img_2',
        url: 'https://placehold.co/600x600/e5e7eb/6b7280?text=SAMSUNG%2095%22%20QLED%20TV%20Side',
        altText: 'SAMSUNG 95" QLED TV side view',
        order: 2,
        type: 'image'
      }

    ],
    position: 1,
    isInStock: true,
    isLowStock: false,
    lowStockThreshold: 2,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'item_21',
    productId: 'prod_14',
    sku: 'SAMSUNG-QLED80A-2024',
    name: 'SAMSUNG 65" QLED 4K Smart TV - 2024 Model',
    price: 2899.99,
    compareAtPrice: 3199.99,
    inventoryQuantity: 6,
    inventoryTracking: true,
    weight: { value: 55.1, unit: 'lb' },
    dimensions: { length: 57.1, width: 32.7, height: 2.4, unit: 'in' },
    barcode: '997276708100',
    status: Status.ACTIVE,
    itemDefiningSpecificationValues: [
      { name: 'Size', value: '65"', displayName: '65 inches' },
    ],
    images: [
      {
        id: 'img_samsung_qled_65',
        url: 'https://placehold.co/600x600/e5e7eb/6b7280?text=SAMSUNG%2065%22%20QLED%204K%20Smart%20TV%202024',
        altText: 'SAMSUNG 65" QLED 4K Smart TV 2024',
        order: 1,
        type: 'image'
      },
      {
        id: 'img_2',
        url: 'https://placehold.co/600x600/e5e7eb/6b7280?text=SAMSUNG%2065%22%20QLED%20TV%20Side',
        altText: 'SAMSUNG 65" QLED TV side view',
        order: 2,
        type: 'image'
      }

    ],
    position: 1,
    isInStock: true,
    isLowStock: false,
    lowStockThreshold: 2,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'item_22',
    productId: 'prod_15',
    sku: 'TCL-QLED85-2024',
    name: 'TCL 85" QLED 4K Smart TV - 2024 Model',
    price: 2899.99,
    compareAtPrice: 3199.99,
    inventoryQuantity: 6,
    inventoryTracking: true,
    weight: { value: 55.1, unit: 'lb' },
    dimensions: { length: 57.1, width: 32.7, height: 2.4, unit: 'in' },
    barcode: '727276708100',
    status: Status.ACTIVE,
    itemDefiningSpecificationValues: [
      { name: 'Size', value: '85"', displayName: '85 inches' },
    ],
    images: [
      {
        id: 'img_tcl_qled_85',
        url: 'https://placehold.co/600x600/e5e7eb/6b7280?text=TCL%2085%22%20QLED%204K%20Smart%20TV%202024',
        altText: 'TCL 85" QLED 4K Smart TV 2024',
        order: 1,
        type: 'image'
      },
      {
        id: 'img_2',
        url: 'https://placehold.co/600x600/e5e7eb/6b7280?text=TCL%2085%22%20QLED%20TV%20Side',
        altText: 'TCL 85" QLED TV side view',
        order: 2,
        type: 'image'
      }

    ],
    position: 1,
    isInStock: true,
    isLowStock: false,
    lowStockThreshold: 2,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'item_23',
    productId: 'prod_16',
    sku: 'HISENSE-QLED55-2024',
    name: 'HISENSE 55" QLED 4K Smart TV - 2024 Model',
    price: 2899.99,
    compareAtPrice: 3199.99,
    inventoryQuantity: 6,
    inventoryTracking: true,
    weight: { value: 55.1, unit: 'lb' },
    dimensions: { length: 57.1, width: 32.7, height: 2.4, unit: 'in' },
    barcode: '438276708100',
    status: Status.ACTIVE,
    itemDefiningSpecificationValues: [
      { name: 'Size', value: '55"', displayName: '55 inches' },
    ],
    images: [
      {
        id: 'img_hisense_qled_55',
        url: 'https://placehold.co/600x600/e5e7eb/6b7280?text=HISENSE%2055%22%20QLED%204K%20Smart%20TV%202024',
        altText: 'HISENSE 55" QLED 4K Smart TV 2024',
        order: 1,
        type: 'image'
      },
      {
        id: 'img_2',
        url: 'https://placehold.co/600x600/e5e7eb/6b7280?text=HISENSE%2055%22%20QLED%20TV%20Side',
        altText: 'HISENSE 55" QLED TV side view',
        order: 2,
        type: 'image'
      }

    ],
    position: 1,
    isInStock: true,
    isLowStock: false,
    lowStockThreshold: 2,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },

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
    item.itemDefiningSpecificationValues.some(spec => 
      spec.name === optionName && spec.value === optionValue
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

// New utility functions for product-item architecture

/**
 * Get all available values for a specific specification across all items of a product
 * @param productId - The product ID
 * @param specName - The specification name (e.g., "Screen Size", "Color")
 * @returns Array of unique specification values
 */
export const getAvailableSpecificationValues = (productId: string, specName: string): string[] => {
  const items = getItemsByProduct(productId);
  const values = new Set<string>();
  
  items.forEach(item => {
    const spec = item.itemDefiningSpecificationValues.find(s => s.name === specName);
    if (spec) {
      values.add(spec.value);
    }
  });
  
  return Array.from(values).sort();
};

/**
 * Find a specific item by its specification values
 * @param productId - The product ID
 * @param specValues - Record of specification name -> value pairs
 * @returns The matching item or undefined
 */
export const findItemBySpecificationValues = (
  productId: string, 
  specValues: Record<string, string>
): Item | undefined => {
  const items = getItemsByProduct(productId);
  
  return items.find(item => {
    // Check if all provided specification values match this item
    return Object.entries(specValues).every(([specName, specValue]) => {
      const itemSpec = item.itemDefiningSpecificationValues.find(s => s.name === specName);
      return itemSpec && itemSpec.value === specValue;
    });
  });
};

/**
 * Get the default/first item for a product
 * @param productId - The product ID
 * @returns The default item or undefined if no items exist
 */
export const getDefaultItem = (productId: string): Item | undefined => {
  const items = getItemsByProduct(productId);
  if (items.length === 0) return undefined;
  
  // Return the item with the lowest position, or first in array if positions are equal
  return items.sort((a, b) => a.position - b.position)[0];
};

/**
 * Validate that specification values are valid for a product
 * @param productId - The product ID
 * @param specValues - Record of specification name -> value pairs
 * @returns True if all specification values are valid
 */
export const validateSpecificationValues = (
  productId: string, 
  specValues: Record<string, string>
): boolean => {
  const items = getItemsByProduct(productId);
  if (items.length === 0) return false;
  
  // For each specification provided, check if the value exists among the items
  return Object.entries(specValues).every(([specName, specValue]) => {
    const availableValues = getAvailableSpecificationValues(productId, specName);
    return availableValues.includes(specValue);
  });
};

/**
 * Get all items for a product with their specification values grouped
 * @param productId - The product ID
 * @returns Object with specification names as keys and arrays of items as values
 */
export const getItemsBySpecificationName = (productId: string): Record<string, Item[]> => {
  const items = getItemsByProduct(productId);
  const grouped: Record<string, Item[]> = {};
  
  items.forEach(item => {
    item.itemDefiningSpecificationValues.forEach(spec => {
      if (!grouped[spec.name]) {
        grouped[spec.name] = [];
      }
      if (!grouped[spec.name].includes(item)) {
        grouped[spec.name].push(item);
      }
    });
  });
  
  return grouped;
};
