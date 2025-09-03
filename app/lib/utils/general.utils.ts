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
