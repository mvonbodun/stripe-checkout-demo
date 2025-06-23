'use client';
import { useState } from 'react';
import { Product } from '../models/product';

interface ProductTabsProps {
  product: Product;
}

export default function ProductTabs({ product }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState('description');

  const tabs = [
    { id: 'description', label: 'Description' },
    { id: 'specifications', label: 'Specifications' },
    { id: 'reviews', label: 'Reviews' },
  ];

  return (
    <div className="mt-8 sm:mt-12">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-4 sm:space-x-8 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 px-2 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-4 sm:mt-6">
        {activeTab === 'description' && (
          <div className="space-y-4 sm:space-y-6">
            <div className="prose prose-sm sm:prose max-w-none">
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </div>
            {product.features && product.features.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 text-base sm:text-lg">Features:</h4>
                <ul className="space-y-2 text-sm sm:text-base text-gray-600">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <svg className="w-4 h-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {activeTab === 'specifications' && (
          <div>
            {product.productLevelSpecifications && product.productLevelSpecifications.length > 0 ? (
              <div className="space-y-6 sm:space-y-8">
                {Object.entries(
                  product.productLevelSpecifications.reduce((groups, spec) => {
                    const group = spec.group || 'General';
                    if (!groups[group]) groups[group] = [];
                    groups[group].push(spec);
                    return groups;
                  }, {} as Record<string, typeof product.productLevelSpecifications>)
                ).map(([group, specs]) => (
                  <div key={group}>
                    <h4 className="font-semibold text-gray-900 mb-3 text-base sm:text-lg">{group}</h4>
                    <div className="overflow-x-auto">
                      <dl className="space-y-2">
                        {specs.map((spec, index) => (
                          <div key={index} className="flex flex-col sm:flex-row sm:justify-between py-2 border-b border-gray-100 last:border-0">
                            <dt className="text-gray-600 font-medium text-sm sm:text-base mb-1 sm:mb-0">{spec.name}:</dt>
                            <dd className="text-gray-900 text-sm sm:text-base">{spec.value}</dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No specifications available.</p>
            )}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="text-center py-12">
            <div className="mb-4">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10m0 0V6a2 2 0 00-2-2H9a2 2 0 00-2 2v2m0 0v8a2 2 0 002 2h6a2 2 0 002-2V8M7 8v8a2 2 0 002 2h6a2 2 0 002-2V8" />
              </svg>
            </div>
            <p className="text-gray-500 mb-4">No reviews yet.</p>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors">
              Write a Review
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
