'use client';
import { Product } from '../models/product';
import ProductRatingAndQA from './ProductRatingAndQA';

interface ProductInfoMobileProps {
  product: Product;
}

export default function ProductInfoMobile({ product }: ProductInfoMobileProps) {
  return (
    <div className="space-y-4">
      {/* Brand */}
      {product.brand && (
        <div className="text-xs text-gray-600 uppercase tracking-wide font-medium">
          {product.brand}
        </div>
      )}
      
      {/* Product Name */}
      <h1 className="text-2xl font-bold text-gray-900 leading-tight">
        {product.name}
      </h1>
      
      {/* Star Rating & Q&A */}
      <ProductRatingAndQA />
      
      {/* Stock Status - General product availability */}
      <div className="flex items-center space-x-2">
        {product.inStock && (product.totalInventory ? product.totalInventory > 0 : true) ? (
          <>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-green-700 font-medium">
              {product.totalInventory && product.totalInventory > 0 && product.totalInventory <= 10 
                ? `Only ${product.totalInventory} left` 
                : 'In Stock'
              }
            </span>
          </>
        ) : (
          <>
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-sm text-red-700 font-medium">Out of Stock</span>
          </>
        )}
      </div>
    </div>
  );
}
