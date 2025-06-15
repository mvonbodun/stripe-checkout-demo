'use client';

import { use } from 'react';
import { notFound } from 'next/navigation';
import { findCategoryBySlug, getAllCategories } from '../../models/category';
import Breadcrumb, { buildCategoryBreadcrumbs } from '../../components/Breadcrumb';

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = use(params);
  const category = findCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const allCategories = getAllCategories();
  const breadcrumbs = buildCategoryBreadcrumbs(category, allCategories);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                <div className="w-32 h-32 rounded-lg overflow-hidden bg-gray-200">
                  <img
                    src={category.imageUrl}
                    alt={category.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.parentElement!.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                      target.parentElement!.innerHTML = `<div class="w-full h-full flex items-center justify-center text-white font-medium">${category.name}</div>`;
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Category Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
              <dl className="space-y-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Name</dt>
                  <dd className="text-sm text-gray-900">{category.name}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Level</dt>
                  <dd className="text-sm text-gray-900">Level {category.level}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Status</dt>
                  <dd className="text-sm text-gray-900">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      category.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {category.active ? 'Active' : 'Inactive'}
                    </span>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Order</dt>
                  <dd className="text-sm text-gray-900">{category.order}</dd>
                </div>
              </dl>
            </div>

            {/* Hierarchy Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Hierarchy</h3>
              <dl className="space-y-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Full Path</dt>
                  <dd className="text-sm text-gray-900">{category.path}</dd>
                </div>
                {category.parentId && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Parent ID</dt>
                    <dd className="text-sm text-gray-900">{category.parentId}</dd>
                  </div>
                )}
              </dl>
            </div>

            {/* SEO Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">SEO</h3>
              <dl className="space-y-2">
                {category.seoTitle && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">SEO Title</dt>
                    <dd className="text-sm text-gray-900">{category.seoTitle}</dd>
                  </div>
                )}
                {category.seoDescription && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">SEO Description</dt>
                    <dd className="text-sm text-gray-900">{category.seoDescription}</dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
        </div>

        {/* Placeholder for future content */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Products</h2>
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Products Coming Soon</h3>
            <p className="text-gray-500">Product listings for this category will be displayed here.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
