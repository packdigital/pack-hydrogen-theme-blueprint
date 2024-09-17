import {useMemo} from 'react';
import type {Product} from '@shopify/hydrogen/storefront-api-types';

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

    const groupingProductsByOptionValue = initialGrouping.allProducts.reduce(
      (acc: Record<string, Record<string, Product[]>>, groupProduct) => {
        groupProduct.options.forEach((option) => {
          const {name, optionValues} = option;
          if (!optionValues) return;
          optionValues.forEach((optionValue) => {
            if (!acc[name]) acc[name] = {};
            acc[name][optionValue.name] = [
              ...(acc[name][optionValue.name] || []),
              groupProduct,
            ];
          });
        });
        return acc;
      },
      {},
    );

    const completeGrouping = {
      ...groupingWithOptions,
      productsByHandle: groupingProductsByHandle,
      productsByOptionValue: groupingProductsByOptionValue,
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
