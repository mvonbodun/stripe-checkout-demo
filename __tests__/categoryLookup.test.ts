import {
  parseCategorySlug,
  findCategoryBySlugPath,
  findCategoryBySlug,
  getCategoryAlgoliaField,
  buildCategorySlugUrl,
  getCategoryBreadcrumbPath,
  getCategoryLevel,
  isValidCategoryPath,
  hasChildren,
  getCategoryChildren
} from '../app/utils/category-lookup';
import { CategoryTree } from '../app/models/category';
import { Status } from '../app/models/common';

// Mock category data for testing
const mockCategories: CategoryTree[] = [
  {
    id: '1',
    name: 'Men',
    slug: 'men',
    level: 1,
    path: 'Men',
    active: true,
    order: 1,
    status: Status.ACTIVE,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    seoTitle: 'Men - Shop Collection',
    seoDescription: 'Browse our Men collection.',
    children: [
      {
        id: '2',
        name: 'Mens Apparel',
        slug: 'men/mens-apparel',
        level: 2,
        path: 'Men > Mens Apparel',
        active: true,
        order: 1,
        status: Status.ACTIVE,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        seoTitle: 'Mens Apparel',
        seoDescription: 'Browse our Mens Apparel collection.',
        children: [
          {
            id: '3',
            name: 'Casual Short Sleeve Shirts',
            slug: 'men/mens-apparel/casual-short-sleeve-shirts',
            level: 3,
            path: 'Men > Mens Apparel > Casual Short Sleeve Shirts',
            active: true,
            order: 1,
            status: Status.ACTIVE,
            createdAt: new Date('2024-01-01'),
            updatedAt: new Date('2024-01-01'),
            seoTitle: 'Casual Short Sleeve Shirts',
            seoDescription: 'Browse our Casual Short Sleeve Shirts collection.'
          }
        ]
      },
      {
        id: '4',
        name: 'Accessories',
        slug: 'men/accessories',
        level: 2,
        path: 'Men > Accessories',
        active: true,
        order: 2,
        status: Status.ACTIVE,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        seoTitle: 'Mens Accessories',
        seoDescription: 'Browse our Mens Accessories collection.'
      }
    ]
  },
  {
    id: '5',
    name: 'Women',
    slug: 'women',
    level: 1,
    path: 'Women',
    active: true,
    order: 2,
    status: Status.ACTIVE,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    seoTitle: 'Women - Shop Collection',
    seoDescription: 'Browse our Women collection.'
  }
];

describe('Category Lookup Utilities', () => {
  describe('parseCategorySlug', () => {
    it('should parse single level slug', () => {
      expect(parseCategorySlug('men')).toEqual(['men']);
    });

    it('should parse multi-level slug', () => {
      expect(parseCategorySlug('men/mens-apparel/casual-short-sleeve-shirts'))
        .toEqual(['men', 'mens-apparel', 'casual-short-sleeve-shirts']);
    });

    it('should handle leading and trailing slashes', () => {
      expect(parseCategorySlug('/men/mens-apparel/')).toEqual(['men', 'mens-apparel']);
    });

    it('should return empty array for empty string', () => {
      expect(parseCategorySlug('')).toEqual([]);
      expect(parseCategorySlug('   ')).toEqual([]);
    });
  });

  describe('findCategoryBySlugPath', () => {
    it('should find level 1 category', () => {
      const result = findCategoryBySlugPath(['men'], mockCategories);
      expect(result).not.toBeNull();
      expect(result?.name).toBe('Men');
      expect(result?.slug).toBe('men');
    });

    it('should find level 2 category', () => {
      const result = findCategoryBySlugPath(['men', 'mens-apparel'], mockCategories);
      expect(result).not.toBeNull();
      expect(result?.name).toBe('Mens Apparel');
      expect(result?.slug).toBe('men/mens-apparel');
    });

    it('should find level 3 category', () => {
      const result = findCategoryBySlugPath(['men', 'mens-apparel', 'casual-short-sleeve-shirts'], mockCategories);
      expect(result).not.toBeNull();
      expect(result?.name).toBe('Casual Short Sleeve Shirts');
      expect(result?.slug).toBe('men/mens-apparel/casual-short-sleeve-shirts');
    });

    it('should return null for non-existent category', () => {
      const result = findCategoryBySlugPath(['men', 'non-existent'], mockCategories);
      expect(result).toBeNull();
    });

    it('should return null for empty slug path', () => {
      const result = findCategoryBySlugPath([], mockCategories);
      expect(result).toBeNull();
    });
  });

  describe('findCategoryBySlug', () => {
    it('should find category by complete slug', () => {
      const result = findCategoryBySlug('men/mens-apparel', mockCategories);
      expect(result).not.toBeNull();
      expect(result?.name).toBe('Mens Apparel');
    });
  });

  describe('getCategoryAlgoliaField', () => {
    it('should map level 1 path to categories.lvl0', () => {
      const result = getCategoryAlgoliaField('Men');
      expect(result).toEqual({
        field: 'categories.lvl0',
        value: 'Men'
      });
    });

    it('should map level 2 path to categories.lvl1', () => {
      const result = getCategoryAlgoliaField('Men > Mens Apparel');
      expect(result).toEqual({
        field: 'categories.lvl1',
        value: 'Men > Mens Apparel'
      });
    });

    it('should map level 3 path to categories.lvl2', () => {
      const result = getCategoryAlgoliaField('Men > Mens Apparel > Casual Short Sleeve Shirts');
      expect(result).toEqual({
        field: 'categories.lvl2',
        value: 'Men > Mens Apparel > Casual Short Sleeve Shirts'
      });
    });

    it('should throw error for unsupported depth', () => {
      expect(() => getCategoryAlgoliaField('A > B > C > D')).toThrow('Unsupported category depth: 4 levels');
    });

    it('should throw error for empty path', () => {
      expect(() => getCategoryAlgoliaField('')).toThrow('Category path cannot be empty');
    });
  });

  describe('buildCategorySlugUrl', () => {
    it('should build URL from category slug', () => {
      const category = mockCategories[0].children![0]; // Men > Mens Apparel
      const result = buildCategorySlugUrl(category);
      expect(result).toBe('/c/men/mens-apparel');
    });

    it('should throw error for category without slug', () => {
      const invalidCategory = { ...mockCategories[0], slug: '' };
      expect(() => buildCategorySlugUrl(invalidCategory)).toThrow('Category must have a slug to build URL');
    });
  });

  describe('getCategoryBreadcrumbPath', () => {
    it('should get breadcrumb path for level 3 category', () => {
      const level3Category = mockCategories[0].children![0].children![0]; // Casual Short Sleeve Shirts
      const breadcrumbs = getCategoryBreadcrumbPath(level3Category, mockCategories);
      
      expect(breadcrumbs).toHaveLength(3);
      expect(breadcrumbs[0].name).toBe('Men');
      expect(breadcrumbs[1].name).toBe('Mens Apparel');
      expect(breadcrumbs[2].name).toBe('Casual Short Sleeve Shirts');
    });

    it('should get breadcrumb path for level 1 category', () => {
      const level1Category = mockCategories[0]; // Men
      const breadcrumbs = getCategoryBreadcrumbPath(level1Category, mockCategories);
      
      expect(breadcrumbs).toHaveLength(1);
      expect(breadcrumbs[0].name).toBe('Men');
    });
  });

  describe('getCategoryLevel', () => {
    it('should return correct level for different paths', () => {
      expect(getCategoryLevel('Men')).toBe(1);
      expect(getCategoryLevel('Men > Mens Apparel')).toBe(2);
      expect(getCategoryLevel('Men > Mens Apparel > Casual Shirts')).toBe(3);
    });

    it('should throw error for invalid levels', () => {
      expect(() => getCategoryLevel('')).toThrow('Invalid category level');
      expect(() => getCategoryLevel('A > B > C > D')).toThrow('Invalid category level');
    });
  });

  describe('isValidCategoryPath', () => {
    it('should validate correct category paths', () => {
      expect(isValidCategoryPath('Men')).toBe(true);
      expect(isValidCategoryPath('Men > Mens Apparel')).toBe(true);
      expect(isValidCategoryPath('Men > Mens Apparel > Casual Shirts')).toBe(true);
    });

    it('should reject invalid category paths', () => {
      expect(isValidCategoryPath('')).toBe(false);
      expect(isValidCategoryPath('A > B > C > D')).toBe(false);
    });
  });

  describe('hasChildren and getCategoryChildren', () => {
    it('should correctly identify categories with children', () => {
      const menCategory = mockCategories[0];
      const womenCategory = mockCategories[1];
      
      expect(hasChildren(menCategory)).toBe(true);
      expect(hasChildren(womenCategory)).toBe(false);
    });

    it('should get children correctly', () => {
      const menCategory = mockCategories[0];
      const children = getCategoryChildren(menCategory);
      
      expect(children).toHaveLength(2);
      expect(children[0].name).toBe('Mens Apparel');
      expect(children[1].name).toBe('Accessories');
    });

    it('should return empty array for categories without children', () => {
      const womenCategory = mockCategories[1];
      const children = getCategoryChildren(womenCategory);
      
      expect(children).toEqual([]);
    });
  });
});
