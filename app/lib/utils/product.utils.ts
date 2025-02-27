import type {Product} from '@shopify/hydrogen/storefront-api-types';

import type {MetafieldIdentifier, ParsedMetafields} from '~/lib/types';

export const parseMetafieldsFromProduct = ({
  product,
  identifiers,
}: {
  product: Product;
  identifiers?: MetafieldIdentifier[];
}) => {
  if (!product.metafields) return {};
  return product.metafields.reduce(
    (acc: ParsedMetafields, metafield, index) => {
      if (!metafield) {
        if (!identifiers?.length) return acc;
        const query = identifiers[index];
        acc[`${query.namespace ? `${query.namespace}.` : ''}${query.key}`] =
          metafield;
        return acc;
      }
      acc[
        `${metafield.namespace ? `${metafield.namespace}.` : ''}${
          metafield.key
        }`
      ] = metafield;
      return acc;
    },
    {},
  );
};
