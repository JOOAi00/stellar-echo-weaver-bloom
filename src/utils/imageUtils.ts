
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
export const isValidImageUrl = async (url: string): Promise<boolean> => {
  // If no URL provided, return false immediately
  if (!url) return false;
  
  try {
    const response = await fetch(url, { method: 'HEAD' });
    const contentType = response.headers.get('Content-Type');
    return contentType ? contentType.startsWith('image/') : false;
  } catch (error) {
    console.error("Error validating image URL:", error);
    return false;
  }
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

/**
 * Convert SVG to PNG data URL for better sharing compatibility
 * @param svgElement The SVG element to convert
 * @param width Width of the output PNG
 * @param height Height of the output PNG
 * @returns A promise that resolves with the PNG data URL
 */
export const svgToPngDataUrl = (svgElement: SVGElement, width: number = 300, height: number = 300): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }
      
      // Create a blob from the SVG element
      const svgData = new XMLSerializer().serializeToString(svgElement);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);
      
      // Create an image from the blob
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, width, height);
        URL.revokeObjectURL(url);
        resolve(canvas.toDataURL('image/png'));
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Failed to load SVG as image'));
      };
      img.src = url;
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Share image using the Web Share API with fallbacks
 * @param imageDataUrl The image data URL to share
 * @param title Optional title for the share
 * @param text Optional text for the share
 * @returns A promise that resolves when the share is complete
 */
export const shareImage = async (imageDataUrl: string, title: string = 'QR Code', text: string = 'Check out this QR code'): Promise<boolean> => {
  try {
    // Convert data URL to file
    const blob = await fetch(imageDataUrl).then(res => res.blob());
    const file = new File([blob], 'qrcode.png', { type: 'image/png' });
    
    // Check if Web Share API is available with navigator.canShare
    if (navigator.share) {
      try {
        // For browsers that support share but may not support file sharing
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: title,
            text: text
          });
        } else {
          // Fallback for browsers that support share but not file sharing
          await navigator.share({
            title: title,
            text: text + ' (Image cannot be shared directly)',
            url: window.location.href
          });
        }
        return true;
      } catch (shareError) {
        // If there was an error with sharing, fall back to opening in new tab
        console.warn('Error with Web Share API:', shareError);
        
        // Fallback to download approach
        const newTab = window.open();
        if (newTab) {
          newTab.document.write(`
            <html>
              <head>
                <title>${title}</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>body { display: flex; justify-content: center; align-items: center; flex-direction: column; height: 100vh; margin: 0; background: #f9f9f9; font-family: sans-serif; }</style>
              </head>
              <body>
                <img src="${imageDataUrl}" style="max-width: 80%; max-height: 80%; border: 1px solid #ccc;">
                <div style="margin-top: 20px;">
                  <p>${text}</p>
                  <p>Right-click on the image and select "Save image as..." to download.</p>
                </div>
              </body>
            </html>
          `);
          newTab.document.close();
          return true;
        }
      }
    } else {
      // Fallback for browsers without Web Share API
      const newTab = window.open();
      if (newTab) {
        newTab.document.write(`
          <html>
            <head>
              <title>${title}</title>
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <style>body { display: flex; justify-content: center; align-items: center; flex-direction: column; height: 100vh; margin: 0; background: #f9f9f9; font-family: sans-serif; }</style>
            </head>
            <body>
              <img src="${imageDataUrl}" style="max-width: 80%; max-height: 80%; border: 1px solid #ccc;">
              <div style="margin-top: 20px;">
                <p>${text}</p>
                <p>Right-click on the image and select "Save image as..." to download.</p>
              </div>
            </body>
          </html>
        `);
        newTab.document.close();
        return true;
      }
    }
    return false;
  } catch (error) {
    console.error('Error sharing image:', error);
    return false;
  }
};
