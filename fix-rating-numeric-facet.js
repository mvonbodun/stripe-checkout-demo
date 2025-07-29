import { config } from 'dotenv';
import algoliasearch from 'algoliasearch';

// Load environment variables
config({ path: '.env.local' });

const client = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
  process.env.ALGOLIA_ADMIN_API_KEY
);

const indexName = 'test_vtex_query_suggestions';

async function fixRatingNumericFacet() {
  console.log('🔧 Configuring reviews.rating as numeric attribute...');
  
  try {
    // Get the index
    const index = client.initIndex(indexName);
    
    // Get current index settings
    const currentSettings = await index.getSettings();
    
    console.log('📋 Current numericAttributesForFiltering:', currentSettings.numericAttributesForFiltering || []);
    
    // Get current numericAttributesForFiltering or initialize empty array
    const currentNumericAttrs = currentSettings.numericAttributesForFiltering || [];
    
    // Add reviews.rating if not already present
    const ratingNumericAttr = 'reviews.rating';
    if (!currentNumericAttrs.includes(ratingNumericAttr)) {
      const updatedNumericAttrs = [...currentNumericAttrs, ratingNumericAttr];
      
      console.log('✨ Adding reviews.rating to numericAttributesForFiltering...');
      
      await index.setSettings({
        numericAttributesForFiltering: updatedNumericAttrs
      });
      
      console.log('✅ Successfully configured reviews.rating as numeric attribute!');
      console.log('📋 Updated numericAttributesForFiltering:', updatedNumericAttrs);
    } else {
      console.log('✅ reviews.rating numeric attribute already exists!');
    }
    
  } catch (error) {
    console.error('❌ Error configuring numeric attribute:', error);
  }
}

fixRatingNumericFacet();
