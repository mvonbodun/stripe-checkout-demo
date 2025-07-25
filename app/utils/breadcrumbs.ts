import { Category } from '../models/category';
import { BreadcrumbItem } from '../components/Breadcrumb';

/**
 * Helper function to build breadcrumb items from category hierarchy
 * Used for category pages and as base for product breadcrumbs
 */
export function buildCategoryBreadcrumbs(
  category: Category,
  allCategories: Category[]
): BreadcrumbItem[] {
  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', href: '/', isActive: false }
  ];

  // Build hierarchy by traversing up the parent chain
  const hierarchy: Category[] = [];
  let currentCategory: Category | undefined = category;

  while (currentCategory) {
    hierarchy.unshift(currentCategory);
    currentCategory = currentCategory.parentId 
      ? allCategories.find(cat => cat.id === currentCategory!.parentId)
      : undefined;
  }

  // Add each category in the hierarchy to breadcrumbs
  hierarchy.forEach((cat, index) => {
    breadcrumbs.push({
      label: cat.name,
      href: `/c/${cat.slug}`,
      isActive: index === hierarchy.length - 1 // Only the current category is active
    });
  });

  return breadcrumbs;
}

/**
 * Helper function to build breadcrumb items for product pages
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
    href: `/p/${productSlug}`,
    isActive: true,
  });

  return categoryItems;
}

/**
 * Helper function to build breadcrumb items from category path string (fallback)
 * This is used when we only have the path string and not the full category hierarchy
 */
export function buildBreadcrumbsFromPath(
  path: string,
  currentLabel?: string
): BreadcrumbItem[] {
  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', href: '/', isActive: false }
  ];

  const pathSegments = path.split('/').filter(Boolean);
  
  pathSegments.forEach((segment, index) => {
    const isLast = index === pathSegments.length - 1;
    const href = `/${pathSegments.slice(0, index + 1).join('/')}`;
    
    breadcrumbs.push({
      label: currentLabel && isLast ? currentLabel : segment.charAt(0).toUpperCase() + segment.slice(1),
      href,
      isActive: isLast
    });
  });

  return breadcrumbs;
}
