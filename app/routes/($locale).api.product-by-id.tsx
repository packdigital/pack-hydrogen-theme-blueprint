import {data as dataWithOptions} from '@shopify/remix-oxygen';
import type {LoaderFunctionArgs} from '@shopify/remix-oxygen';

import {PRODUCT_ITEM_QUERY_BY_ID} from '~/data/graphql/storefront/product';
import {ADMIN_PRODUCT_ITEM_BY_ID_QUERY} from '~/data/graphql/admin/product';
import {normalizeAdminProduct} from '~/lib/utils';

export async function loader({request, context}: LoaderFunctionArgs) {
  const {admin, pack, storefront} = context;
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const id = String(searchParams.get('id') || '');
  const isPreviewModeEnabled = pack.isPreviewModeEnabled();

  if (!id)
    return dataWithOptions(
      {product: null, errors: ['Missing `id` parameter']},
      {status: 400},
    );

  let product = null;

  /* Product query by id */
  const {product: storefrontProduct} = await storefront.query(
    PRODUCT_ITEM_QUERY_BY_ID,
    {
      variables: {
        id,
        country: storefront.i18n.country,
        language: storefront.i18n.language,
      },
      cache: storefront.CacheShort(),
    },
  );
  product = storefrontProduct;

  if (admin && isPreviewModeEnabled) {
    if (!product) {
      const {productByIdentifier: adminProduct} = await admin.query(
        ADMIN_PRODUCT_ITEM_BY_ID_QUERY,
        {variables: {id}, cache: admin.CacheShort()},
      );
      if (adminProduct) product = normalizeAdminProduct(adminProduct);
    }
  }

  return {product};
}
