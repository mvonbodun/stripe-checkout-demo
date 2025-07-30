/**
 * Utility functions for working with Cloudinary URLs and Next Cloudinary
 */

/**
 * Extracts the public ID from a Cloudinary URL
 * 
 * @param cloudinaryUrl - Full Cloudinary URL (e.g., "https://res.cloudinary.com/dau8m6xke/image/upload/products/example.jpg")
 * @returns The public ID (e.g., "products/example") or empty string if invalid
 * 
 * Example:
 * Input: "https://res.cloudinary.com/dau8m6xke/image/upload/products/Dockers-Metal-Pilot-Polarized-Sunglasses-GUNMETAL-GREY-0093097367.jpg"
 * Output: "products/Dockers-Metal-Pilot-Polarized-Sunglasses-GUNMETAL-GREY-0093097367"
 */
export function extractCloudinaryPublicId(cloudinaryUrl: string): string {
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

/**
 * Validates if a URL is a Cloudinary URL
 * 
 * @param url - URL to validate
 * @returns true if it's a valid Cloudinary URL
 */
export function isCloudinaryUrl(url: string): boolean {
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

/**
 * Gets the fallback image path for non-Cloudinary images
 * 
 * @param originalUrl - Original image URL
 * @returns Fallback image path
 */
export function getFallbackImage(originalUrl?: string): string {
  // You can customize this based on your needs
  return '/next.svg';
}
