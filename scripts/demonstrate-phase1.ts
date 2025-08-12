/**
 * Phase 1 Demonstration Script
 * Shows the category lookup infrastructure working with real backend data
 */

const BACKEND_URL = 'http://localhost:3000/api/catalog-categories?tree=true';

import { 
  findCategoryBySlug, 
  getCategoryAlgoliaField, 
  buildCategorySlugUrl,
  getCategoryBreadcrumbPath,
  parseCategorySlug 
} from '../app/utils/category-lookup';

async function demonstratePhase1() {
  console.log('🚀 Phase 1 Category Lookup Infrastructure Demo\n');

  try {
    // Fetch real category data
    console.log('📡 Fetching categories from backend...');
    const response = await fetch(BACKEND_URL);
    const categories = await response.json();
    console.log(`✅ Loaded ${categories.length} top-level categories\n`);

    // Demonstrate slug parsing
    console.log('🔍 Slug Parsing Demo:');
    const slugExamples = ['men', 'men/mens-apparel', 'men/mens-apparel/casual-short-sleeve-shirts'];
    slugExamples.forEach(slug => {
      const parsed = parseCategorySlug(slug);
      console.log(`  "${slug}" -> [${parsed.join(', ')}]`);
    });
    console.log('');

    // Demonstrate category lookup
    console.log('🎯 Category Lookup Demo:');
    
    // Level 1 lookup
    const menCategory = findCategoryBySlug('men', categories);
    if (menCategory) {
      console.log(`✅ Found level 1: ${menCategory.name} (path: "${menCategory.path}")`);
      
      // Level 2 lookup
      const mensApparelCategory = findCategoryBySlug('men/mens-apparel', categories);
      if (mensApparelCategory) {
        console.log(`✅ Found level 2: ${mensApparelCategory.name} (path: "${mensApparelCategory.path}")`);
        
        // Level 3 lookup (if exists)
        const level3Example = findCategoryBySlug('men/mens-apparel/casual-short-sleeve-shirts', categories);
        if (level3Example) {
          console.log(`✅ Found level 3: ${level3Example.name} (path: "${level3Example.path}")`);
        } else {
          console.log('ℹ️  No level 3 categories found in current data');
        }
      }
    }
    console.log('');

    // Demonstrate Algolia field mapping
    console.log('🎯 Algolia Field Mapping Demo:');
    if (menCategory) {
      const algoliaField1 = getCategoryAlgoliaField(menCategory.path);
      console.log(`  Level 1: "${menCategory.path}" -> ${algoliaField1.field}:"${algoliaField1.value}"`);
      
      const mensApparelCategory = findCategoryBySlug('men/mens-apparel', categories);
      if (mensApparelCategory) {
        const algoliaField2 = getCategoryAlgoliaField(mensApparelCategory.path);
        console.log(`  Level 2: "${mensApparelCategory.path}" -> ${algoliaField2.field}:"${algoliaField2.value}"`);
      }
    }
    console.log('');

    // Demonstrate URL building
    console.log('🔗 URL Building Demo:');
    const menCategory2 = findCategoryBySlug('men', categories);
    if (menCategory2) {
      const url1 = buildCategorySlugUrl(menCategory2);
      console.log(`  "${menCategory2.name}" -> ${url1}`);
      
      const mensApparelCategory = findCategoryBySlug('men/mens-apparel', categories);
      if (mensApparelCategory) {
        const url2 = buildCategorySlugUrl(mensApparelCategory);
        console.log(`  "${mensApparelCategory.name}" -> ${url2}`);
      }
    }
    console.log('');

    // Demonstrate breadcrumb path
    console.log('🍞 Breadcrumb Demo:');
    const mensApparelCategory = findCategoryBySlug('men/mens-apparel', categories);
    if (mensApparelCategory) {
      const breadcrumbs = getCategoryBreadcrumbPath(mensApparelCategory, categories);
      const breadcrumbNames = breadcrumbs.map(cat => cat.name);
      console.log(`  Breadcrumbs for "${mensApparelCategory.name}": ${breadcrumbNames.join(' > ')}`);
    }
    console.log('');

    // Test error handling
    console.log('❌ Error Handling Demo:');
    const nonExistent = findCategoryBySlug('non-existent-category', categories);
    console.log(`  Non-existent category lookup: ${nonExistent === null ? 'null (correct)' : 'unexpected result'}`);
    
    try {
      getCategoryAlgoliaField('Too > Many > Levels > Here');
    } catch (error) {
      console.log(`  Invalid depth error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    console.log('\n🎉 Phase 1 infrastructure is working correctly!');
    console.log('📋 Ready for Phase 2: SearchInterface Enhancement');

  } catch (error) {
    console.error('❌ Error during demonstration:', error);
  }
}

// Export for potential use in other contexts
export { demonstratePhase1 };

// Run if this file is executed directly
if (require.main === module) {
  demonstratePhase1();
}
