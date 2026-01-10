import {
  CacheLong,
  CacheNone,
  CacheShort,
  generateCacheControlHeader,
  type CachingStrategy,
} from '@shopify/hydrogen';

/**
 * Cache configuration constants
 * These values are used across the application for consistent caching behavior
 */
const ONE_MINUTE = 60;
const ONE_HOUR = 60 * ONE_MINUTE;
const ONE_DAY = 24 * ONE_HOUR;
const ONE_YEAR = 365 * ONE_DAY;

export function routeHeaders({loaderHeaders}: {loaderHeaders: Headers}) {
  // Keep the same cache-control headers when loading the page directly
  // versus when transititioning to the page from other areas in the app
  return {
    'Cache-Control': loaderHeaders.get('Cache-Control'),
  };
}

/**
 * Cache strategy for static/immutable assets (hashed files)
 * These files have content-based hashes in their filenames,
 * so they can be cached for a very long time
 */
export function CacheImmutable(): CachingStrategy {
  return {
    mode: 'public',
    maxAge: ONE_YEAR,
    staleWhileRevalidate: 0,
  };
}

/**
 * Cache strategy for semi-static content like product listings, collections
 * Uses aggressive stale-while-revalidate for better performance
 */
export function CacheMedium(): CachingStrategy {
  return {
    mode: 'public',
    maxAge: 5 * ONE_MINUTE,
    staleWhileRevalidate: ONE_DAY,
    staleIfError: ONE_DAY,
  };
}

/**
 * Cache strategy for frequently changing content
 * Short maxAge with longer SWR for responsiveness
 */
export function CacheDynamic(): CachingStrategy {
  return {
    mode: 'public',
    maxAge: ONE_MINUTE,
    staleWhileRevalidate: ONE_HOUR,
    staleIfError: ONE_HOUR,
  };
}

/**
 * Cache strategy for API responses that benefit from aggressive SWR
 * Perfect for search, recommendations, and real-time data
 */
export function CacheAPI(): CachingStrategy {
  return {
    mode: 'public',
    maxAge: 30, // 30 seconds fresh
    staleWhileRevalidate: 5 * ONE_MINUTE,
    staleIfError: 10 * ONE_MINUTE,
  };
}

export const CACHE_SHORT = generateCacheControlHeader(CacheShort());
export const CACHE_LONG = generateCacheControlHeader(CacheLong());
export const CACHE_NONE = generateCacheControlHeader(CacheNone());
export const CACHE_MEDIUM = generateCacheControlHeader(CacheMedium());
export const CACHE_DYNAMIC = generateCacheControlHeader(CacheDynamic());
export const CACHE_API = generateCacheControlHeader(CacheAPI());
export const CACHE_IMMUTABLE = generateCacheControlHeader(CacheImmutable());
