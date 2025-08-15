// Test script to verify Cloudinary transformations are working
console.log('Testing Cloudinary transformation implementation...');

// Test the utility functions
const { isCloudinaryUrl, extractCloudinaryPublicId } = require('./app/utils/cloudinaryHelpers');

// Test URL from the example product
const testUrl = 'https://res.cloudinary.com/dau8m6xke/image/upload/products/Gloria-Vanderbilt-Amanda-Denim-Bermuda-Belt-Shorts-ACAPULCO-DENIM-0093503119.jpg';

console.log('Test URL:', testUrl);
console.log('Is Cloudinary URL:', isCloudinaryUrl(testUrl));
console.log('Extracted Public ID:', extractCloudinaryPublicId(testUrl));

// Simulate what CldImage would generate
const publicId = extractCloudinaryPublicId(testUrl);
if (publicId) {
  console.log('Expected transformation URL pattern:');
  console.log(`https://res.cloudinary.com/dau8m6xke/image/upload/c_fill,g_auto,f_auto,q_auto,w_600,h_600/${publicId}`);
}
