/**
 * Get the API URL for backend requests
 * Automatically detects production vs development environment
 * Uses HTTPS in production, HTTP in development
 */
export const getApiUrl = (): string => {
  // If VITE_API_URL is explicitly set, use it
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  // Auto-detect production vs development
  if (typeof window !== 'undefined') {
    // If running on HTTPS (production), use HTTPS backend
    if (window.location.protocol === 'https:') {
      return 'https://trueskin.app';
    }
  }

  // Default to localhost for development
  return 'http://localhost:3001';
};

