// Image path utility for proper asset handling in production
export const getImagePath = (imagePath) => {
  // Remove leading slash if present
  const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
  
  // In development and production, Vite handles public assets with leading slash
  return `/${cleanPath}`;
};

// Common image paths
export const IMAGES = {
  // Team
  MOHIT: '/css/images/mohit.png',
  
  // Destinations
  POKHARA: '/css/images/pokhara.jpg',
  JAIPUR: '/css/images/jaipur.jpg',
  KOLKATA: '/css/images/kolkata.jpg',
  MOUNTAIN: '/css/images/Mountain.jpg',
  NIGHT: '/css/images/night.jpg',
  KYOTO: '/css/images/Kyoto.jpg',
  
  // Default images
  PACKAGE_DEFAULT: '/css/images/package.jpg',
  
  // Adventure destinations
  ANDAMAN: '/css/images/andaman.jpg',
  ALASKA: '/css/images/alaska.jpg',
  AMAZON: '/css/images/amazon.jpg',
  ANTELOPE: '/css/images/antelope.jpg',
  AURORA: '/css/images/aurora.jpg',
  AZORES: '/css/images/azores.jpg',
  CAVES: '/css/images/caves.jpg',
  FUJI: '/css/images/fuji.jpg',
  HIMALAYA: '/css/images/himalaya.jpg',
  ICELAND: '/css/images/iceland.jpg',
  PARIS: '/css/images/paris.jpg',
  REEF: '/css/images/reef.jpg',
};
