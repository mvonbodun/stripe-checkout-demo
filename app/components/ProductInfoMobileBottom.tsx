'use client';
import { useState } from 'react';
import { Product } from '../models/product';
import QuantitySelector from './QuantitySelector';
import AddToCartButton from './AddToCartButton';
import AttributeSelector from './AttributeSelector';

interface ProductInfoMobileBottomProps {
  product: Product;
}

export default function ProductInfoMobileBottom({ product }: ProductInfoMobileBottomProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});

  return (
    <div className="space-y-4">
      {/* Attribute Selectors (Size, Color, etc.) */}
      <div className="pt-4">
        <AttributeSelector 
          product={product}
          selectedOptions={selectedOptions}
          onOptionsChange={setSelectedOptions}
        />
      </div>
      
      {/* Quantity & Add to Cart */}
      <div className="flex items-center space-x-4 pt-4">
        <div className="flex-shrink-0">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quantity
          </label>
          <QuantitySelector
            initialQuantity={quantity}
            onChange={setQuantity}
            className="w-20"
            max={product.totalInventory || 99}
          />
        </div>
        
        <div className="flex-1">
          <AddToCartButton
            product={product}
            quantity={quantity}
            selectedOptions={selectedOptions}
            className="w-full"
          />
        </div>
      </div>
      
      {/* Trust Icons */}
      <div className="flex items-center justify-center space-x-4 text-xs text-gray-500 border-t pt-4">
        <div className="flex items-center space-x-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <span>Secure Checkout</span>
        </div>
        <div className="flex items-center space-x-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
          <span>Free Returns</span>
        </div>
        <div className="flex items-center space-x-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <span>Fast Shipping</span>
        </div>
      </div>
      
      {/* Product Details */}
      <div className="border-t pt-4 space-y-2 text-sm text-gray-600">
        <div className="flex justify-between">
          <span>SKU:</span>
          <span className="font-mono text-xs">{product.id}</span>
        </div>
        {product.weight && (
          <div className="flex justify-between">
            <span>Weight:</span>
            <span>{product.weight.value} {product.weight.unit}</span>
          </div>
        )}
        {product.dimensions && (
          <div className="flex justify-between">
            <span>Dimensions:</span>
            <span>{product.dimensions.length} × {product.dimensions.width} × {product.dimensions.height} {product.dimensions.unit}</span>
          </div>
        )}
      </div>
    </div>
  );
}
