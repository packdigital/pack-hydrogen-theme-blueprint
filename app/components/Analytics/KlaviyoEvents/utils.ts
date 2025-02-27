import type {
  CartLine,
  ProductVariant,
} from '@shopify/hydrogen/storefront-api-types';

import {ANALYTICS_NAME} from './events';

const STOREFRONT_NAME =
  (typeof document !== 'undefined' && window.ENV?.SITE_TITLE) || 'Storefront';

export const mapProductPageVariant =
  (list = '') =>
  (variant: ProductVariant) => {
    try {
      if (!variant) return null;

      const params = new URLSearchParams('');
      variant.selectedOptions?.forEach(({name, value}) => {
        params.set(name, value);
      });

      return {
        id: variant.sku || '',
        name: variant.product?.title || '',
        brand: variant.product?.vendor || STOREFRONT_NAME,
        category: variant.product?.productType || 'Uncategorized',
        variant: variant.title || '',
        price: `${variant.price?.amount || ''}`,
        list,
        product_id: variant.product?.id?.split('/').pop() || '',
        variant_id: variant.id?.split('/').pop() || '',
        compare_at_price: `${variant.compareAtPrice?.amount || 'undefined'}`,
        image: variant.image?.url || '',
        url: `/products/${variant.product?.handle}?${params}`,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : error;
      console.error(
        `${ANALYTICS_NAME}: ❌ mapProductPageVariant error:`,
        message,
      );
      console.error(
        `${ANALYTICS_NAME}: ❌ mapProductPageVariant variant:`,
        variant,
      );
      return null;
    }
  };

export const mapCartLine =
  (list = '') =>
  (line: CartLine & {index?: number}, index = 0) => {
    try {
      const {quantity, merchandise} = {...line};
      if (!merchandise) return null;

      return {
        id: merchandise.sku || '',
        name: merchandise.product?.title || '',
        brand: merchandise.product?.vendor || STOREFRONT_NAME,
        category: merchandise.product?.productType || 'Uncategorized',
        variant: merchandise.title || '',
        price: merchandise.price?.amount || '',
        quantity: `${quantity || ''}`,
        list,
        product_id: merchandise.product?.id?.split('/').pop() || '',
        variant_id: merchandise.id?.split('/').pop() || '',
        compare_at_price: merchandise.compareAtPrice?.amount || 'undefined',
        image: merchandise.image?.url || '',
        position: (line.index || index) + 1,
        url: `/products/${merchandise.product?.handle}`,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : error;
      console.error(`${ANALYTICS_NAME}: ❌ mapCartLine error:`, message);
      console.error(`${ANALYTICS_NAME}: ❌ mapCartLine line:`, line);
      return null;
    }
  };

export const pathWithoutLocalePrefix = (pathname = '', pathPrefix = '') => {
  if (!pathname) return pathname;
  // if prefix is provided, remove it from string directly
  if (pathPrefix) {
    return pathname.replace(
      pathPrefix.startsWith('/') ? pathPrefix : `/${pathPrefix}`,
      '',
    );
  }
  // otherwise remove locale based on `/aa-bb` pattern
  return pathname.replace(/^\/[a-zA-Z]{2}-[a-zA-Z]{2}/, '');
};
