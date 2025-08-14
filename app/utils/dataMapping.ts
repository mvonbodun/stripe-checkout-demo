/**
 * Data mapping utilities for converting backend product data to frontend models
 * Phase 3: Enhanced data mapping for attribute selection support
 */

import { Product, ProductVariant, ProductWithVariants, VariantOption } from '../models/product';
import { Item } from '../models/item';
import { ItemDefiningSpecificationValue } from '../models/common';
// import { Status } from '../models/common';

/**
 * Convert ProductVariant to Item format for attribute selection
 * This enables the AttributeSelector component to work with backend data
 */
export function mapProductVariantToItem(variant: ProductVariant, product: Product): Item {
  // Convert VariantOption[] to ItemDefiningSpecificationValue[]
  const itemDefiningSpecificationValues: ItemDefiningSpecificationValue[] = 
    variant.options?.map(option => ({
      name: option.name,
      value: option.value,
      displayName: option.value, // Use value as display name for now
      order: 0
    })) || [];

  return {
    // Base model fields
    id: variant.id,
    createdAt: new Date(),
    updatedAt: new Date(),

    // Item-specific fields
    productId: variant.productId || product.id,
    sku: variant.sku,
    name: variant.name,
    price: variant.price,
    compareAtPrice: variant.compareAtPrice,
    inventoryQuantity: variant.inventoryQuantity,
    inventoryTracking: variant.inventoryTracking,
    weight: variant.weight,
    dimensions: variant.dimensions,
    barcode: variant.barcode,
    status: variant.status,
    itemDefiningSpecificationValues,
    images: variant.images,
    position: variant.position,

    // Computed fields
    isInStock: variant.inventoryQuantity > 0,
    isLowStock: variant.inventoryQuantity > 0 && variant.inventoryQuantity <= 10,
    lowStockThreshold: 10
  };
}

/**
 * Convert all ProductVariants from a Product to Item[]
 */
export function mapProductVariantsToItems(product: ProductWithVariants): Item[] {
  if (!product.variants || !Array.isArray(product.variants)) {
    console.warn('Product has no variants or variants is not an array:', product);
    return [];
  }

  return product.variants.map((variant: ProductVariant) => mapProductVariantToItem(variant, product));
}

/**
 * Enhance Product data for attribute selection by ensuring proper itemDefiningSpecifications
 */
export function enhanceProductForAttributeSelection(product: ProductWithVariants): Product {
  // If the product already has itemDefiningSpecifications, return as-is
  if (product.itemDefiningSpecifications && product.itemDefiningSpecifications.length > 0) {
    return product;
  }

  // Build itemDefiningSpecifications from variant options
  const allSpecNames = new Set<string>();
  
  if (product.variants && Array.isArray(product.variants)) {
    product.variants.forEach((variant: ProductVariant) => {
      variant.options?.forEach((option: VariantOption) => {
        allSpecNames.add(option.name);
      });
    });
  }

  // Create itemDefiningSpecifications from collected spec names
  const itemDefiningSpecifications = Array.from(allSpecNames).map(specName => ({
    name: specName,
    group: getAttributeGroup(specName),
    required: true,
    order: getAttributeOrder(specName)
  }));

  return {
    ...product,
    itemDefiningSpecifications
  };
}

/**
 * Get logical grouping for an attribute name
 */
function getAttributeGroup(attributeName: string): string {
  const lowerName = attributeName.toLowerCase();
  
  if (lowerName.includes('color') || lowerName.includes('colour')) {
    return 'Appearance';
  }
  
  if (lowerName.includes('size') || lowerName.includes('length') || lowerName.includes('width') || lowerName.includes('height')) {
    return 'Size';
  }
  
  if (lowerName.includes('storage') || lowerName.includes('memory') || lowerName.includes('capacity')) {
    return 'Capacity';
  }
  
  if (lowerName.includes('material') || lowerName.includes('fabric')) {
    return 'Material';
  }
  
  return 'Product Options';
}

/**
 * Get display order for an attribute name
 */
function getAttributeOrder(attributeName: string): number {
  const lowerName = attributeName.toLowerCase();
  
  // Size usually comes first
  if (lowerName.includes('size')) return 1;
  
  // Color second
  if (lowerName.includes('color') || lowerName.includes('colour')) return 2;
  
  // Length/dimensions third
  if (lowerName.includes('length') || lowerName.includes('width') || lowerName.includes('height')) return 3;
  
  // Storage/capacity fourth
  if (lowerName.includes('storage') || lowerName.includes('memory') || lowerName.includes('capacity')) return 4;
  
  // Material fifth
  if (lowerName.includes('material') || lowerName.includes('fabric')) return 5;
  
  // Everything else
  return 10;
}

/**
 * Debug function to log data mapping results
 */
export function debugDataMapping(product: ProductWithVariants, items: Item[]) {
  console.log('=== Data Mapping Debug ===');
  console.log('Product:', {
    id: product.id,
    name: product.name,
    variantCount: product.variants?.length || 0,
    itemDefiningSpecifications: product.itemDefiningSpecifications
  });
  
  console.log('Items:', items.map(item => ({
    id: item.id,
    sku: item.sku,
    name: item.name,
    specifications: item.itemDefiningSpecificationValues
  })));
  
  console.log('=== End Debug ===');
}
