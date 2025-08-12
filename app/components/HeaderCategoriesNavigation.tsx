'use client';

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { CategoryTree } from "../models/category";
import { useCategories } from "../categories-context";

interface HeaderCategoriesNavigationProps {
  categories: CategoryTree[];
  isLoading: boolean;
  className?: string;
}

interface MarketingItem {
  title: string;
  description: string;
  imageUrl: string;
  linkUrl: string;
  badge?: string;
}

const HeaderCategoriesNavigation: React.FC<HeaderCategoriesNavigationProps> = ({
  categories,
  isLoading,
  className = "",
}) => {
  const { buildCategoryUrl } = useCategories();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Sample marketing items for the dropdown
  const marketingItems: MarketingItem[] = [
    {
      title: "New Arrivals",
      description: "Latest products just in",
      imageUrl: "https://placehold.co/300x200/e5e7eb/6b7280?text=New+Arrivals",
      linkUrl: "/new-arrivals",
      badge: "NEW"
    },
    {
      title: "Best Sellers",
      description: "Most popular items",
      imageUrl: "https://placehold.co/300x200/e5e7eb/6b7280?text=Best+Sellers",
      linkUrl: "/bestsellers"
    },
    {
      title: "Sale Items",
      description: "Up to 50% off",
      imageUrl: "https://placehold.co/300x200/e5e7eb/6b7280?text=Sale+Items",
      linkUrl: "/sale",
      badge: "SALE"
    }
  ];

  const handleMouseEnter = (categoryId: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (!isNavigating) {
      setHoveredCategory(categoryId);
      setActiveDropdown(categoryId);
    }
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setHoveredCategory(null);
      setActiveDropdown(null);
    }, 150); // Small delay to allow moving to dropdown
  };

  const handleDropdownMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const handleDropdownMouseLeave = () => {
    setHoveredCategory(null);
    setActiveDropdown(null);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
        setHoveredCategory(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Function to close dropdown when navigating
  const handleCategoryClick = (e: React.MouseEvent) => {
    setActiveDropdown(null);
    setHoveredCategory(null);
    setIsNavigating(true);
    
    // Force blur the clicked element to remove focus state
    const target = e.currentTarget as HTMLElement;
    target.blur();
    
    // Reset navigation state after a short delay to allow page navigation
    setTimeout(() => {
      setIsNavigating(false);
    }, 500);
  };

  // Handle blur to clear focus states
  const handleBlur = () => {
    setHoveredCategory(null);
    setActiveDropdown(null);
  };

  // Filter to only show level 1 categories
  const level1Categories = categories.filter(cat => cat.level === 1);

  return (
    <div className={`relative max-w-7xl mx-auto h-full px-6 ${className}`} ref={dropdownRef}>
      {isLoading ? (
        <div className="flex items-center justify-center h-full">
          <div className="animate-pulse header-nav text-sm text-gray-500">
            Loading categories...
          </div>
        </div>
      ) : (
        <>
          <nav 
            className="flex items-center justify-center space-x-8 h-full"
            role="navigation"
            aria-label="Product categories"
          >
            {level1Categories.map((category) => (
              <div
                key={category.id}
                className="relative"
                onMouseEnter={() => handleMouseEnter(category.id)}
                onMouseLeave={handleMouseLeave}
              >
                <Link
                  href={buildCategoryUrl(category)}
                  className={`
                    header-nav text-base font-medium text-gray-700 hover:text-blue-600 
                    transition-all duration-200 whitespace-nowrap py-4 px-3 
                    focus:outline-none relative block
                    ${hoveredCategory === category.id && !isNavigating ? 'text-blue-600' : ''}
                    ${isNavigating ? 'pointer-events-none' : ''}
                  `}
                  title={category.description || category.name}
                  onClick={handleCategoryClick}
                  onBlur={handleBlur}
                >
                  {category.name}
                  {/* Hover underline */}
                  <span 
                    className={`
                      absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 
                      transform transition-transform duration-200 origin-left
                      ${hoveredCategory === category.id && !isNavigating ? 'scale-x-100' : 'scale-x-0'}
                    `}
                  />
                </Link>
              </div>
            ))}
          </nav>

          {/* Dropdown Menu */}
          {activeDropdown && (
            <div 
              className="absolute top-full left-0 right-0 bg-white shadow-xl border-t border-gray-200 z-50"
              onMouseEnter={handleDropdownMouseEnter}
              onMouseLeave={handleDropdownMouseLeave}
            >
              <div className="max-w-7xl mx-auto px-6 py-8">
                {(() => {
                  const activeCategory = level1Categories.find(cat => cat.id === activeDropdown);
                  if (!activeCategory || !activeCategory.children?.length) return null;

                  return (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                      {/* Level 2 Categories with their Level 3 children */}
                      {activeCategory.children.map((level2Category) => (
                        <div key={level2Category.id} className="space-y-4">
                          <Link
                            href={buildCategoryUrl(level2Category)}
                            className="block text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                            onClick={handleCategoryClick}
                            onBlur={handleBlur}
                          >
                            {level2Category.name}
                          </Link>
                          
                          {/* Level 3 Categories */}
                          {level2Category.children && level2Category.children.length > 0 && (
                            <ul className="space-y-2">
                              {level2Category.children.map((level3Category) => (
                                <li key={level3Category.id}>
                                  <Link
                                    href={buildCategoryUrl(level3Category)}
                                    className="block text-sm text-gray-600 hover:text-blue-600 transition-colors py-1"
                                    onClick={handleCategoryClick}
                                    onBlur={handleBlur}
                                  >
                                    {level3Category.name}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}

                      {/* Marketing Column */}
                      <div className="space-y-4 border-l border-gray-200 pl-8">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Featured</h3>
                        {marketingItems.map((item, index) => (
                          <Link
                            key={index}
                            href={item.linkUrl}
                            className="block group hover:bg-gray-50 rounded-lg p-3 transition-colors"
                          >
                            <div className="flex items-start space-x-3">
                              <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                                <img 
                                  src={item.imageUrl} 
                                  alt={item.title}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = 'none';
                                    target.parentElement!.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                                  }}
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-2">
                                  <h4 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                                    {item.title}
                                  </h4>
                                  {item.badge && (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                                      {item.badge}
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-gray-500 mt-1">{item.description}</p>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default HeaderCategoriesNavigation;
