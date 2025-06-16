'use client';

import { use, useState } from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { findCategoryBySlug, getAllCategories, getAllCategoryIdsInHierarchy } from '../../models/category';
import { getProductsByCategoryHierarchy, Product } from '../../models/product';
import { useCart } from '../../cart-context';
import { useMiniCartUI } from '../../mini-cart-ui-context';
import Breadcrumb, { buildCategoryBreadcrumbs } from '../../components/Breadcrumb';
import ProductCard from '../../components/ProductCard';

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = use(params);
  const category = findCategoryBySlug(slug);
  const { dispatch } = useCart();
  const { openMiniCart } = useMiniCartUI();
  const [imageError, setImageError] = useState(false);

  if (!category) {
    notFound();
  }

  const allCategories = getAllCategories();
  const breadcrumbs = buildCategoryBreadcrumbs(category, allCategories);

  // Get products based on category hierarchy
  const categoryIds = getAllCategoryIdsInHierarchy(category.id);
  const products = getProductsByCategoryHierarchy(categoryIds);

  // Function to handle adding product to cart
  const handleAddToCart = (product: Product) => {
    // Create placeholder image for cart item (consistent with home page)
    const placeholderImage = `https://placehold.co/100x100/e5e7eb/6b7280?text=${encodeURIComponent(product.name.split(' ').slice(0, 2).join(' '))}`;
    
    const cartItem = {
      id: crypto.randomUUID(),
      product_id: product.id,
      name: product.name,
      price: product.basePrice,
      quantity: 1,
      image: placeholderImage, // Use placeholder like home page
      attributes: product.features?.slice(0, 3) || [], // Use features as attributes
      line_subtotal: product.basePrice,
      line_shipping_total: 0,
      line_tax_total: 0,
      line_shipping_tax_total: 0,
      line_grand_total: product.basePrice,
    };
    
    dispatch({ type: 'ADD_ITEM', item: cartItem });
    openMiniCart(); // Open the mini cart after adding the item
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {/* Breadcrumb */}
          <Breadcrumb items={breadcrumbs} className="mb-4" />

          {/* Category Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-4">
                <h1 className="text-3xl font-bold text-gray-900">{category.name}</h1>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  Level {category.level}
                </span>
              </div>
              
              {category.description && (
                <p className="text-lg text-gray-600 max-w-3xl leading-relaxed">
                  {category.description}
                </p>
              )}
              
              {/* Category Stats */}
              <div className="mt-6 flex items-center space-x-6 text-sm text-gray-500">
                <span>Category ID: {category.id}</span>
                <span>Slug: {category.slug}</span>
                {category.productCount && (
                  <span>{category.productCount} products</span>
                )}
              </div>
            </div>

            {/* Category Image */}
            {category.imageUrl && (
              <div className="ml-8 flex-shrink-0">
                <div className="w-32 h-32 rounded-lg overflow-hidden relative">
                  {!imageError ? (
                    <Image
                      src={category.imageUrl}
                      alt={category.name}
                      fill
                      className="object-cover"
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <div 
                      className="w-full h-full flex items-center justify-center text-white font-medium text-sm text-center px-2"
                      style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                      }}
                    >
                      {category.name}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Products Section */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">Products in {category.name}</h2>
            <span className="text-sm text-gray-500">
              {products.length} {products.length === 1 ? 'product' : 'products'} found
            </span>
          </div>
          
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Products Found</h3>
              <p className="text-gray-500">
                {category.level === 3 
                  ? "No products are currently assigned to this category."
                  : "No products found in any subcategories of this category."
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
