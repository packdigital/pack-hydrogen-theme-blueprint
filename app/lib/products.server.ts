import invariant from 'tiny-invariant';
import type {AppLoadContext} from '@shopify/remix-oxygen';
import type {
  Product,
  ProductVariant,
} from '@shopify/hydrogen/storefront-api-types';

import {
  PRODUCT_OPTIONS_QUERY,
  PRODUCT_QUERY,
  PRODUCTS_QUERY,
} from '~/data/graphql/storefront/product';
import {
  ADMIN_PRODUCT_ITEM_BY_ID_QUERY,
  ADMIN_PRODUCT_QUERY,
} from '~/data/graphql/admin/product';
import {getProductGroupings, normalizeAdminProduct} from '~/lib/utils';
import {SHOPPABLE_SOCIAL_VIDEO_SECTION_KEY} from '~/sections/ShoppableSocialVideo';
import {PRODUCT_SECTION_KEY} from '~/sections/Product';
import {MODAL_PRODUCT_URL_PARAM} from '~/lib/constants';
import type {Group, Page, ProductWithInitialGrouping} from '~/lib/types';

export const getSelectedProductOptions = async ({
  handle,
  context,
  request,
}: {
  handle?: string;
  context: AppLoadContext;
  request: Request;
}) => {
  const {storefront} = context;
  const searchParams = new URL(request.url).searchParams;
  const selectedOptions: Record<string, any>[] = [];

  if (searchParams.size) {
    // Query for product's options
    const {product: productWithOptions} = await storefront.query(
      PRODUCT_OPTIONS_QUERY,
      {
        variables: {
          handle,
          country: storefront.i18n.country,
          language: storefront.i18n.language,
        },
        cache: storefront.CacheShort(),
      },
    );
    if (productWithOptions) {
      const optionsTable = Object.values({
        ...productWithOptions.options,
      } as Product['options']).reduce((acc: Record<string, string>, option) => {
        return {...acc, [option.name.toLowerCase()]: option.name};
      }, {});
      // Set selected options from the query string
      searchParams.forEach((value, name) => {
        // Filter out non-option search params
        if (!optionsTable[name.toLowerCase()]) return;
        selectedOptions.push({name, value});
      });
    }
  }

  return selectedOptions;
};

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

  if (admin && isPreviewModeEnabled) {
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

export const getModalProduct = async ({
  context,
  request,
}: {
  context: AppLoadContext;
  request: Request;
}) => {
  const {admin, pack, storefront} = context;
  const isPreviewModeEnabled = pack.isPreviewModeEnabled();
  const searchParams = new URL(request.url).searchParams;
  const modalProductHandle = String(
    searchParams.get(MODAL_PRODUCT_URL_PARAM) || '',
  );
  let modalProduct: ProductWithInitialGrouping | undefined;
  let modalSelectedVariant: ProductVariant | undefined;
  if (modalProductHandle) {
    const [handle, options] = modalProductHandle.split('?');
    const variantParams = new URLSearchParams(options);
    const selectedOptions: Record<string, any>[] = [];
    variantParams.forEach((value, name) => {
      selectedOptions.push({name, value});
    });
    let queriedProduct = undefined;

    const {product: storefrontProduct} = await storefront.query(PRODUCT_QUERY, {
      variables: {
        handle,
        selectedOptions,
        country: storefront.i18n.country,
        language: storefront.i18n.language,
      },
      cache: storefront.CacheShort(),
    });
    queriedProduct = storefrontProduct;

    if (admin && isPreviewModeEnabled && !queriedProduct) {
      const {productByIdentifier: adminProduct} = await admin.query(
        ADMIN_PRODUCT_QUERY,
        {variables: {handle}, cache: admin.CacheShort()},
      );
      if (adminProduct) queriedProduct = normalizeAdminProduct(adminProduct);
    }

    modalProduct = queriedProduct;
    modalSelectedVariant =
      (modalProduct as Product & {selectedVariant?: ProductVariant})
        ?.selectedVariant ?? modalProduct?.variants?.nodes[0];
  }

  const productGroupings = await getProductGroupings(context);

  if (productGroupings) {
    const groupingData = await getGrouping({
      context,
      handle: modalProduct?.handle,
      productGroupings,
    });
    const grouping = groupingData.grouping;
    const groupingProducts = groupingData.groupingProducts;

    if (grouping) {
      modalProduct = {
        ...modalProduct,
        initialGrouping: {
          ...grouping,
          allProducts: [modalProduct, ...(groupingProducts || [])],
        },
      } as ProductWithInitialGrouping;
    }
  }

  return {modalProduct, modalSelectedVariant};
};

export const getProductsMapForPage = async ({
  context,
  page,
}: {
  context: AppLoadContext;
  page: Page;
}) => {
  const {admin, pack} = context;
  const isPreviewModeEnabled = pack.isPreviewModeEnabled();

  const productsMap: Record<string, Product> = {};
  const sectionsByKey = page.sections?.nodes?.reduce(
    (acc: Record<string, Record<string, any>[]>, section) => {
      return {
        ...acc,
        [section.data?._template]: [
          ...(acc[section.data?._template] || []),
          section,
        ],
      };
    },
    {},
  ) as Record<string, Record<string, any>[]>;
  const shoppableSocialVideoSectionsProductIds =
    sectionsByKey?.[SHOPPABLE_SOCIAL_VIDEO_SECTION_KEY]?.filter((section) => {
      return section.data?.sectionVisibility === 'visible';
    })
      ?.flatMap((section) => {
        return section.data?.products?.map(({product}) => product?.id) || [];
      })
      ?.filter(Boolean) || [];
  const productSectionsProductHandles =
    sectionsByKey?.[PRODUCT_SECTION_KEY]?.filter((section) => {
      return section.data?.sectionVisibility === 'visible';
    })?.map((section) => section.data?.product?.id) || [];
  const productIds = [
    ...shoppableSocialVideoSectionsProductIds,
    ...productSectionsProductHandles,
  ];

  if (productIds?.length) {
    let {products} = await queryProducts({
      context,
      query: PRODUCTS_QUERY,
      variables: {
        query: productIds
          .filter(Boolean)
          .map((id) => {
            return `id:${typeof id === 'number' ? id : id.split('/').pop()}`;
          })
          .join(' OR '),
      },
      count: productIds.length,
    });

    if (admin && isPreviewModeEnabled) {
      if (products?.length !== productIds.length) {
        const productsById = products?.reduce((acc, product) => {
          if (product.id) acc[product.id] = product;
          return acc;
        }, {} as Record<string, Product>);
        const productsWithDrafts = await Promise.all(
          productIds.map(async (id) => {
            if (productsById?.[id]) return productsById[id];
            const {productByIdentifier: adminProduct} = await admin.query(
              ADMIN_PRODUCT_ITEM_BY_ID_QUERY,
              {variables: {id}, cache: admin.CacheShort()},
            );
            if (!adminProduct) return null;
            return normalizeAdminProduct(adminProduct);
          }),
        );
        products = productsWithDrafts.filter(Boolean) as Product[];
      }
    }

    products.forEach((product) => {
      if (!product) return;
      productsMap[product.handle] = product;
    });
  }
  return productsMap;
};
