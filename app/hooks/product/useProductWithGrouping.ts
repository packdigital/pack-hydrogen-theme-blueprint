import {useMemo} from 'react';
import type {
  Product,
  ProductVariant,
} from '@shopify/hydrogen/storefront-api-types';

import {COLOR_OPTION_NAME} from '~/lib/constants';
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

    // Build product-handle → subgroup-title map for synthetic color
    const hasColorOption = initialGrouping.allProducts.some(
      (p) =>
        p.options?.some((option) => option.name === COLOR_OPTION_NAME),
    );
    const productSubgroupMap = new Map<string, string>();
    if (!hasColorOption) {
      initialGrouping.subgroups?.forEach((subgroup) => {
        subgroup.products?.forEach(({handle}) => {
          productSubgroupMap.set(handle, subgroup.title);
        });
      });
    }

    const variantMap = new Map<string, ProductVariant>();
    initialGrouping.allProducts.forEach((groupProduct) => {
      const syntheticColor = productSubgroupMap.get(groupProduct.handle);
      groupProduct.variants?.nodes.forEach((variant) => {
        const options = variant.selectedOptions.map(
          (opt) => `${opt.name}:${opt.value}`,
        );
        if (syntheticColor) {
          options.push(`${COLOR_OPTION_NAME}:${syntheticColor}`);
        }
        const key = options.sort().join('|');
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
