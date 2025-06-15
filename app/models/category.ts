import { BaseModel, SEOFields, Status } from './common';

export interface Category extends BaseModel, SEOFields {
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
  level: 1 | 2 | 3;
  path: string; // Full category path for breadcrumbs (e.g., "Electronics > TVs & Audio > OLED TVs")
  active: boolean;
  order: number;
  imageUrl?: string;
  status: Status;
  productCount?: number; // Computed field for product count in this category
}

export interface CategoryTree extends Category {
  children?: CategoryTree[];
  parent?: Category;
}

export interface CategoryHierarchy {
  level1: Category[];
  level2: Category[];
  level3: Category[];
}

// Mock data for 3-level category hierarchy
export const mockCategories: Category[] = [
  // Level 1 Categories
  {
    id: '1',
    name: 'Electronics',
    slug: 'electronics',
    description: 'Latest gadgets and electronics',
    level: 1,
    path: 'Electronics',
    active: true,
    order: 1,
    status: Status.ACTIVE,
    imageUrl: '/images/categories/electronics.jpg',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    seoTitle: 'Electronics - Latest Gadgets & Technology',
    seoDescription: 'Shop the latest electronics including TVs, computers, mobile devices and more.'
  },
  {
    id: '2',
    name: 'Clothing',
    slug: 'clothing',
    description: 'Fashion and apparel for all occasions',
    level: 1,
    path: 'Clothing',
    active: true,
    order: 2,
    status: Status.ACTIVE,
    imageUrl: '/images/categories/clothing.jpg',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    seoTitle: 'Clothing & Fashion - Men, Women & Kids',
    seoDescription: 'Discover the latest fashion trends and clothing for men, women, and children.'
  },
  {
    id: '3',
    name: 'Home & Garden',
    slug: 'home-garden',
    description: 'Home improvement and garden supplies',
    level: 1,
    path: 'Home & Garden',
    active: true,
    order: 3,
    status: Status.ACTIVE,
    imageUrl: '/images/categories/home-garden.jpg',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    seoTitle: 'Home & Garden - Furniture, Decor & Outdoor',
    seoDescription: 'Transform your home and garden with our selection of furniture, decor, and outdoor essentials.'
  },
  {
    id: '4',
    name: 'Sports & Outdoors',
    slug: 'sports-outdoors',
    description: 'Sports equipment and outdoor gear',
    level: 1,
    path: 'Sports & Outdoors',
    active: true,
    order: 4,
    status: Status.ACTIVE,
    imageUrl: '/images/categories/sports-outdoors.jpg',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    seoTitle: 'Sports & Outdoors - Equipment & Gear',
    seoDescription: 'Get active with our sports equipment and outdoor gear for all your adventures.'
  },
  {
    id: '5',
    name: 'Books',
    slug: 'books',
    description: 'Books and literature',
    level: 1,
    path: 'Books',
    active: true,
    order: 5,
    status: Status.ACTIVE,
    imageUrl: '/images/categories/books.jpg',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    seoTitle: 'Books - Fiction, Non-Fiction & Educational',
    seoDescription: 'Explore our vast collection of books including fiction, non-fiction, and educational materials.'
  },

  // Level 2 Categories - Electronics
  {
    id: '11',
    name: 'TVs & Audio',
    slug: 'tvs-audio',
    description: 'Televisions and audio equipment',
    parentId: '1',
    level: 2,
    path: 'Electronics > TVs & Audio',
    active: true,
    order: 1,
    status: Status.ACTIVE,
    imageUrl: '/images/categories/tvs-audio.jpg',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '12',
    name: 'Computers',
    slug: 'computers',
    description: 'Laptops, desktops, and computer accessories',
    parentId: '1',
    level: 2,
    path: 'Electronics > Computers',
    active: true,
    order: 2,
    status: Status.ACTIVE,
    imageUrl: '/images/categories/computers.jpg',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '13',
    name: 'Mobile Devices',
    slug: 'mobile-devices',
    description: 'Smartphones, tablets, and accessories',
    parentId: '1',
    level: 2,
    path: 'Electronics > Mobile Devices',
    active: true,
    order: 3,
    status: Status.ACTIVE,
    imageUrl: '/images/categories/mobile-devices.jpg',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },

  // Level 3 Categories - TVs & Audio
  {
    id: '111',
    name: 'OLED TVs',
    slug: 'oled-tvs',
    description: 'Premium OLED television displays',
    parentId: '11',
    level: 3,
    path: 'Electronics > TVs & Audio > OLED TVs',
    active: true,
    order: 1,
    status: Status.ACTIVE,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '112',
    name: 'QLED TVs',
    slug: 'qled-tvs',
    description: 'Quantum dot LED televisions',
    parentId: '11',
    level: 3,
    path: 'Electronics > TVs & Audio > QLED TVs',
    active: true,
    order: 2,
    status: Status.ACTIVE,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '113',
    name: 'Soundbars',
    slug: 'soundbars',
    description: 'Home theater soundbar systems',
    parentId: '11',
    level: 3,
    path: 'Electronics > TVs & Audio > Soundbars',
    active: true,
    order: 3,
    status: Status.ACTIVE,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },

  // Level 3 Categories - Computers
  {
    id: '121',
    name: 'Laptops',
    slug: 'laptops',
    description: 'Portable computers and notebooks',
    parentId: '12',
    level: 3,
    path: 'Electronics > Computers > Laptops',
    active: true,
    order: 1,
    status: Status.ACTIVE,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '122',
    name: 'Desktops',
    slug: 'desktops',
    description: 'Desktop computers and workstations',
    parentId: '12',
    level: 3,
    path: 'Electronics > Computers > Desktops',
    active: true,
    order: 2,
    status: Status.ACTIVE,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '123',
    name: 'Tablets',
    slug: 'tablets',
    description: 'Tablet computers and e-readers',
    parentId: '12',
    level: 3,
    path: 'Electronics > Computers > Tablets',
    active: true,
    order: 3,
    status: Status.ACTIVE,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },

  // Level 3 Categories - Mobile Devices
  {
    id: '131',
    name: 'Smartphones',
    slug: 'smartphones',
    description: 'Latest smartphones and mobile phones',
    parentId: '13',
    level: 3,
    path: 'Electronics > Mobile Devices > Smartphones',
    active: true,
    order: 1,
    status: Status.ACTIVE,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '132',
    name: 'Cases & Accessories',
    slug: 'cases-accessories',
    description: 'Phone cases, chargers, and accessories',
    parentId: '13',
    level: 3,
    path: 'Electronics > Mobile Devices > Cases & Accessories',
    active: true,
    order: 2,
    status: Status.ACTIVE,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '133',
    name: 'Smartwatches',
    slug: 'smartwatches',
    description: 'Wearable smart devices and fitness trackers',
    parentId: '13',
    level: 3,
    path: 'Electronics > Mobile Devices > Smartwatches',
    active: true,
    order: 3,
    status: Status.ACTIVE,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },

  // Level 2 Categories - Clothing
  {
    id: '21',
    name: "Men's Clothing",
    slug: 'mens-clothing',
    description: 'Fashion and apparel for men',
    parentId: '2',
    level: 2,
    path: "Clothing > Men's Clothing",
    active: true,
    order: 1,
    status: Status.ACTIVE,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '22',
    name: "Women's Clothing",
    slug: 'womens-clothing',
    description: 'Fashion and apparel for women',
    parentId: '2',
    level: 2,
    path: "Clothing > Women's Clothing",
    active: true,
    order: 2,
    status: Status.ACTIVE,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '23',
    name: "Kids' Clothing",
    slug: 'kids-clothing',
    description: 'Clothing for children and babies',
    parentId: '2',
    level: 2,
    path: "Clothing > Kids' Clothing",
    active: true,
    order: 3,
    status: Status.ACTIVE,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },

  // Level 3 Categories - Men's Clothing
  {
    id: '211',
    name: 'Shirts',
    slug: 'mens-shirts',
    description: 'Dress shirts, casual shirts, and t-shirts',
    parentId: '21',
    level: 3,
    path: "Clothing > Men's Clothing > Shirts",
    active: true,
    order: 1,
    status: Status.ACTIVE,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '212',
    name: 'Pants',
    slug: 'mens-pants',
    description: 'Dress pants, jeans, and casual pants',
    parentId: '21',
    level: 3,
    path: "Clothing > Men's Clothing > Pants",
    active: true,
    order: 2,
    status: Status.ACTIVE,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '213',
    name: 'Suits',
    slug: 'mens-suits',
    description: 'Business suits and formal wear',
    parentId: '21',
    level: 3,
    path: "Clothing > Men's Clothing > Suits",
    active: true,
    order: 3,
    status: Status.ACTIVE,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  }
];

// Utility functions for category operations
export const getCategoriesByLevel = (level: 1 | 2 | 3): Category[] => {
  return mockCategories.filter(cat => cat.level === level);
};

export const getCategoryChildren = (parentId: string): Category[] => {
  return mockCategories.filter(cat => cat.parentId === parentId);
};

export const getCategoryTree = (): CategoryTree[] => {
  const level1Categories = getCategoriesByLevel(1);
  
  return level1Categories.map(cat => ({
    ...cat,
    children: getCategoryChildren(cat.id).map(level2Cat => ({
      ...level2Cat,
      children: getCategoryChildren(level2Cat.id)
    }))
  }));
};

export const findCategoryBySlug = (slug: string): Category | undefined => {
  return mockCategories.find(cat => cat.slug === slug);
};

export const findCategoryById = (id: string): Category | undefined => {
  return mockCategories.find(cat => cat.id === id);
};

export const getAllCategories = (): Category[] => {
  return mockCategories;
};
