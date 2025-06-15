// Export all models and types from a central location

// Common types and utilities
export type { 
  BaseModel, 
  SEOFields, 
  MediaItem, 
  Dimensions, 
  Weight, 
  Specification 
} from './common';
export { 
  Status, 
  generateSlug, 
  formatPrice,
  DEFAULT_TAX_CODE,
  getValidTaxCode,
  TAX_CODES
} from './common';

// Category model
export * from './category';

// Product model
export * from './product';

// Item/SKU model
export * from './item';

// Re-export commonly used interfaces for convenience
export type {
  Category,
  CategoryTree
} from './category';

export type {
  Product,
  ProductWithVariants,
  ProductFilter,
  ProductSort,
  ProductVariant,
  VariantOption
} from './product';

export type {
  Item,
  ItemOption,
  ItemInventory,
  ItemPricing
} from './item';
