const algoliasearch = require('algoliasearch').default;
require('dotenv').config({ path: '.env.local' });

const client = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
  process.env.ALGOLIA_ADMIN_API_KEY
);

const indexName = 'test_vtex_query_suggestions';

async function addRatingFacet() {
  console.log('🔧 Adding rating facet to Algolia index...');
  
  try {
    // Get the index
    const index = client.initIndex(indexName);
    
    // Get current index settings
    const currentSettings = await index.getSettings();
    
    console.log('📋 Current attributesForFaceting:', currentSettings.attributesForFaceting || []);
    
    // Get current attributesForFaceting or initialize empty array
    const currentFacets = currentSettings.attributesForFaceting || [];
    
    // Add reviews.rating if not already present
    const ratingFacet = 'reviews.rating';
    if (!currentFacets.includes(ratingFacet)) {
      const updatedFacets = [...currentFacets, ratingFacet];
      
      console.log('✨ Adding reviews.rating to facets...');
      
      await index.setSettings({
        attributesForFaceting: updatedFacets
      });
      
      console.log('✅ Successfully added reviews.rating facet!');
      console.log('📋 Updated attributesForFaceting:', updatedFacets);
    } else {
      console.log('✅ reviews.rating facet already exists!');
    }
    
  } catch (error) {
    console.error('❌ Error adding rating facet:', error);
  }
}

addRatingFacet();
