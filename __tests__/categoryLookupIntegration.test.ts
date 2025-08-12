/**
 * Integration test for category lookup utilities with real backend data
 */

import { findCategoryBySlug, getCategoryAlgoliaField } from '../app/utils/category-lookup';

describe('Category Lookup Integration Tests', () => {
  let realCategories: any[] = [];

  beforeAll(async () => {
    // Fetch real category data for testing
    try {
      const response = await fetch('http://localhost:3000/api/catalog-categories?tree=true');
      if (response.ok) {
        realCategories = await response.json();
      }
    } catch (error) {
      console.warn('Could not fetch real category data, skipping integration tests');
    }
  });

  it('should find real categories by slug', () => {
    if (realCategories.length === 0) {
      console.log('No real categories available, skipping test');
      return;
    }

    // Test finding level 1 category
    const menCategory = findCategoryBySlug('men', realCategories);
    expect(menCategory).not.toBeNull();
    expect(menCategory?.name).toBe('Men');
    expect(menCategory?.path).toBe('Men');

    // Test finding level 2 category
    const mensApparelCategory = findCategoryBySlug('men/mens-apparel', realCategories);
    expect(mensApparelCategory).not.toBeNull();
    expect(mensApparelCategory?.name).toBe('Mens Apparel');
    expect(mensApparelCategory?.path).toBe('Men > Mens Apparel');
  });

  it('should map real category paths to correct Algolia fields', () => {
    if (realCategories.length === 0) {
      console.log('No real categories available, skipping test');
      return;
    }

    const menCategory = findCategoryBySlug('men', realCategories);
    if (menCategory) {
      const algoliaField = getCategoryAlgoliaField(menCategory.path);
      expect(algoliaField).toEqual({
        field: 'categories.lvl0',
        value: 'Men'
      });
    }

    const mensApparelCategory = findCategoryBySlug('men/mens-apparel', realCategories);
    if (mensApparelCategory) {
      const algoliaField = getCategoryAlgoliaField(mensApparelCategory.path);
      expect(algoliaField).toEqual({
        field: 'categories.lvl1',
        value: 'Men > Mens Apparel'
      });
    }
  });

  it('should handle non-existent categories gracefully', () => {
    const result = findCategoryBySlug('non-existent-category', realCategories);
    expect(result).toBeNull();

    const result2 = findCategoryBySlug('men/non-existent-subcategory', realCategories);
    expect(result2).toBeNull();
  });
});
