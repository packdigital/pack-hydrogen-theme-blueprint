import {useCallback, useEffect} from 'react';
import type {
  Product,
  ProductVariant,
} from '@shopify/hydrogen/storefront-api-types';

import {useGlobal} from '~/hooks';

export function useDataLayerViewProduct({
  selectedVariant,
  product,
}: {
  selectedVariant?: ProductVariant | null;
  product: Product;
}) {
  const {emitter} = useGlobal();

  const sendViewProductEvent = useCallback(
    async ({
      product,
      selectedVariant: _selectedVariant,
    }: {
      product: Product;
      selectedVariant?: ProductVariant | null;
    }) => {
      if (!product) return;
      let selectedVariant = _selectedVariant;
      // if no selected variant is passed, use the first variant
      if (!selectedVariant) {
        selectedVariant = product.variants?.nodes?.[0];
      }
      if (!selectedVariant) return;

      selectedVariant = {
        ...selectedVariant,
        image: selectedVariant.image || product.featuredImage,
        product: {
          ...selectedVariant.product,
          vendor: product.vendor,
          collections: product.collections,
        },
      };

      emitter?.emit('VIEW_PRODUCT_PAGE', selectedVariant);
    },
    [emitter?._eventsCount],
  );

  useEffect(() => {
    if (!emitter?._events['VIEW_PRODUCT_PAGE']) return;
    if (!product) return;
    sendViewProductEvent({product, selectedVariant});
  }, [emitter?._eventsCount, product?.handle]);
}
