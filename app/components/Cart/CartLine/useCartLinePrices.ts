import {useMemo} from 'react';
import {useMoney} from '@shopify/hydrogen-react';
import type {CartLine} from '@shopify/hydrogen/storefront-api-types';

import {useLocale} from '~/hooks';
import {prefixNonUsdDollar} from '~/hooks/product/useVariantPrices';

export function useCartLinePrices({line}: {line: CartLine}) {
  const {cost, discountAllocations, id, quantity = 1} = {...line};
  const {currency} = useLocale();

  const discountAmount = useMemo(() => {
    return discountAllocations.reduce((acc: number, discount) => {
      if (discount?.discountedAmount?.amount) {
        return acc + Number(discount.discountedAmount.amount);
      }
      return acc;
    }, 0);
  }, [discountAllocations]);

  /* use over cost.amountPerQuantity.amount to account for discounts */
  const totalAmountPerQuantity = useMemo(() => {
    if (!cost?.subtotalAmount?.amount) return '';
    return (
      (Number(cost.subtotalAmount.amount) - discountAmount) /
      quantity
    ).toFixed(2);
  }, [cost?.subtotalAmount, discountAmount, quantity]);

  const formattedPrice = useMoney({
    amount: totalAmountPerQuantity,
    currencyCode: cost?.subtotalAmount?.currencyCode,
  });

  const formattedCompareAtPrice = useMoney({
    amount:
      cost?.compareAtAmountPerQuantity?.amount ||
      (discountAmount ? cost.amountPerQuantity.amount : ''), // show amountPerQuantity if item has discount applied
    currencyCode: cost?.compareAtAmountPerQuantity?.currencyCode || currency,
  });

  return useMemo(() => {
    if (!cost?.amountPerQuantity) return {price: null, compareAtPrice: null};
    const amount = Number(cost.amountPerQuantity.amount);
    const compareAtAmount = Number(
      cost.compareAtAmountPerQuantity?.amount || '0',
    );

    return {
      price: prefixNonUsdDollar(formattedPrice),
      compareAtPrice:
        compareAtAmount > amount || discountAmount > 0
          ? prefixNonUsdDollar(formattedCompareAtPrice)
          : null,
    };
  }, [cost, id]);
}
