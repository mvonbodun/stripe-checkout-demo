// Algolia Index Setup and Debug Script
// Run this script to check your Algolia indices and create the products index if needed

import algoliasearch from 'algoliasearch';
import dotenv from 'dotenv';
import { mockProducts } from '../app/models/product.js';

// Load environment variables
dotenv.config({ path: '.env.local' });

const client = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
  process.env.ALGOLIA_ADMIN_API_KEY  // Use admin key for write operations
);

async function checkAndSetupIndex() {
  try {
    console.log('🔍 Checking Algolia configuration...');
    
    // List all indices
    const { items: indices } = await client.listIndices();
    console.log('📋 Available indices:', indices.map(index => index.name));
    
    const indexName = 'products';
    const index = client.initIndex(indexName);
    
    // Check if products index exists
    const productsIndexExists = indices.some(idx => idx.name === indexName);
    
    if (!productsIndexExists) {
      console.log(`❌ Index "${indexName}" does not exist. Creating it...`);
      
      // Transform products for Algolia
      const algoliaRecords = mockProducts.map(product => ({
        objectID: product.id,
        name: product.name,
        description: product.description,
        brand: product.brand || '',
        price: product.basePrice,
        image: product.images?.[0]?.url || '',
        slug: product.slug,
        category: product.categoryIds,
        features: product.features || [],
        specifications: product.productLevelSpecifications || [],
        status: product.status,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt
      }));
      
      // Save records to index
      console.log(`📤 Uploading ${algoliaRecords.length} products to index...`);
      const { objectIDs } = await index.saveObjects(algoliaRecords);
      console.log(`✅ Successfully uploaded ${objectIDs.length} products`);
      
      // Configure index settings
      console.log('⚙️ Configuring index settings...');
      await index.setSettings({
        searchableAttributes: [
          'name',
          'description',
          'brand',
          'features'
        ],
        attributesForFaceting: [
          'brand',
          'category',
          'price'
        ],
        customRanking: [
          'desc(price)'
        ]
      });
      console.log('✅ Index settings configured');
      
    } else {
      console.log(`✅ Index "${indexName}" already exists`);
      
      // Get index stats
      const stats = await index.getTask(0).catch(() => null);
      console.log('📊 Index statistics:');
      
      try {
        const indexInfo = await client.getTask(indexName, 0).catch(() => null);
        const search = await index.search('', { hitsPerPage: 0 });
        console.log(`   - Total records: ${search.nbHits}`);
      } catch (e) {
        console.log('   - Could not retrieve statistics');
      }
    }
    
    // Test search
    console.log('🔍 Testing search functionality...');
    const searchResult = await index.search('', { hitsPerPage: 1 });
    console.log(`✅ Search test successful. Found ${searchResult.nbHits} total products`);
    
    if (searchResult.hits.length > 0) {
      console.log('📄 Sample product:', JSON.stringify(searchResult.hits[0], null, 2));
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    
    if (error.message.includes('Invalid API key')) {
      console.log('💡 Tip: Make sure you\'re using the Admin API key for write operations');
    }
    
    if (error.message.includes('Application does not exist')) {
      console.log('💡 Tip: Check your ALGOLIA_APP_ID in .env.local');
    }
  }
}

// Run the setup
checkAndSetupIndex();
