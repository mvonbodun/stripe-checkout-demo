const algoliasearch = require('algoliasearch');
require('dotenv').config({ path: '.env.local' });

// Check environment variables
console.log('Environment variables:');
console.log('ALGOLIA_APP_ID:', process.env.NEXT_PUBLIC_ALGOLIA_APP_ID ? '✅ Set' : '❌ Missing');
console.log('ALGOLIA_SEARCH_API_KEY:', process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY ? '✅ Set' : '❌ Missing');
console.log('ALGOLIA_ADMIN_API_KEY:', process.env.ALGOLIA_ADMIN_API_KEY ? '✅ Set' : '❌ Missing');

if (!process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || !process.env.ALGOLIA_ADMIN_API_KEY) {
  console.error('❌ Missing required Algolia environment variables');
  process.exit(1);
}

const client = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
  process.env.ALGOLIA_ADMIN_API_KEY
);

const indexName = process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME || 'stripe_demo_index';
const index = client.initIndex(indexName);

async function fixHierarchicalFacets() {
  try {
    console.log('\n🔍 Checking current index settings...');
    
    // Get current settings
    const settings = await index.getSettings();
    console.log('\nCurrent attributesForFaceting:', settings.attributesForFaceting || []);
    
    // Check if hierarchical attributes are already configured
    const currentFacets = settings.attributesForFaceting || [];
    const hierarchicalAttrs = [
      'searchable(categories.lvl0)',
      'searchable(categories.lvl1)',
      'searchable(categories.lvl2)'
    ];
    
    console.log('\nChecking hierarchical attributes:');
    const missingAttrs = [];
    hierarchicalAttrs.forEach(attr => {
      const isConfigured = currentFacets.includes(attr);
      console.log(`- ${attr}: ${isConfigured ? '✅ Already configured' : '❌ Missing'}`);
      if (!isConfigured) {
        missingAttrs.push(attr);
      }
    });
    
    if (missingAttrs.length > 0) {
      console.log('\n🔧 Adding missing hierarchical facet attributes...');
      
      const updatedFacets = [...currentFacets, ...missingAttrs];
      console.log('New attributesForFaceting:', updatedFacets);
      
      await index.setSettings({
        attributesForFaceting: updatedFacets
      });
      
      console.log('✅ Successfully updated index settings!');
      console.log('⏳ Index reprocessing will take a few minutes...');
      
      // Wait a moment and test
      console.log('\n⏳ Waiting 10 seconds before testing...');
      await new Promise(resolve => setTimeout(resolve, 10000));
    } else {
      console.log('\n✅ All hierarchical attributes are already configured!');
    }
    
    // Test search to verify facets
    console.log('\n🔍 Testing search with facets...');
    const searchResult = await index.search('', {
      facets: ['categories.lvl0', 'categories.lvl1', 'categories.lvl2'],
      maxValuesPerFacet: 10
    });
    
    console.log('\nFacet results:');
    const lvl0Facets = Object.keys(searchResult.facets?.['categories.lvl0'] || {});
    const lvl1Facets = Object.keys(searchResult.facets?.['categories.lvl1'] || {});
    const lvl2Facets = Object.keys(searchResult.facets?.['categories.lvl2'] || {});
    
    console.log('- categories.lvl0:', lvl0Facets);
    console.log('- categories.lvl1:', lvl1Facets.slice(0, 5), lvl1Facets.length > 5 ? `... and ${lvl1Facets.length - 5} more` : '');
    console.log('- categories.lvl2:', lvl2Facets.slice(0, 5), lvl2Facets.length > 5 ? `... and ${lvl2Facets.length - 5} more` : '');
    
    if (lvl0Facets.length > 0) {
      console.log(`\n🎉 SUCCESS! Found ${lvl0Facets.length} top-level categories!`);
      console.log('🎯 HierarchicalMenu should now work in your React app.');
      console.log('💡 Refresh your browser to see the categories appear.');
    } else {
      console.log('\n⚠️  Facets are still empty. Possible reasons:');
      console.log('   1. Index is still reprocessing (wait 5-10 minutes and try again)');
      console.log('   2. Data might need to be re-indexed');
      console.log('   3. Check if the hierarchical data actually exists in your records');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.message.includes('Invalid value')) {
      console.log('\n💡 API key issue detected. Please verify:');
      console.log('   1. ALGOLIA_ADMIN_API_KEY is correct in .env.local');
      console.log('   2. The API key has admin permissions');
    }
  }
}

fixHierarchicalFacets();
