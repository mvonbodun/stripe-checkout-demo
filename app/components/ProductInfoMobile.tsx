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
    </div>
  );
}
