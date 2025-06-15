'use client';

import Link from 'next/link';
import { Category } from '../models/category';

export interface BreadcrumbItem {
  label: string;
  href: string;
  isActive?: boolean;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

/**
 * Reusable Breadcrumb component for navigation
 * Supports category hierarchy and future product pages
 */
export default function Breadcrumb({ items, className = '' }: BreadcrumbProps) {
  return (
    <nav className={`flex ${className}`} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2 text-sm text-gray-500">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <svg
                className="flex-shrink-0 h-4 w-4 mx-2 text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            {item.isActive ? (
              <span className="text-gray-900 font-medium" aria-current="page">
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="hover:text-gray-700 transition-colors duration-200"
                title={`Go to ${item.label}`}
              >
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/**
 * Helper function to build breadcrumb items from category hierarchy
 */
export function buildCategoryBreadcrumbs(
  category: Category,
  allCategories: Category[]
): BreadcrumbItem[] {
  const items: BreadcrumbItem[] = [
    {
      label: 'Home',
      href: '/',
    },
  ];

  // Build the category hierarchy by traversing up the parent chain
  const categoryChain: Category[] = [];
  let currentCategory: Category | undefined = category;

  // Build chain from current category up to root
  while (currentCategory) {
    categoryChain.unshift(currentCategory);
    if (currentCategory.parentId) {
      currentCategory = allCategories.find(cat => cat.id === currentCategory!.parentId);
    } else {
      break;
    }
  }

  // Convert category chain to breadcrumb items
  categoryChain.forEach((cat, index) => {
    items.push({
      label: cat.name,
      href: `/c/${cat.slug}`,
      isActive: index === categoryChain.length - 1, // Last item is active
    });
  });

  return items;
}

/**
 * Helper function to build breadcrumb items for product pages (future use)
 */
export function buildProductBreadcrumbs(
  productName: string,
  productSlug: string,
  category: Category,
  allCategories: Category[]
): BreadcrumbItem[] {
  // Start with category breadcrumbs (but mark none as active)
  const categoryItems = buildCategoryBreadcrumbs(category, allCategories).map(item => ({
    ...item,
    isActive: false,
  }));

  // Add the product as the final active item
  categoryItems.push({
    label: productName,
    href: `/p/${productSlug}`, // Future product page route
    isActive: true,
  });

  return categoryItems;
}

/**
 * Helper function to build breadcrumb items from category path string (fallback)
 * This is used when we only have the path string and not the full category hierarchy
 */
export function buildBreadcrumbsFromPath(
  categoryPath: string,
  currentSlug: string
): BreadcrumbItem[] {
  const items: BreadcrumbItem[] = [
    {
      label: 'Home',
      href: '/',
    },
  ];

  const pathParts = categoryPath.split(' > ').filter(part => part.trim());
  
  pathParts.forEach((part, index) => {
    const isLast = index === pathParts.length - 1;
    
    // For now, we'll use a simplified slug generation
    // In a real app, you'd want to maintain a mapping of names to slugs
    const slug = part.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    
    items.push({
      label: part,
      href: isLast ? `/c/${currentSlug}` : `/c/${slug}`,
      isActive: isLast,
    });
  });

  return items;
}
