import {useMemo} from 'react';
import type {CartLine} from '@shopify/hydrogen/storefront-api-types';

import {COLOR_OPTION_NAME} from '~/lib/constants';

export function useCartLineImage({line}: {line: CartLine}) {
  const {merchandise} = {...line};

  return useMemo(() => {
    const hasMultipleColors =
      Number(
        merchandise?.product?.options?.find(({name}) => {
          return name === COLOR_OPTION_NAME;
        })?.values?.length,
      ) > 1;
    if (!hasMultipleColors) return merchandise?.image;

    const variantColor = merchandise.selectedOptions
      .find(({name}) => name === COLOR_OPTION_NAME)
      ?.value?.toLowerCase();

    return variantColor
      ? merchandise.product.images?.nodes?.find(({altText}) => {
          const imageColor = altText?.toLowerCase().trim();
          return imageColor === variantColor;
        }) || merchandise.image
      : merchandise.image;
  }, [merchandise?.id]);
}
