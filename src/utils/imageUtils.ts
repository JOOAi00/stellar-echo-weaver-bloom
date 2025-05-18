
/**
 * Utility functions for handling images
 */

/**
 * Preloads an image and returns a promise that resolves when the image is loaded
 * @param src The URL of the image to preload
 * @returns A promise that resolves with the Image object when loaded
 */
export const preloadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    
    // Start loading the image
    img.src = src;
  });
};

/**
 * Validates if the provided URL is an image
 * @param url The URL to validate
 * @returns A promise that resolves with true if the URL is a valid image, false otherwise
 */
export const isValidImageUrl = (url: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const img = new Image();
    
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    
    img.src = url;
  });
};

/**
 * Optimizes image loading by determining the appropriate size
 * @param url The original URL of the image
 * @param size The desired size in pixels
 * @returns The optimized image URL
 */
export const getOptimizedImageUrl = (url: string, size = 200): string => {
  // If using a CDN or image service, apply transformations here
  // For now, we'll just return the original URL
  if (!url) return url;
  
  if (url.startsWith('data:')) {
    // For data URLs, we can't optimize
    return url;
  }
  
  // Here you can add your image optimization logic
  return url;
};

/**
 * Creates a placeholder SVG for images that are loading
 * @param width Width of the placeholder
 * @param height Height of the placeholder
 * @returns An SVG data URL
 */
export const createPlaceholderImage = (width: number = 200, height: number = 200): string => {
  const svg = `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" 
         xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f3f4f6"/>
      <rect x="${width/2-18}" y="${height/2-18}" width="36" height="36" fill="#d1d5db"/>
      <text x="50%" y="50%" font-family="Arial" font-size="12" 
            text-anchor="middle" dominant-baseline="middle" fill="#6b7280">
        Image
      </text>
    </svg>
  `;
  
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
};
