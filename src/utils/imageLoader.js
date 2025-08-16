// Image importing for proper Vite handling
// This ensures images are properly included in the build

// Import all images to ensure they're included in the Vite build
const importImages = () => {
  const images = import.meta.glob('/public/css/images/*.{png,jpg,jpeg,svg,gif}', {
    eager: true,
    as: 'url'
  });
  return images;
};

// Get proper image URL that works in both dev and production
export const getImageUrl = (imagePath) => {
  // Remove leading slash and public/ if present
  const cleanPath = imagePath.replace(/^\/?(public\/)?/, '/');
  
  // In Vite, public assets are served from root
  return cleanPath;
};

// Preload critical images
export const preloadImages = () => {
  const criticalImages = [
    '/css/images/Mountain.jpg',
    '/css/images/mohit.png',
    '/css/images/package.jpg',
    '/css/images/pokhara.jpg',
    '/css/images/andaman.jpg'
  ];
  
  criticalImages.forEach(src => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);
  });
};

// Check if image exists and provide fallback
export const getImageWithFallback = (imagePath, fallback = '/css/images/package.jpg') => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(imagePath);
    img.onerror = () => resolve(fallback);
    img.src = imagePath;
  });
};
