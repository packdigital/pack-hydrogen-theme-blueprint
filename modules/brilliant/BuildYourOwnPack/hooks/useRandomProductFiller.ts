import type {ProductVariant} from '@shopify/hydrogen-react/storefront-api-types';
import {useState, useCallback, useEffect} from 'react';

import {useProductsByIds} from '~/hooks/product/useProductsByIds';
import type {ProductCms} from '~/lib/types';

export function useRandomProductFiller(
  selectedItems: ProductVariant[],
  products: ProductCms[],
  bundleSize: number,
  handleAddToBundle: (variant: ProductVariant) => void,
) {
  const [loading, setLoading] = useState(false);
  const [randomIds, setRandomIds] = useState<string[]>([]);
  const randomProducts = useProductsByIds(randomIds, !!randomIds.length);

  // Helper to get random product IDs not already selected
  const getRandomProductIds = useCallback(() => {
    const selectedProductIds = new Set(
      selectedItems.map((item) => item.product?.id),
    );
    const available = products.filter(
      (p) => p.id && !selectedProductIds.has(p.id),
    );
    // Shuffle
    const shuffled = [...available].sort(() => 0.5 - Math.random());
    // Pick as many as needed
    const needed = bundleSize - selectedItems.length;
    return shuffled.slice(0, needed).map((p) => p.id);
  }, [products, selectedItems, bundleSize]);

  const fillRandomly = useCallback(() => {
    setLoading(true);
    const ids = getRandomProductIds();
    setRandomIds(ids);
  }, [getRandomProductIds]);

  useEffect(() => {
    if (!loading || !randomProducts.length) return;
    randomProducts.forEach((product) => {
      if (product.variants?.nodes?.[0]) {
        handleAddToBundle(product.variants.nodes[0]);
      }
    });
    setRandomIds([]);
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [randomProducts]);

  return {fillRandomly, randomLoading: loading};
}
