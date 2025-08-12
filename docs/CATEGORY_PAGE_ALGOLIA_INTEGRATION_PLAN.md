# Category Page Algolia Integration Plan

## Overview
Transform the current mock-data category page `/app/c/[slug]` to use the backend service categories and integrate with Algolia search for product results. The page should behave like a pre-filtered search results page.

## Current State Analysis
- **Current slug format**: Single level (e.g., `/c/electronics`)
- **Target slug format**: Multi-level hierarchy (e.g., `/c/men/mens-apparel/casual-short-sleeve-shirts`)
- **Current data source**: Mock categories and products
- **Target data source**: Backend service categories + Algolia search results
- **Current UI**: Custom category page layout
- **Target UI**: Reuse SearchInterface component with pre-applied filters

## Core Requirements

### 1. Slug to Path Mapping
- Parse dynamic multi-level slugs: `/c/level1/level2/level3`
- Map slug to category path from backend service
- Handle 1-3 level category hierarchies
- Category path format: "Level1 > Level2 > Level3"

### 2. Algolia Integration
- Map category path to appropriate Algolia field:
  - 1 level: `categories.lvl0` (e.g., "Men")
  - 2 levels: `categories.lvl1` (e.g., "Men > Mens Apparel") 
  - 3 levels: `categories.lvl2` (e.g., "Men > Mens Apparel > Casual Short Sleeve Shirts")
- Pre-apply category filter before page render to prevent flickering
- Reuse existing SearchInterface component

### 3. Performance & UX
- No flickering: Results should be filtered from initial render
- Maintain breadcrumb navigation
- Show category metadata (name, description, image)
- Handle non-existent categories gracefully

## Implementation Plan

### Phase 1: Category Lookup Infrastructure

#### 1.1 Create Category Lookup Utilities
**File**: `/app/utils/category-lookup.ts`
- `parseCategorySlug(slug: string): string[]` - Parse multi-level slug
- `findCategoryBySlugPath(slugPath: string[], categories: CategoryTree[]): CategoryTree | null` - Find category by slug hierarchy
- `getCategoryAlgoliaField(categoryPath: string): { field: string, value: string }` - Map path to Algolia field
- `buildCategorySlugUrl(category: CategoryTree): string` - Generate proper slug URLs

#### 1.2 Enhanced Categories Context
**File**: `/app/categories-context.tsx` (modify existing)
- Add category lookup methods to context
- Add slug-to-category mapping cache
- Add helper methods for category navigation

### Phase 2: SearchInterface Enhancement

#### 2.1 Create Category-Aware SearchInterface
**File**: `/app/components/search/CategorySearchInterface.tsx`
- Extend SearchInterface to accept initial category filter
- Apply category filter during instantsearch configuration
- Hide/modify category facets to show only subcategories
- Add category header section (breadcrumbs, title, description)

#### 2.2 Pre-filter Implementation
- Use Algolia's `configure` widget to set initial filters
- Apply category filter before instantsearch initialization
- Ensure no flash of unfiltered results

### Phase 3: New Category Page Implementation

#### 3.1 Route Handler Enhancement
**File**: `/app/c/[...slug]/page.tsx` (change to catch-all route)
- Parse multi-level slug using `[...slug]` dynamic route
- Lookup category from backend service via categories context
- Handle 404 for non-existent categories
- Pass category data to CategorySearchInterface

#### 3.2 Category Page Layout
- Reuse CategorySearchInterface component
- Add category-specific header (breadcrumbs, title, description, image)
- Maintain SEO metadata for categories
- Handle empty state when no products found

### Phase 4: URL Generation Updates

#### 4.1 Update Navigation Components
**Files**: `/app/components/HeaderCategoriesNavigation.tsx`, etc.
- Update category URL generation to use new multi-level format
- Ensure all category links use proper slug hierarchy
- Update category menu to reflect new URL structure

#### 4.2 Breadcrumb Updates
**File**: `/app/utils/breadcrumbs.ts`
- Update breadcrumb generation for new category URLs
- Ensure proper linking for each breadcrumb level

## Technical Implementation Details

### Category Lookup Algorithm
```typescript
// Pseudo-code for category lookup
function findCategoryBySlugPath(slugPath: string[], categories: CategoryTree[]): CategoryTree | null {
  // Start with level 1 categories
  let currentCategories = categories;
  let foundCategory: CategoryTree | null = null;
  
  for (let i = 0; i < slugPath.length; i++) {
    const slug = slugPath[i];
    foundCategory = currentCategories.find(cat => 
      cat.slug === (i === 0 ? slug : `${slugPath.slice(0, i+1).join('/')}`));
    
    if (!foundCategory) return null;
    
    // Move to next level
    if (foundCategory.children && i < slugPath.length - 1) {
      currentCategories = foundCategory.children;
    }
  }
  
  return foundCategory;
}
```

### Algolia Filter Strategy
```typescript
// Prevent flickering by applying filter during instantsearch config
const searchClient = algoliasearch(appId, apiKey);

const categoryFilter = getCategoryAlgoliaField(categoryPath);

// Configure instantsearch with initial filter
<InstantSearch
  searchClient={searchClient}
  indexName="products"
  initialUiState={{
    products: {
      configure: {
        filters: `${categoryFilter.field}:"${categoryFilter.value}"`
      }
    }
  }}
>
```

### Path to Algolia Field Mapping
```typescript
function getCategoryAlgoliaField(categoryPath: string): { field: string, value: string } {
  const levels = categoryPath.split(' > ').length;
  
  switch (levels) {
    case 1:
      return { field: 'categories.lvl0', value: categoryPath };
    case 2:
      return { field: 'categories.lvl1', value: categoryPath };
    case 3:
      return { field: 'categories.lvl2', value: categoryPath };
    default:
      throw new Error(`Unsupported category depth: ${levels}`);
  }
}
```

## File Structure Changes

### New Files
- `/app/utils/category-lookup.ts` - Category lookup utilities
- `/app/components/search/CategorySearchInterface.tsx` - Category-aware search interface
- `/app/c/[...slug]/page.tsx` - New multi-level category page (replaces `[slug]`)

### Modified Files
- `/app/categories-context.tsx` - Add lookup utilities
- `/app/components/HeaderCategoriesNavigation.tsx` - Update URL generation
- `/app/utils/breadcrumbs.ts` - Update for new URL structure

### Removed Files
- `/app/c/[slug]/` - **✅ REMOVED** - Old single-level route replaced by catch-all route

## Testing Strategy

### Unit Tests
- Category slug parsing
- Category lookup logic
- Path to Algolia field mapping

### Integration Tests
- Category page rendering with real backend data
- Algolia integration with category filters
- Navigation between category levels

### E2E Tests
- Category navigation flow
- Search results filtering by category
- Breadcrumb navigation

## Migration Strategy

### Phase 1: Backward Compatibility
- Keep existing `/c/[slug]` route temporarily
- Add redirect logic for old single-level URLs
- Implement new utilities and components

### Phase 2: Gradual Rollout
- Deploy new category lookup infrastructure
- Update internal navigation to use new URLs
- Test with subset of categories

### Phase 3: Full Migration
- Replace old category page with new implementation
- Update all navigation components
- Remove deprecated code

## Success Criteria

1. **Functionality**
   - Category pages load with correct products from Algolia
   - No flickering during page load
   - Proper handling of 1-3 level category hierarchies

2. **Performance**
   - Page load time comparable to current search page
   - Efficient category lookup with caching
   - Minimal additional API calls

3. **User Experience**
   - Seamless navigation between category levels
   - Clear breadcrumb navigation
   - Consistent search interface across category and search pages

4. **SEO**
   - Proper URL structure for category hierarchy
   - Maintained meta tags and structured data
   - Clean URLs without unnecessary parameters

## Risks and Mitigation

### Risk 1: Performance Impact
- **Mitigation**: Implement efficient caching in categories context
- **Monitoring**: Track category lookup performance

### Risk 2: URL Structure Breaking Changes
- **Mitigation**: Implement redirect logic for old URLs
- **Communication**: Update documentation and notify stakeholders

### Risk 3: Algolia Query Complexity
- **Mitigation**: Test thoroughly with various category combinations
- **Fallback**: Implement graceful degradation if filters fail

## Next Steps
1. Review and approve this plan
2. Implement Phase 1 - Category lookup infrastructure
3. Create CategorySearchInterface component
4. Update category page implementation
5. Test and iterate based on feedback
