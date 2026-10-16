export const transformShopifyGids = (obj: any): any => {
  if (obj === null || obj === undefined) {
    return obj;
  }

  // Handle arrays
  if (Array.isArray(obj)) {
    return obj.map((item) => transformShopifyGids(item));
  }

  // Handle objects
  if (typeof obj === 'object') {
    const transformed: Record<string, any> = {};
    for (const [key, value] of Object.entries(obj)) {
      transformed[key] = transformShopifyGids(value);
    }
    return transformed;
  }

  // Handle strings
  if (typeof obj === 'string' && obj.includes('gid://shopify/')) {
    return obj.split('/').pop();
  }

  // Return other values as is
  return obj;
};

/**
 * Appends a `#t=0.001` media fragment to a native video source URL so
 * browsers (Safari especially) paint the first frame from the metadata
 * request instead of a blank box when no poster is set. URLs that already
 * have a fragment and YouTube/Vimeo URLs are returned unchanged.
 */
export const getVideoSrcWithFirstFrame = (url: string | undefined | null) => {
  if (!url) return url ?? undefined;
  if (url.includes('#') || /youtube\.com|youtu\.be|vimeo\.com/i.test(url)) {
    return url;
  }
  return `${url}#t=0.001`;
};
