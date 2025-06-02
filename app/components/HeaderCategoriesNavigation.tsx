import React from "react";
import Link from "next/link";
import { CatalogCategory } from "../api/catalog-categories/route";

interface HeaderCategoriesNavigationProps {
  categories: CatalogCategory[];
  isLoading: boolean;
  className?: string;
}

const HeaderCategoriesNavigation: React.FC<HeaderCategoriesNavigationProps> = ({
  categories,
  isLoading,
  className = "",
}) => {
  return (
    <div className={`max-w-7xl mx-auto h-full px-6 ${className}`}>
      {isLoading ? (
        <div className="flex items-center justify-center h-full">
          <div className="animate-pulse header-nav text-sm text-gray-500">
            Loading categories...
          </div>
        </div>
      ) : (
        <nav 
          className="flex items-center justify-center space-x-2 md:space-x-8 overflow-x-auto scrollbar-hide h-full"
          role="navigation"
          aria-label="Product categories"
        >
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className="header-nav text-base text-gray-700 hover:text-blue-600 transition-colors whitespace-nowrap py-2 px-3 rounded-md hover:bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:bg-white/80"
              title={category.description || category.name}
            >
              {category.name}
            </Link>
          ))}
        </nav>
      )}
    </div>
  );
};

export default HeaderCategoriesNavigation;
