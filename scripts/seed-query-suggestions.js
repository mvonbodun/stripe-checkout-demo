#!/usr/bin/env node

const algoliasearch = require('algoliasearch');
require('dotenv').config({ path: '.env.local' });

// Initialize Algolia client
const client = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
  process.env.ALGOLIA_ADMIN_API_KEY
);

const indexName = process.env.NEXT_PUBLIC_ALGOLIA_QUERY_SUGGESTIONS_INDEX || 'stripe_demo_index_uery_suggestions';
const index = client.initIndex(indexName);

// Popular search suggestions
const querySuggestions = [
  
  // Fashion
  { objectID: '16', query: 'running shoes', category: 'Fashion', popularity: 85 },
  { objectID: '17', query: 't-shirt', category: 'Fashion', popularity: 80 },
  { objectID: '18', query: 'jeans', category: 'Fashion', popularity: 75 },
  { objectID: '19', query: 'dress', category: 'Fashion', popularity: 70 },
  { objectID: '20', query: 'jacket', category: 'Fashion', popularity: 65 },
  { objectID: '21', query: 'sneakers', category: 'Fashion', popularity: 60 },
  { objectID: '22', query: 'hoodie', category: 'Fashion', popularity: 55 },
  
  // Home & Kitchen
  { objectID: '23', query: 'coffee maker', category: 'Home', popularity: 70 },
  { objectID: '24', query: 'air fryer', category: 'Home', popularity: 65 },
  { objectID: '25', query: 'vacuum cleaner', category: 'Home', popularity: 60 },
  { objectID: '26', query: 'bedding', category: 'Home', popularity: 55 },
  { objectID: '27', query: 'kitchen knife', category: 'Home', popularity: 50 },
  
  // Sports & Outdoors
  { objectID: '28', query: 'yoga mat', category: 'Sports', popularity: 60 },
  { objectID: '29', query: 'water bottle', category: 'Sports', popularity: 55 },
  { objectID: '30', query: 'fitness tracker', category: 'Sports', popularity: 50 },
];

async function seedQuerySuggestions() {
  try {
    console.log(`Seeding query suggestions to index: ${indexName}`);
    
    // Configure the index
    await index.setSettings({
      searchableAttributes: [
        'query',
        'category'
      ],
      attributesForFaceting: [
        'category'
      ],
      customRanking: [
        'desc(popularity)'
      ],
      ranking: [
        'typo',
        'geo',
        'words',
        'filters',
        'proximity',
        'attribute',
        'exact',
        'custom'
      ]
    });

    // Add the query suggestions
    const response = await index.saveObjects(querySuggestions);
    console.log(`Successfully added ${querySuggestions.length} query suggestions`);
    console.log('Response:', response);

    // Wait for indexing to complete
    await index.waitTask(response.taskID);
    console.log('Indexing completed!');

    // Test search
    const searchResults = await index.search('phone');
    console.log(`Test search for "phone" returned ${searchResults.hits.length} suggestions`);
    
  } catch (error) {
    console.error('Error seeding query suggestions:', error);
    process.exit(1);
  }
}

// Run the seeding if this script is executed directly
if (require.main === module) {
  seedQuerySuggestions()
    .then(() => {
      console.log('Query suggestions seeding completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Query suggestions seeding failed:', error);
      process.exit(1);
    });
}

module.exports = { seedQuerySuggestions };
