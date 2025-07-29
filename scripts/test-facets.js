const algoliasearch = require('algoliasearch');
require('dotenv').config({ path: '.env.local' });

const client = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY
);

const index = client.initIndex('test_vtex_query_suggestions');

async function testFacets() {
  try {
    console.log('🔍 Testing hierarchical facets...');
    
    const searchResult = await index.search('', {
      facets: ['categories.lvl0', 'categories.lvl1', 'categories.lvl2'],
      maxValuesPerFacet: 10
    });
    
    const lvl0Count = Object.keys(searchResult.facets?.['categories.lvl0'] || {}).length;
    const lvl1Count = Object.keys(searchResult.facets?.['categories.lvl1'] || {}).length;
    const lvl2Count = Object.keys(searchResult.facets?.['categories.lvl2'] || {}).length;
    
    console.log(`Categories found:`);
    console.log(`- Level 0: ${lvl0Count} categories`);
    console.log(`- Level 1: ${lvl1Count} categories`);
    console.log(`- Level 2: ${lvl2Count} categories`);
    
    if (lvl0Count > 0) {
      console.log('\n🎉 SUCCESS! Hierarchical facets are now working!');
      console.log('Top-level categories:', Object.keys(searchResult.facets['categories.lvl0']));
      console.log('\n💡 Refresh your browser - the HierarchicalMenu should now display categories.');
    } else {
      console.log('\n⏳ Index still processing... try again in a few minutes.');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testFacets();
