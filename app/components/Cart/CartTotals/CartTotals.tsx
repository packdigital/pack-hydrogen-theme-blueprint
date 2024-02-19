import {useMemo} from 'react';
import {useCart, useMoney} from '@shopify/hydrogen-react';
import type {CartWithActions} from '@shopify/hydrogen-react';
import type {
  Cart,
  CartCodeDiscountAllocation,
} from '@shopify/hydrogen/storefront-api-types';

import {prefixNonUsdDollar} from '~/hooks/product/useVariantPrices';
import {useLocale} from '~/hooks';

import type {CartTotalsProps} from '../Cart.types';
import {MultipassCheckoutButton} from '../MultipassCheckoutButton';

import {CartTotalsDiscountItem} from './CartTotalsDiscountItem';

export function CartTotals({settings}: CartTotalsProps) {
  const {currency} = useLocale();
  const {
    checkoutUrl = '',
    cost,
    discountAllocations = [],
    totalQuantity = 0,
  } = useCart() as CartWithActions & {
    discountAllocations: Cart['discountAllocations'];
  };

  const parsedDiscountAllocations = useMemo((): Cart['discountAllocations'] => {
    const codes: string[] = [];
    return discountAllocations.reduce(
      (acc: CartCodeDiscountAllocation[], allocation: any) => {
        if (!allocation.code) return [...acc, allocation];
        if (!codes.includes(allocation.code)) {
          codes.push(allocation.code);
          return [...acc, allocation];
        }
        const codeIndex = acc.findIndex(
          (a: CartCodeDiscountAllocation) => a.code === allocation.code,
        );
        const previous = acc[codeIndex];
        const current = {
          ...previous,
          discountedAmount: {
            amount: (
              Number(previous.discountedAmount.amount) +
              Number(allocation.discountedAmount.amount)
            ).toFixed(2),
            currencyCode: previous.discountedAmount.currencyCode,
          },
        };
        acc.splice(codeIndex, 1, current);
        return acc;
      },
      [],
    );
  }, [discountAllocations]);

  const discountAmount = useMemo(() => {
    return discountAllocations.reduce((acc: number, discount) => {
      if (discount?.discountedAmount?.amount) {
        return acc + Number(discount.discountedAmount.amount);
      }
      return acc;
    }, 0);
  }, [discountAllocations]);

  const formattedSubtotal = useMoney({
    amount: cost?.subtotalAmount?.amount || '',
    currencyCode: cost?.subtotalAmount?.currencyCode || currency,
  });

  // total = subtotal - discountAmount (discount code applied to cart level)
  const formattedTotal = useMoney({
    amount: cost?.subtotalAmount?.amount
      ? (Number(cost.subtotalAmount.amount) - discountAmount).toFixed(2)
      : '',
    currencyCode: cost?.subtotalAmount?.currencyCode || currency,
  });

  const subtotalAmount = prefixNonUsdDollar(formattedSubtotal);
  const totalAmount = prefixNonUsdDollar(formattedTotal);
  const {checkoutText = 'Checkout', subtext = ''} = {
    ...settings?.totals,
  };
  const isDiscounted = discountAmount > 0;

  return (
    <div
      className={`flex-col gap-4 border-t border-t-border p-4 ${
        totalQuantity ? 'flex' : 'hidden'
      }`}
    >
      <div className="flex flex-col gap-1">
        {isDiscounted && (
          <>
            {subtotalAmount !== totalAmount && (
              <div className="flex justify-between">
                <p className="font-bold">Subtotal</p>
                <p>{subtotalAmount}</p>
              </div>
            )}

            {parsedDiscountAllocations?.length > 0 &&
              parsedDiscountAllocations.map((discount, index) => {
                return (
                  <CartTotalsDiscountItem discount={discount} key={index} />
                );
              })}
          </>
        )}

        <div className="flex justify-between">
          <p className="font-bold">Total</p>
          <p>{totalAmount}</p>
        </div>

        {subtext && <p className="text-xs">{subtext}</p>}
      </div>

      <MultipassCheckoutButton
        className="btn-primary w-full"
        checkoutUrl={checkoutUrl}
      >
        {checkoutText}
      </MultipassCheckoutButton>
    </div>
  );
}

CartTotals.displayName = 'CartTotals';
