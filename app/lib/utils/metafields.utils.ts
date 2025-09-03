import type {AppLoadContext} from '@shopify/remix-oxygen';
import type {Metafield} from '@shopify/hydrogen/storefront-api-types';

import type {MetafieldIdentifier} from '~/lib/types';

import {parseMetafieldsFromProduct} from './product.utils';

/*
 * IMPORTANT: Update both metafields query strings together, one for Storefront
 * API and Admin API
 */

/* Metafields graphql query with Storefront API */
export const getMetafieldsQueryString = (
  identifiers: MetafieldIdentifier[] = [],
) => {
  const identifiersString = JSON.stringify(identifiers)
    .replaceAll('"namespace"', 'namespace')
    .replaceAll('"key"', 'key');
  return `
    metafields(identifiers: ${identifiersString}) {
      createdAt
      description
      id
      key
      namespace
      type
      updatedAt
      value
      references(first: 10) {
        nodes {
          ... on Metaobject {
            fields {
              key
              type
              value
            }
          }
        }
      }
    }`;
};

/* Metafields graphql query with Admin API for draft products */
export const ADMIN_PRODUCTS_METAFIELDS_QUERY_STRING = `
  metafields(first: 50) {
    nodes {
      createdAt
      description
      id
      key
      namespace
      type
      updatedAt
      value
      references(first: 10) {
        nodes {
          ... on Metaobject {
            fields {
              key
              type
              value
            }
          }
        }
      }
    }
  }`;

export const getMetafields = async (
  context: AppLoadContext,
  {
    handle,
    isDraftProduct,
    identifiers,
  }: {
    handle: string | undefined;
    isDraftProduct?: boolean;
    identifiers: MetafieldIdentifier[];
  },
): Promise<Record<string, Metafield | null> | null> => {
  const {admin, storefront} = context;

  if (!handle || !identifiers?.length) return null;

  let metafields;

  if (admin && isDraftProduct) {
    const ADMIN_PRODUCT_METAFIELDS_QUERY = `
      query AdminProductMetafields(
        $handle: String!
      ) {
        productByIdentifier(identifier: {handle: $handle}) {
          ${ADMIN_PRODUCTS_METAFIELDS_QUERY_STRING}
        }
      }
    `;

    const {productByIdentifier: adminProduct} = await admin.query(
      ADMIN_PRODUCT_METAFIELDS_QUERY,
      {
        variables: {
          handle,
        },
        cache: admin.CacheShort(),
      },
    );

    if (!adminProduct) return {};

    metafields = parseMetafieldsFromProduct({
      product: {...adminProduct, metafields: adminProduct.metafields?.nodes},
      identifiers,
    });
  } else {
    const PRODUCT_METAFIELDS_QUERY = `#graphql
      query ProductMetafields(
        $handle: String!
        $country: CountryCode
        $language: LanguageCode
      ) @inContext(country: $country, language: $language) {
        product(handle: $handle) {
          ${getMetafieldsQueryString(identifiers)}
        }
      }
    `;

    const {product: storefrontProduct} = await storefront.query(
      PRODUCT_METAFIELDS_QUERY,
      {
        variables: {
          handle,
          country: storefront.i18n.country,
          language: storefront.i18n.language,
        },
        cache: storefront.CacheShort(),
      },
    );

    if (!storefrontProduct) return {};

    metafields = parseMetafieldsFromProduct({
      product: storefrontProduct,
      identifiers,
    });
  }

  return metafields;
};
