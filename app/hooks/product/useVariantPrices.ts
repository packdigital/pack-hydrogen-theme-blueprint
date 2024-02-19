import {useMemo} from 'react';
import {useMoney} from '@shopify/hydrogen-react';
import type {ProductVariant} from '@shopify/hydrogen/storefront-api-types';

import {useLocale} from '~/hooks';

/**
 * Get the formatted price and compareAtPrice for a product variant
 * @param variant - The product variant
 * @returns object with formatted price and compareAtPrice
 * @example
 * ```js
 * const {price, compareAtPrice} = useVariantPrices(variant);
 * ```
 */

// prefix non-USD dollar amounts with currency code
export const prefixNonUsdDollar = (money: ReturnType<typeof useMoney>) => {
  if (!money) return '';
  const localizedString = money.withoutTrailingZeros;
  if (money.currencySymbol !== '$' || money.currencyCode === 'USD')
    return localizedString;
  return `${money.currencyCode} ${localizedString}`;
};

export function useVariantPrices(variant: ProductVariant | undefined | null): {
  price: string | undefined;
  compareAtPrice: string | undefined;
} {
  const {currency} = useLocale();
  const {id, price, compareAtPrice} = {...variant};
  const formattedPrice = useMoney({
    amount: price?.amount || '',
    currencyCode: price?.currencyCode || currency,
  });
  const formattedCompareAtPrice = useMoney({
    amount: compareAtPrice?.amount || '',
    currencyCode: compareAtPrice?.currencyCode || currency,
  });

  return useMemo(() => {
    if (!price?.amount) {
      return {price: undefined, compareAtPrice: undefined};
    }
    const amount = parseFloat(price.amount);
    const compareAtAmount = parseFloat(compareAtPrice?.amount || '0');

    return {
      price: prefixNonUsdDollar(formattedPrice),
      compareAtPrice:
        compareAtAmount > amount
          ? prefixNonUsdDollar(formattedCompareAtPrice)
          : undefined,
    };
  }, [id]);
}
