import algoliasearch from 'algoliasearch/lite';

export const ALGOLIA_INDEX_NAME = 'test_vtex_query_suggestions';

// Configuration constants
export const SEARCH_CONFIG = {
  hitsPerPage: 20,
  attributesToRetrieve: ['name', 'brand', 'price', 'image', 'category', 'description', 'slug'],
  attributesToHighlight: ['name', 'brand', 'description'],
  attributesToSnippet: ['description:50'],
};

// Function to get environment variables
function getAlgoliaCredentials() {
  const appId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID;
  const apiKey = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY;
  
  return { appId, apiKey };
}

// Function to create search client
export function createSearchClient() {
  const { appId, apiKey } = getAlgoliaCredentials();
  
  if (!appId || !apiKey) {
    console.error('Algolia environment variables are not configured properly');
    console.error('Missing variables:', {
      NEXT_PUBLIC_ALGOLIA_APP_ID: appId ? 'present' : 'missing',
      NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY: apiKey ? 'present' : 'missing'
    });
    return null;
  }
  
  try {
    return algoliasearch(appId, apiKey);
  } catch (error) {
    console.error('Failed to create Algolia search client:', error);
    return null;
  }
}
