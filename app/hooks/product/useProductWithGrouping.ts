import {useMemo} from 'react';
import type {
  Product,
  ProductVariant,
} from '@shopify/hydrogen/storefront-api-types';

import {formatGroupingWithOptions} from '~/lib/utils';
import type {
  Group,
  ProductWithGrouping,
  ProductWithInitialGrouping,
} from '~/lib/types';

export function useProductWithGrouping(
  initialProduct: ProductWithInitialGrouping,
): ProductWithGrouping {
  return useMemo(() => {
    if (!initialProduct) return initialProduct;
    const {initialGrouping, ...restProduct} = initialProduct;
    const productWithoutInitialGrouping = restProduct as Product;
    if (!initialGrouping) return initialProduct;

    const groupingProductsByHandle = initialGrouping.allProducts.reduce(
      (acc: Record<string, Product>, product) => {
        acc[product.handle] = product;
        return acc;
      },
      {},
    );
    groupingProductsByHandle[productWithoutInitialGrouping.handle] =
      productWithoutInitialGrouping;

    const groupingWithOptions = formatGroupingWithOptions({
      grouping: initialGrouping,
      getProductByHandle: (handle) => groupingProductsByHandle[handle],
    });

    const variantMap = new Map<string, ProductVariant>();
    initialGrouping.allProducts.forEach((groupProduct) => {
      groupProduct.variants?.nodes.forEach((variant) => {
        const key = variant.selectedOptions
          .map((opt) => `${opt.name}:${opt.value}`)
          .sort()
          .join('|');
        variantMap.set(key, variant);
      });
    });

    const completeGrouping = {
      ...groupingWithOptions,
      productsByHandle: groupingProductsByHandle,
      variantMap,
    } as Group;

    const productWithGrouping = {
      ...productWithoutInitialGrouping,
      ...(completeGrouping?.products.length ||
      completeGrouping?.subgroups.length
        ? {grouping: completeGrouping}
        : null),
    };
    return productWithGrouping;
  }, [initialProduct]);
}
