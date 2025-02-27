import {useLoaderData} from '@remix-run/react';
import {ProductProvider} from '@shopify/hydrogen-react';
import {Analytics, AnalyticsPageType, getSeoMeta} from '@shopify/hydrogen';
import {RenderSections} from '@pack/react';
import type {LoaderFunctionArgs, MetaArgs} from '@shopify/remix-oxygen';
import type {ShopifyAnalyticsProduct} from '@shopify/hydrogen';

import {
  getMetafields,
  getProductGroupings,
  getShop,
  getSiteSettings,
} from '~/lib/utils';
import {getGrouping} from '~/lib/products.server';
import {PRODUCT_PAGE_QUERY} from '~/data/graphql/pack/product-page';
import {PRODUCT_QUERY} from '~/data/graphql/storefront/product';
import {Product} from '~/components/Product';
import {routeHeaders} from '~/data/cache';
import {seoPayload} from '~/lib/seo.server';
import {useGlobal, useProductWithGrouping} from '~/hooks';
import type {ProductWithInitialGrouping} from '~/lib/types';

/*
 * Add metafield queries to the METAFIELD_QUERIES array to fetch desired metafields for product pages
 * e.g. [{namespace: 'global', key: 'description'}, {namespace: 'product', key: 'seasonal_colors'}]
 */
const METAFIELD_QUERIES: {namespace: string; key: string}[] = [];

export const headers = routeHeaders;

export async function loader({params, context, request}: LoaderFunctionArgs) {
  const {handle} = params;
  const {storefront} = context;

  const storeDomain = storefront.getShopifyDomain();
  const searchParams = new URL(request.url).searchParams;
  const selectedOptions: Record<string, any>[] = [];

  // set selected options from the query string
  searchParams.forEach((value, name) => {
    if (name === 'variant' || name === 'srsltid' || name.startsWith('utm_'))
      return;
    selectedOptions.push({name, value});
  });

  const [
    pageData,
    {product: storefrontProduct},
    productGroupings,
    shop,
    siteSettings,
  ] = await Promise.all([
    context.pack.query(PRODUCT_PAGE_QUERY, {
      variables: {handle},
      cache: context.storefront.CacheLong(),
    }),
    storefront.query(PRODUCT_QUERY, {
      variables: {
        handle,
        selectedOptions,
        country: storefront.i18n.country,
        language: storefront.i18n.language,
      },
      cache: storefront.CacheShort(),
    }),
    getProductGroupings(context),
    getShop(context),
    getSiteSettings(context),
  ]);

  let queriedProduct = storefrontProduct;

  const productPage = pageData?.data?.productPage;

  if (!queriedProduct) throw new Response(null, {status: 404});

  if (METAFIELD_QUERIES?.length) {
    const metafields = await getMetafields(context, {
      handle,
      metafieldQueries: METAFIELD_QUERIES,
    });
    queriedProduct = {...queriedProduct, metafields};
  }

  let grouping = undefined;
  let groupingProducts = undefined;

  if (productGroupings) {
    const groupingData = await getGrouping({
      context,
      handle,
      productGroupings,
    });
    grouping = groupingData.grouping;
    groupingProducts = groupingData.groupingProducts;
  }

  const product = {
    ...queriedProduct,
    ...(grouping
      ? {
          initialGrouping: {
            ...grouping,
            allProducts: [queriedProduct, ...(groupingProducts || [])],
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
  const seo = seoPayload.product({
    product,
    selectedVariant,
    page: productPage,
    shop,
    siteSettings,
    url: request.url,
  });

  return {
    analytics,
    product,
    productPage,
    selectedVariant,
    seo,
    storeDomain,
    url: request.url,
  };
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
