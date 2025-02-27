import invariant from 'tiny-invariant';
import type {AppLoadContext} from '@shopify/remix-oxygen';
import type {Product} from '@shopify/hydrogen/storefront-api-types';

import {PRODUCTS_QUERY} from '~/data/graphql/storefront/product';
import {ADMIN_PRODUCT_ITEM_BY_ID_QUERY} from '~/data/graphql/admin/product';
import {normalizeAdminProduct} from '~/lib/utils';
import type {Group} from '~/lib/types';

const FIRST = 250;

interface QueryProductsProps {
  context: AppLoadContext;
  query: string;
  variables?: Record<string, string | boolean | number | null>;
  count?: number;
}

export const queryProducts = async ({
  context,
  query,
  variables,
  count: passedCount = 10,
}: QueryProductsProps) => {
  if (!context || !query) return {products: [], hasMoreProducts: false};
  const {storefront} = context;

  let count = Number(passedCount);
  if (!count) count = 10;
  const isAll = count === Infinity; // only advisable for small inventory stores

  const initialFirst = isAll ? FIRST : count > FIRST ? FIRST : count;

  const getProducts = async ({
    products,
    cursor,
    first,
  }: {
    products: Product[] | null;
    cursor: string | null;
    first: number;
  }): Promise<{products: Product[]; hasMoreProducts: boolean}> => {
    const {products: queriedProducts} = await storefront.query(query, {
      variables: {
        ...variables,
        first,
        endCursor: cursor,
        country: storefront.i18n.country,
        language: storefront.i18n.language,
      },
      cache: storefront.CacheShort(),
    });
    const {endCursor, hasNextPage} = queriedProducts.pageInfo;
    const compiledProducts = [...(products || []), ...queriedProducts.nodes];
    if (hasNextPage && compiledProducts.length < count) {
      return getProducts({
        products: compiledProducts,
        cursor: endCursor,
        first: Math.min(first, count - compiledProducts.length),
      });
    }
    return {products: compiledProducts, hasMoreProducts: hasNextPage};
  };

  const {products, hasMoreProducts} = await getProducts({
    products: null,
    cursor: null,
    first: initialFirst,
  });

  invariant(products, 'No data returned from top search query');

  return {products, hasMoreProducts};
};

export const getGrouping = async ({
  context,
  handle,
  productGroupings,
}: {
  context: AppLoadContext;
  handle?: string;
  productGroupings: Group[];
}): Promise<{grouping?: Group; groupingProducts?: Product[]}> => {
  const {admin, pack} = context;
  const isPreviewModeEnabled = pack.isPreviewModeEnabled();

  let groupingProducts = undefined;

  const grouping: Group | undefined = [...(productGroupings || [])].find(
    (grouping: Group) => {
      const groupingProducts = [
        ...grouping.products,
        ...grouping.subgroups.flatMap(({products}) => products),
      ];
      return groupingProducts.some(
        (groupProduct) => groupProduct.handle === handle,
      );
    },
  );

  if (!grouping) return {grouping, groupingProducts};

  const productsToQuery = [
    ...grouping.products,
    ...grouping.subgroups.flatMap(({products}) => products),
  ];

  const idsQuery = productsToQuery
    .map(({id}) => `id:${id?.split('/').pop()}`)
    .join(' OR ');

  const {products: queriedGroupingProducts} = await queryProducts({
    context,
    query: PRODUCTS_QUERY,
    variables: {query: idsQuery},
    count: productsToQuery.length,
  });

  groupingProducts = queriedGroupingProducts;

  if (isPreviewModeEnabled) {
    if (queriedGroupingProducts?.length !== productsToQuery.length) {
      const groupingProductsById = queriedGroupingProducts?.reduce(
        (acc: Record<string, Product>, product) => {
          return {...acc, [product.id]: product};
        },
        {},
      );

      const groupingProductsWithDrafts = await Promise.all(
        productsToQuery.map(async (groupProduct) => {
          if (groupingProductsById[groupProduct.id])
            return groupingProductsById[groupProduct.id];
          const {productByIdentifier: adminProduct} = await admin.query(
            ADMIN_PRODUCT_ITEM_BY_ID_QUERY,
            {variables: {id: groupProduct.id}, cache: admin.CacheShort()},
          );
          if (!adminProduct) return null;
          return normalizeAdminProduct(adminProduct);
        }),
      );
      groupingProducts = groupingProductsWithDrafts.filter(Boolean);
    }
  }

  return {grouping, groupingProducts};
};
