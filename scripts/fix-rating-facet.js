// Fix Rating Facet Configuration
// This script updates the Algolia index to properly configure rating attributes for filtering

import algoliasearch from 'algoliasearch';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const client = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
  process.env.ALGOLIA_ADMIN_API_KEY  // Use admin key for write operations
);

async function fixRatingFacet() {
  try {
    console.log('🔧 Fixing rating facet configuration...');
    
    const indexName = process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME || 'stripe_demo_index';
    const index = client.initIndex(indexName);
    
    // Get current settings
    const currentSettings = await index.getSettings();
    console.log('📋 Current numericAttributesForFiltering:', currentSettings.numericAttributesForFiltering);
    
    // Update settings to include reviews.rating as numeric attribute
    const newSettings = {
      ...currentSettings,
      numericAttributesForFiltering: [
        ...currentSettings.numericAttributesForFiltering,
        'reviews.rating'
      ]
    };
    
    console.log('⚙️ Updating index settings...');
    console.log('📋 New numericAttributesForFiltering:', newSettings.numericAttributesForFiltering);
    
    await index.setSettings(newSettings);
    console.log('✅ Rating facet configuration updated successfully!');
    
    // Test the numeric filtering
    console.log('🧪 Testing numeric filtering...');
    
    const testResult = await index.search('', { 
      hitsPerPage: 0,
      numericFilters: ['reviews.rating >= 4']
    });
    console.log(`✅ Test successful: Found ${testResult.nbHits} products with rating >= 4`);
    
    const testResult2 = await index.search('', { 
      hitsPerPage: 0,
      numericFilters: ['reviews.rating = 5']
    });
    console.log(`✅ Test successful: Found ${testResult2.nbHits} products with rating = 5`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run the fix
fixRatingFacet();
