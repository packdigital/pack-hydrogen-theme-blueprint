import type {LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {parseGid} from '@shopify/hydrogen-react';
import type {Product} from '@shopify/hydrogen/storefront-api-types';

import {PRODUCT_FEED_QUERY} from '~/data/queries';
import {getPrimaryDomain} from '~/lib/utils';

const formatStr = (str: string) =>
  str.replaceAll(/&/g, '&amp;').replaceAll(/"/g, '&quot;');

const generatedProductFeed = (products: Product[], siteUrl: string) => {
  return `
    <rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
      <channel>
        <link>${siteUrl}</link>
        ${products
          .map((product) => {
            if (!product.variants.nodes.length) return '';
            if (product.handle === 'gift-card' || product.isGiftCard) return '';
            return product.variants.nodes.map((variant) => {
              const imageLink =
                variant.image?.src || product.featuredImage?.src;
              const variantUrlParams = variant.selectedOptions
                .map(({name, value}) => {
                  const formattedName = encodeURI(name);
                  return `${formattedName}=${value}`;
                })
                .join('&amp;');
              const link = `${siteUrl}/products/${product.handle}?${variantUrlParams}`;
              return `
                <item>
                  <g:id>${parseGid(variant.id).id}</g:id>
                  <g:product_type>${formatStr(
                    product.productType,
                  )}</g:product_type>
                  <g:gtin>${variant.sku}</g:gtin>
                  <g:link>${link}</g:link>
                  <g:brand>${formatStr(product.vendor)}</g:brand>
                  <g:condition>${`new`}</g:condition>
                  <g:availability>${
                    variant.availableForSale ? 'in stock' : 'out of stock'
                  }</g:availability>
                  <g:shipping_weight>${`${variant.weight} ${variant.weightUnit}`}</g:shipping_weight>
                  <g:title>${formatStr(product.title)}</g:title>
                  <g:description>${formatStr(product.description)}
                  }</g:description>
                  <g:price>${variant.price.amount}</g:price>
                  <g:item_group_id>${product.id
                    .split('/')
                    .pop()}</g:item_group_id>
                  ${
                    imageLink ? `<g:image_link>${imageLink}</g:image_link>` : ''
                  }
                  ${variant.selectedOptions
                    .map(({name, value}) => {
                      const formattedName = name
                        .replaceAll(/\s/g, '_')
                        .replaceAll(/&/g, '&amp;');
                      return `<g:${formattedName}>${formatStr(
                        value,
                      )}</g:${formattedName}>`;
                    })
                    .join('')}
                </item>
              `;
            });
          })
          .join('')}
      </channel>
    </rss>
  `;
};

export async function loader({context, request}: LoaderFunctionArgs) {
  const {storefront} = context;
  const PRIMARY_DOMAIN = getPrimaryDomain({context, request});

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
          first: 100,
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

  return new Response(generatedProductFeed(products, PRIMARY_DOMAIN), {
    headers: {
      'Content-Type': 'application/xml',
      'xml-version': '1.0',
      encoding: 'UTF-8',
    },
  });
}
