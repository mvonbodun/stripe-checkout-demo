'use client';

import Link from 'next/link';

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
 * Mobile-responsive with proper text wrapping
 */
export default function Breadcrumb({ items, className = '' }: BreadcrumbProps) {
  return (
    <nav className={`w-full ${className}`} aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-y-1 text-sm text-gray-500">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <svg
                className="flex-shrink-0 h-4 w-4 mx-1 sm:mx-2 text-gray-400"
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
              <span className="text-gray-900 font-medium break-words min-w-0 flex-shrink" aria-current="page">
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="hover:text-gray-700 transition-colors duration-200 break-words min-w-0 flex-shrink"
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
