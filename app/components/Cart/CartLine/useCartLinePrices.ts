import {useMemo} from 'react';
import {useMoney} from '@shopify/hydrogen-react';

import {useLocale} from '~/hooks';
import {prefixNonUsdDollar} from '~/hooks/product/useVariantPrices';
import type {OptimisticCartLine} from '~/lib/types';

export function useCartLinePrices({line}: {line: OptimisticCartLine}) {
  const {cost, discountAllocations, id} = {...line};
  const {currency} = useLocale();

  // When a line's quantity is optimistic, `cost` is still the last server value
  // (money is never optimistic), so divide by the server quantity that matches
  // that cost to keep the displayed per-unit price stable until reconcile.
  const quantity = line._serverQuantity ?? line.quantity ?? 1;

  const discountAmount = useMemo(() => {
    if (!discountAllocations) return 0;
    return discountAllocations.reduce((acc: number, discount) => {
      if (discount?.discountedAmount?.amount) {
        return acc + Number(discount.discountedAmount.amount);
      }
      return acc;
    }, 0);
  }, [discountAllocations]);

  /* use over cost.amountPerQuantity.amount to account for discounts */
  const totalAmountPerQuantity = !cost?.subtotalAmount?.amount
    ? ''
    : (
        (Number(cost.subtotalAmount.amount) - discountAmount) /
        quantity
      ).toFixed(2);

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
