/**
 * Environment variables utility
 * Provides type-safe access to environment variables with fallbacks
 */

export function getBaseUrl(): string {
  // Check for BASE_URL first
  if (process.env.BASE_URL) {
    return process.env.BASE_URL;
  }
  
  // Fallback to NEXTAUTH_URL if BASE_URL is not set
  if (process.env.NEXTAUTH_URL) {
    return process.env.NEXTAUTH_URL;
  }
  
  // Development fallback
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3000';
  }
  
  // Production fallback - this should be set in production
  throw new Error('BASE_URL or NEXTAUTH_URL must be set in production');
}

export function getApiUrl(): string {
  return `${getBaseUrl()}/api`;
}

export function getAppUrl(): string {
  return getBaseUrl();
}

/**
 * Get the full URL for a given path
 * @param path - The path to append to the base URL
 * @returns The full URL
 */
export function getFullUrl(path: string): string {
  const baseUrl = getBaseUrl();
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
}

/**
 * Check if we're in production
 */
export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

/**
 * Check if we're in development
 */
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development';
}
