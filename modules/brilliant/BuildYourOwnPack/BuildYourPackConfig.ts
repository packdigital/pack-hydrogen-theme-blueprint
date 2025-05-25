export const BYOP_SUBNAV_HEIGHT = 48;

export const BYOP_PRODUCT_HANDLE = 'jiggle-pets-bundle';

export const BYOP_TIERS: TBYOP_TIER[] = [
  {
    count: 3,
    title: '3 Pack',
    variantId: 'gid://shopify/ProductVariant/46035989299415',
  },
  {
    count: 7,
    title: '7 Pack',
    variantId: 'gid://shopify/ProductVariant/46035989332183',
  },
  {
    count: 12,
    title: '12 Pack',
    variantId: 'gid://shopify/ProductVariant/46035989364951',
  },
];

export type TBYOP_TIER = {
  count: number;
  title: string;
  variantId: string;
};
