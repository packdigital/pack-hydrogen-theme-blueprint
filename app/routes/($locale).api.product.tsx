import type {LoaderFunctionArgs} from '@shopify/remix-oxygen';

import {getMetafields, normalizeAdminProduct} from '~/lib/utils';
import {PRODUCT_ITEM_QUERY} from '~/data/graphql/storefront/product';
import {ADMIN_PRODUCT_ITEM_QUERY} from '~/data/graphql/admin/product';
import {getBuyerVariables} from '~/lib/b2b.server';

export async function loader({request, context}: LoaderFunctionArgs) {
  const {admin, pack, storefront} = context;
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const handle = String(searchParams.get('handle') || '');
  const isPreviewModeEnabled = pack.isPreviewModeEnabled();

  if (!handle)
    return Response.json(
      {product: null, errors: ['Missing `handle` parameter']},
      {status: 400},
    );

  /* Product metafields identifiers by metafieldIdentifiers */
  const metafieldIdentifiersString = String(
    searchParams.get('metafieldIdentifiers') || '',
  );

  if (metafieldIdentifiersString) {
    let metafieldIdentifiers: {key: string; namespace: string}[] = [];
    try {
      metafieldIdentifiers = JSON.parse(metafieldIdentifiersString);
    } catch (error) {
      return Response.json(
        {
          metafields: null,
          errors: ['Invalid `metafieldIdentifiers` parameter'],
        },
        {status: 400},
      );
    }
    let isDraftProduct = false;
    if (admin && isPreviewModeEnabled) {
      const {productByIdentifier: adminProduct} = await admin.query(
        `
          query AdminProduct(
            $handle: String!
          ) {
            productByIdentifier(identifier: {handle: $handle}) {
              status
            }
          }
        `,
        {variables: {handle}, cache: admin.CacheShort()},
      );
      isDraftProduct = !!adminProduct && adminProduct.status === 'DRAFT';
    }
    const metafields = await getMetafields(context, {
      handle,
      isDraftProduct,
      identifiers: metafieldIdentifiers,
    });
    return Response.json({metafields});
  }

  /* Product query by handle */
  let product = null;

  const buyerVariables = await getBuyerVariables(context);

  const {product: storefrontProduct} = await storefront.query(
    PRODUCT_ITEM_QUERY,
    {
      variables: {
        handle,
        country: storefront.i18n.country,
        language: storefront.i18n.language,
        ...buyerVariables,
      },
      cache: storefront.CacheShort(),
    },
  );
  product = storefrontProduct;

  if (admin && isPreviewModeEnabled) {
    if (!product) {
      const {productByIdentifier: adminProduct} = await admin.query(
        ADMIN_PRODUCT_ITEM_QUERY,
        {variables: {handle}, cache: admin.CacheShort()},
      );
      if (adminProduct) product = normalizeAdminProduct(adminProduct);
    }
  }

  return Response.json({product});
}
