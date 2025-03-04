import type {
  CartLine,
  ProductVariant,
} from '@shopify/hydrogen/storefront-api-types';

import {ANALYTICS_NAME} from './events';

const STOREFRONT_NAME =
  (typeof document !== 'undefined' && window.ENV?.SITE_TITLE) || 'Storefront';

export const flattenConnection = (connection: Record<string, any> = {}) => {
  if (!connection) return undefined;
  if (Array.isArray(connection.edges)) {
    return connection.edges.map(({node}: {node: any}) => node);
  }
  if (Array.isArray(connection.nodes)) {
    return connection.nodes;
  }
  if (Array.isArray(connection)) {
    if (Object.keys({...connection[0]}).length === 1 && connection[0].node) {
      return connection.map(({node}: {node: any}) => node);
    }
    return connection;
  }
  return undefined;
};

export const edgeTagMapCartLine = (line: CartLine) => {
  try {
    const {quantity, merchandise} = {...line};
    if (!merchandise) return null;

    return {
      id: merchandise.product.id?.split('/').pop(),
      variantId: merchandise.id?.split('/').pop(),
      title: merchandise.product.title,
      type: 'product',
      url: `https://${window.location.hostname}/products/${merchandise.product?.handle}`,
      quantity,
      item_price: parseFloat(`${merchandise.price?.amount || ''}`),
      category: merchandise.product?.productType || '',
      brand: merchandise.product?.vendor || STOREFRONT_NAME,
      image: merchandise.image?.url || '',
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : error;
    console.error(`${ANALYTICS_NAME}: ❌ edgeTagMapCartLine error:`, message);
    return null;
  }
};

export const edgeTagMapVariant = (variant: ProductVariant) => {
  try {
    if (!variant) return null;

    return {
      id: variant.product?.id?.split('/').pop(),
      variantId: variant.id?.split('/').pop(),
      title: variant.product?.title,
      type: 'product',
      url: `https://${window.location.hostname}/products/${variant.product?.handle}`,
      quantity: 1,
      item_price: parseFloat(`${variant.price?.amount || ''}`),
      category: variant?.product?.productType || '',
      brand: variant.product?.vendor || STOREFRONT_NAME,
      image: variant.image?.url || variant.product?.featuredImage?.url,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : error;
    console.error(`${ANALYTICS_NAME}: ❌ edgeTagMapCartLine error:`, message);
    return null;
  }
};
