/**
 * Test file to verify Cloudinary utility functions work correctly
 * Run this with: node test-cloudinary-utils.mjs
 */

// Inline test functions for Node.js environment
function extractCloudinaryPublicId(cloudinaryUrl) {
  if (!cloudinaryUrl || typeof cloudinaryUrl !== 'string') {
    return '';
  }

  try {
    // Parse the URL
    const url = new URL(cloudinaryUrl);
    
    // Verify it's a Cloudinary URL
    if (!url.hostname.includes('cloudinary.com')) {
      return '';
    }

    // Get the pathname and remove leading slash
    const pathname = url.pathname.startsWith('/') ? url.pathname.slice(1) : url.pathname;
    
    // Split the path into segments
    const pathSegments = pathname.split('/');
    
    // Find the 'upload' segment
    const uploadIndex = pathSegments.findIndex(segment => segment === 'upload');
    
    if (uploadIndex === -1 || uploadIndex === pathSegments.length - 1) {
      return '';
    }

    // Get everything after 'upload' but before the file extension
    const publicIdSegments = pathSegments.slice(uploadIndex + 1);
    const publicIdWithExtension = publicIdSegments.join('/');
    
    // Remove file extension from the last segment
    const lastDotIndex = publicIdWithExtension.lastIndexOf('.');
    if (lastDotIndex > 0) {
      return publicIdWithExtension.substring(0, lastDotIndex);
    }

    return publicIdWithExtension;
  } catch (error) {
    console.error('Error extracting Cloudinary public ID:', error);
    return '';
  }
}

function isCloudinaryUrl(url) {
  if (!url || typeof url !== 'string') {
    return false;
  }

  try {
    const parsedUrl = new URL(url);
    return parsedUrl.hostname.includes('cloudinary.com');
  } catch {
    return false;
  }
}

function getFallbackImage(originalUrl) {
  return '/next.svg';
}

// Test data from actual Algolia index
const testUrls = [
  'https://res.cloudinary.com/dau8m6xke/image/upload/products/Dockers-Metal-Pilot-Polarized-Sunglasses-GUNMETAL-GREY-0093097367.jpg',
  'https://res.cloudinary.com/dau8m6xke/image/upload/products/some-other-product-12345.png',
  'https://example.com/regular-image.jpg',
  '',
  null,
  undefined
];

console.log('Testing Cloudinary utility functions...\n');

testUrls.forEach((url, index) => {
  console.log(`Test ${index + 1}: ${url || 'empty/null/undefined'}`);
  console.log(`  isCloudinaryUrl: ${isCloudinaryUrl(url)}`);
  console.log(`  extractCloudinaryPublicId: "${extractCloudinaryPublicId(url)}"`);
  console.log(`  getFallbackImage: "${getFallbackImage(url)}"`);
  console.log('');
});

console.log('Expected results:');
console.log('Test 1: should extract "products/Dockers-Metal-Pilot-Polarized-Sunglasses-GUNMETAL-GREY-0093097367"');
console.log('Test 2: should extract "products/some-other-product-12345"');
console.log('Test 3-6: should return empty string for public ID and false for isCloudinaryUrl');
