/**
 * Resolves full asset image URLs for local development and production.
 * Handles blobs, base64 data URLs, external https URLs, and backend /uploads/... paths.
 */
export const getImageUrl = (url) => {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (!trimmed) return '';

  // Return blob, data, and absolute http/https URLs as-is
  if (
    trimmed.startsWith('blob:') ||
    trimmed.startsWith('data:') ||
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://')
  ) {
    return trimmed;
  }

  const cleanPath = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  const envApi = process.env.REACT_APP_API_URL;

  if (envApi && !envApi.includes('localhost')) {
    const origin = envApi.replace(/\/api\/?$/, '');
    return `${origin}${cleanPath}`;
  }

  const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
  const isLocal = hostname === 'localhost' || hostname === '127.0.0.1';
  const isPrivateIp = /^(192\.168\.|10\.|172\.(1[6-9]|2\d|3[0-1])\.)/.test(hostname);

  if (isLocal) {
    return `http://localhost:5000${cleanPath}`;
  }

  if (isPrivateIp) {
    return `http://${hostname}:5000${cleanPath}`;
  }

  // Production same-origin
  if (typeof window !== 'undefined' && window.location.origin) {
    return `${window.location.origin}${cleanPath}`;
  }

  return cleanPath;
};
