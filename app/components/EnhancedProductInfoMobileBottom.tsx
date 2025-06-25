'use client';
import { Product } from '../models/product';
import { Item } from '../models/item';
import { ProductAttributeData } from '../utils/productAttributeData';
import ProductInfoMobileBottom from './ProductInfoMobileBottom';

interface EnhancedProductInfoMobileBottomProps {
  product: Product;
  items: Item[];
  attributeData: ProductAttributeData;
}

/**
 * Enhanced ProductInfoMobileBottom wrapper that uses pre-calculated attribute data
 * This is the Phase 3 integration component for mobile bottom layout
 */
export default function EnhancedProductInfoMobileBottom({ 
  product, 
  items, 
  attributeData 
}: EnhancedProductInfoMobileBottomProps) {
  // If we have valid pre-calculated data, use the enhanced version
  if (attributeData.hasValidData) {
    return (
      <ProductInfoMobileBottom 
        product={product}
        items={items}
        combinationMatrix={attributeData.combinationMatrix}
        allAttributes={attributeData.allAttributes}
      />
    );
  }

  // Fallback to original implementation for backward compatibility
  return (
    <ProductInfoMobileBottom 
      product={product}
      items={items}
    />
  );
}
