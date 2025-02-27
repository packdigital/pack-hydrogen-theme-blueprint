import {parseGid} from '@shopify/hydrogen-react';
import {XMLBuilder} from 'fast-xml-parser';
import type {LoaderFunctionArgs} from '@shopify/remix-oxygen';
import type {Product} from '@shopify/hydrogen/storefront-api-types';

import {PRODUCT_FEED_QUERY} from '~/data/graphql/storefront/product';

const SAFE_XML: Record<string, string> = {
  '&': '&amp;',
  '"': '&quot;',
  '<': '&lt;',
  '>': '&gt;',
  '\\': '&apos;',
};

const formatStr = (str = '') =>
  str.split('').reduce((acc, char) => {
    return acc + (SAFE_XML[char] || char);
  }, '');

export async function loader({context, request}: LoaderFunctionArgs) {
  const {storefront} = context;

  const baseUrl = new URL(request.url).origin;

  const getAllProducts = async ({
    products,
    cursor,
  }: {
    products: Product[] | null;
    cursor: string | null;
  }): Promise<Product[]> => {
    const {products: queriedProducts} = await storefront.query(
      PRODUCT_FEED_QUERY,
      {
        variables: {
          first: 250,
          cursor,
          country: storefront.i18n.country,
          language: storefront.i18n.language,
        },
        cache: storefront.CacheShort(),
      },
    );
    const {endCursor, hasNextPage} = queriedProducts.pageInfo;
    const compiledProducts = [...(products || []), ...queriedProducts.nodes];
    if (hasNextPage) {
      return getAllProducts({
        products: compiledProducts,
        cursor: endCursor,
      });
    }
    return compiledProducts;
  };
  const products = await getAllProducts({
    products: null,
    cursor: null,
  });

  const xmlToBuild = {
    rss: {
      '@_xmlns:g': 'http://base.google.com/ns/1.0',
      '@_version': '2.0',
      channel: {
        link: baseUrl,
        item: products.reduce((acc: Record<string, string>[], product) => {
          try {
            if (!product.variants?.nodes.length) return acc;
            if (product.handle === 'gift-card' || product.isGiftCard)
              return acc;
            const items = product.variants.nodes.map((variant) => {
              const imageLink =
                variant.image?.url || product.featuredImage?.url;
              const variantUrlParams = variant.selectedOptions
                .map(({name, value}) => {
                  return `${encodeURI(name)}=${encodeURI(value)}`;
                })
                .join('&amp;');
              const link = `${baseUrl}/products/${product.handle}?${variantUrlParams}`;
              return {
                'g:id': parseGid(variant.id).id,
                'g:product_type': formatStr(product.productType),
                'g:gtin': variant.sku,
                'g:link': link,
                'g:brand': formatStr(product.vendor),
                'g:condition': 'new',
                'g:availability': variant.availableForSale
                  ? 'in stock'
                  : 'out of stock',
                'g:shipping_weight': `${variant.weight} ${variant.weightUnit}`,
                'g:title': formatStr(product.title),
                'g:description': formatStr(product.description?.slice(0, 256)),
                'g:price': variant.price.amount,
                'g:item_group_id': product.id.split('/').pop(),
                ...(imageLink ? {'g:image_link': imageLink} : {}),
                ...variant.selectedOptions.reduce((acc, {name, value}) => {
                  const formattedName = formatStr(name).replaceAll(/\s/g, '_');
                  return {
                    ...acc,
                    [`g:${formattedName}`]: formatStr(value),
                  };
                }, {}),
              };
            });
            return [...acc, ...items];
          } catch (error) {
            return acc;
          }
        }, []),
      },
    },
  };

  const xmlBuilder = new XMLBuilder({ignoreAttributes: false});
  const productFeedXml = xmlBuilder.build(xmlToBuild);

  return new Response(productFeedXml, {
    headers: {
      'Content-Type': 'application/xml',
      'xml-version': '1.0',
      encoding: 'UTF-8',
      'Cache-Control': `max-age=${60 * 60 * 24}`,
    },
  });
}
