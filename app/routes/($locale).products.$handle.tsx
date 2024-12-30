import {useLoaderData} from '@remix-run/react';
import {ProductProvider} from '@shopify/hydrogen-react';
import {json} from '@shopify/remix-oxygen';
import type {LoaderFunctionArgs, MetaArgs} from '@shopify/remix-oxygen';
import {Analytics, AnalyticsPageType, getSeoMeta} from '@shopify/hydrogen';
import type {ShopifyAnalyticsProduct} from '@shopify/hydrogen';
import {RenderSections} from '@pack/react';

import {
  getMetafields,
  getProductGroupings,
  getShop,
  getSiteSettings,
} from '~/lib/utils';
import {PRODUCT_PAGE_QUERY} from '~/data/graphql/pack/product-page';
import {PRODUCT_QUERY, PRODUCTS_QUERY} from '~/data/graphql/shopify/product';
import {Product} from '~/components';
import {routeHeaders} from '~/data/cache';
import {seoPayload} from '~/lib/seo.server';
import {useGlobal, useProductWithGrouping} from '~/hooks';
import type {Group, ProductWithInitialGrouping} from '~/lib/types';

/*
 * Add metafield queries to the METAFIELD_QUERIES array to fetch desired metafields for product pages
 * e.g. [{namespace: 'global', key: 'description'}, {namespace: 'product', key: 'seasonal_colors'}]
 */
const METAFIELD_QUERIES: {namespace: string; key: string}[] = [];

export const headers = routeHeaders;

export async function loader({params, context, request}: LoaderFunctionArgs) {
  const {handle} = params;
  const {storefront} = context;
  const pageData = await context.pack.query(PRODUCT_PAGE_QUERY, {
    variables: {handle},
    cache: context.storefront.CacheLong(),
  });

  const productPage = pageData?.data?.productPage;

  const storeDomain = storefront.getShopifyDomain();
  const searchParams = new URL(request.url).searchParams;
  const selectedOptions: Record<string, any>[] = [];

  // set selected options from the query string
  searchParams.forEach((value, name) => {
    if (name === 'variant' || name === 'srsltid' || name.startsWith('utm_'))
      return;
    selectedOptions.push({name, value});
  });

  let {product: queriedProduct} = await storefront.query(PRODUCT_QUERY, {
    variables: {
      handle,
      selectedOptions,
      country: storefront.i18n.country,
      language: storefront.i18n.language,
    },
    cache: storefront.CacheShort(),
  });

  if (!queriedProduct) throw new Response(null, {status: 404});

  if (METAFIELD_QUERIES?.length) {
    const metafields = await getMetafields(context, {
      handle,
      metafieldQueries: METAFIELD_QUERIES,
    });
    queriedProduct = {...queriedProduct, metafields};
  }

  const productGroupings = await getProductGroupings(context);

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
  let groupingProducts = undefined;

  if (grouping) {
    const productsToQuery = [
      ...grouping.products,
      ...grouping.subgroups.flatMap(({products}) => products),
    ];

    const idsQuery = productsToQuery
      .map(({id}) => `id:${id?.split('/').pop()}`)
      .join(' OR ');

    const {products: groupingProductsEdge} = await storefront.query(
      PRODUCTS_QUERY,
      {
        variables: {
          query: idsQuery,
          first: productsToQuery.length,
          country: storefront.i18n.country,
          language: storefront.i18n.language,
        },
        cache: storefront.CacheShort(),
      },
    );

    groupingProducts = groupingProductsEdge.nodes;
  }

  const product = {
    ...queriedProduct,
    ...(grouping
      ? {
          initialGrouping: {
            ...grouping,
            allProducts: [queriedProduct, ...groupingProducts],
          },
        }
      : null),
  } as ProductWithInitialGrouping;

  const selectedVariant = product.selectedVariant ?? product.variants?.nodes[0];

  const productAnalytics: ShopifyAnalyticsProduct = {
    productGid: product.id,
    variantGid: selectedVariant?.id || '',
    name: product.title,
    variantName: selectedVariant?.title || '',
    brand: product.vendor,
    price: selectedVariant?.price?.amount || '',
  };
  const analytics = {
    pageType: AnalyticsPageType.product,
    resourceId: product.id,
    products: [productAnalytics],
    totalValue: Number(selectedVariant?.price?.amount || 0),
  };
  const shop = await getShop(context);
  const siteSettings = await getSiteSettings(context);
  const seo = seoPayload.product({
    product,
    selectedVariant,
    page: productPage,
    shop,
    siteSettings,
    url: request.url,
  });

  return json({
    analytics,
    product,
    productPage,
    selectedVariant,
    seo,
    storeDomain,
    url: request.url,
  });
}

export const meta = ({matches}: MetaArgs<typeof loader>) => {
  return getSeoMeta(...matches.map((match) => (match.data as any).seo));
};

export default function ProductRoute() {
  const {
    product: initialProduct,
    productPage,
    selectedVariant: initialSelectedVariant,
  } = useLoaderData<typeof loader>();
  const {isCartReady} = useGlobal();
  const product = useProductWithGrouping(initialProduct);

  return (
    <ProductProvider
      data={product}
      initialVariantId={initialSelectedVariant?.id || null}
    >
      <div data-comp={ProductRoute.displayName}>
        <Product
          product={product}
          initialSelectedVariant={initialSelectedVariant}
        />

        {productPage && <RenderSections content={productPage} />}
      </div>

      {isCartReady && (
        <Analytics.ProductView
          data={{
            products: [
              {
                id: product.id,
                title: product.title,
                price: initialSelectedVariant?.price.amount || '0',
                vendor: product.vendor,
                variantId: initialSelectedVariant?.id || '',
                variantTitle: initialSelectedVariant?.title || '',
                quantity: 1,
              },
            ],
          }}
          customData={{product, selectedVariant: initialSelectedVariant}}
        />
      )}
    </ProductProvider>
  );
}

ProductRoute.displayName = 'ProductRoute';
