/**
 * Get the API URL for backend requests
 * Automatically detects production vs development environment
 * In production (Vercel), uses relative URLs for serverless functions
 * In development, uses localhost backend
 */
export const getApiUrl = (): string => {
  // If VITE_API_URL is explicitly set, use it
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  // In production, use relative URLs (serverless functions on same domain)
  if (import.meta.env.PROD) {
    return '';
  }

  // In development, use localhost backend
  return 'http://localhost:3001';
};

