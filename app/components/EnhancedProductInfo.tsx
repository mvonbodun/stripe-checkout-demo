'use client';
import { Product } from '../models/product';
import { Item } from '../models/item';
import { ProductAttributeData } from '../utils/productAttributeData';
import ProductInfo from './ProductInfo';

interface EnhancedProductInfoProps {
  product: Product;
  items: Item[];
  attributeData: ProductAttributeData;
}

/**
 * Enhanced ProductInfo wrapper that uses pre-calculated attribute data
 * This is the Phase 3 integration component
 */
export default function EnhancedProductInfo({ 
  product, 
  items, 
  attributeData 
}: EnhancedProductInfoProps) {
  // If we have valid pre-calculated data, use the enhanced version
  if (attributeData.hasValidData) {
    return (
      <ProductInfo 
        product={product}
        items={items}
        combinationMatrix={attributeData.combinationMatrix}
        allAttributes={attributeData.allAttributes}
      />
    );
  }

  // Fallback to original implementation for backward compatibility
  return (
    <ProductInfo 
      product={product}
      items={items}
    />
  );
}
