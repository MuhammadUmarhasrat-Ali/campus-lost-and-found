// Helper to resolve full image URLs
// If the URL is relative (e.g. /uploads/image.jpg), prepend backend server URL
export const getImageUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url;
  }
  
  // For relative paths like /uploads/...
  const backendOrigin = import.meta.env.PROD
    ? 'https://campus-lost-and-found-v0kl.onrender.com'
    : '';

  return `${backendOrigin}${url.startsWith('/') ? '' : '/'}${url}`;
};
