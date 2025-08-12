import { CategoryTree } from '../models/category';

/**
 * Category Lookup Utilities
 * Handles slug parsing, category finding, and Algolia field mapping
 */

export interface AlgoliaField {
  field: string;
  value: string;
}

/**
 * Parse a multi-level category slug into an array of slug parts
 * Example: "men/mens-apparel/casual-shirts" -> ["men", "mens-apparel", "casual-shirts"]
 */
export function parseCategorySlug(slug: string): string[] {
  if (!slug || slug.trim() === '') {
    return [];
  }
  
  // Remove leading/trailing slashes and split
  return slug.replace(/^\/+|\/+$/g, '').split('/').filter(part => part.length > 0);
}

/**
 * Find a category by following the slug path through the category hierarchy
 * Supports 1-3 level deep category navigation
 */
export function findCategoryBySlugPath(
  slugPath: string[], 
  categories: CategoryTree[]
): CategoryTree | null {
  if (!slugPath.length || !categories.length) {
    return null;
  }

  // Start with top-level categories
  let currentCategories = categories;
  let foundCategory: CategoryTree | null = null;
  
  for (let i = 0; i < slugPath.length; i++) {
    const currentSlugPart = slugPath[i];
    
    // For the current level, we need to match the slug
    // Level 1: match against "men"
    // Level 2: match against "men/mens-apparel" 
    // Level 3: match against "men/mens-apparel/casual-shirts"
    const expectedSlug = i === 0 
      ? currentSlugPart 
      : slugPath.slice(0, i + 1).join('/');
    
    foundCategory = currentCategories.find(cat => cat.slug === expectedSlug) || null;
    
    if (!foundCategory) {
      // Category not found at this level
      return null;
    }
    
    // If we're not at the end of the path, move to children for next iteration
    if (i < slugPath.length - 1) {
      if (!foundCategory.children || foundCategory.children.length === 0) {
        // Expected to find children but none exist
        return null;
      }
      currentCategories = foundCategory.children;
    }
  }
  
  return foundCategory;
}

/**
 * Find a category by its complete slug (convenience method)
 * Example: findCategoryBySlug("men/mens-apparel", categories)
 */
export function findCategoryBySlug(
  slug: string, 
  categories: CategoryTree[]
): CategoryTree | null {
  const slugPath = parseCategorySlug(slug);
  return findCategoryBySlugPath(slugPath, categories);
}

/**
 * Map a category path to the appropriate Algolia field and value
 * Based on the number of levels in the path
 */
export function getCategoryAlgoliaField(categoryPath: string): AlgoliaField {
  if (!categoryPath || categoryPath.trim() === '') {
    throw new Error('Category path cannot be empty');
  }
  
  const levels = categoryPath.split(' > ').filter(part => part.trim().length > 0);
  const levelCount = levels.length;
  
  switch (levelCount) {
    case 1:
      return { 
        field: 'categories.lvl0', 
        value: categoryPath.trim() 
      };
    case 2:
      return { 
        field: 'categories.lvl1', 
        value: categoryPath.trim() 
      };
    case 3:
      return { 
        field: 'categories.lvl2', 
        value: categoryPath.trim() 
      };
    default:
      throw new Error(`Unsupported category depth: ${levelCount} levels. Supported: 1-3 levels.`);
  }
}

/**
 * Build a URL-friendly slug from a category's hierarchical position
 * Uses the category's existing slug which should already be in the correct format
 */
export function buildCategorySlugUrl(category: CategoryTree): string {
  if (!category.slug) {
    throw new Error('Category must have a slug to build URL');
  }
  
  // Category slugs from backend should already be in the format:
  // Level 1: "men"
  // Level 2: "men/mens-apparel"  
  // Level 3: "men/mens-apparel/casual-shirts"
  return `/c/${category.slug}`;
}

/**
 * Get all parent categories for breadcrumb navigation
 * Returns array from root to the specified category (inclusive)
 */
export function getCategoryBreadcrumbPath(
  targetCategory: CategoryTree,
  allCategories: CategoryTree[]
): CategoryTree[] {
  const breadcrumbs: CategoryTree[] = [];
  const slugParts = parseCategorySlug(targetCategory.slug);
  
  // Build breadcrumb by finding each level
  for (let i = 0; i < slugParts.length; i++) {
    const partialSlugPath = slugParts.slice(0, i + 1);
    const category = findCategoryBySlugPath(partialSlugPath, allCategories);
    
    if (category) {
      breadcrumbs.push(category);
    }
  }
  
  return breadcrumbs;
}

/**
 * Validate if a category path can be used with Algolia
 */
export function isValidCategoryPath(categoryPath: string): boolean {
  try {
    getCategoryAlgoliaField(categoryPath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get child categories for a given category
 * Useful for showing subcategory navigation
 */
export function getCategoryChildren(category: CategoryTree): CategoryTree[] {
  return category.children || [];
}

/**
 * Check if a category has children
 */
export function hasChildren(category: CategoryTree): boolean {
  return Boolean(category.children && category.children.length > 0);
}

/**
 * Get the category level based on the path structure
 */
export function getCategoryLevel(categoryPath: string): 1 | 2 | 3 {
  const levels = categoryPath.split(' > ').filter(part => part.trim().length > 0);
  const levelCount = levels.length;
  
  if (levelCount < 1 || levelCount > 3) {
    throw new Error(`Invalid category level: ${levelCount}. Must be 1-3.`);
  }
  
  return levelCount as 1 | 2 | 3;
}
