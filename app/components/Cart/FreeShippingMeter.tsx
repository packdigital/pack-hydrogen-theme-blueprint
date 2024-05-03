import {useMemo} from 'react';
import {useCart} from '@shopify/hydrogen-react';
import type {CartWithActions} from '@shopify/hydrogen-react';
import type {Cart} from '@shopify/hydrogen/storefront-api-types';

import {useLocale} from '~/hooks';

import type {FreeShippingMeterProps} from './Cart.types';

export function FreeShippingMeter({settings}: FreeShippingMeterProps) {
  const {
    cost,
    discountAllocations = [],
    totalQuantity = 0,
  } = useCart() as CartWithActions & {
    discountAllocations: Cart['discountAllocations'];
  };
  const {pathPrefix} = useLocale();
  const {
    enabled,
    minCartSpend = 0,
    progressBarColor = 'black',
    progressMessage = '',
    qualifiedMessage = '',
  } = {...settings?.freeShipping};
  const showMeter =
    enabled && !pathPrefix && totalQuantity > 0 && minCartSpend > 0;

  const discountAmount = useMemo(() => {
    return discountAllocations.reduce((acc: number, discount) => {
      if (discount?.discountedAmount?.amount) {
        return acc + Number(discount.discountedAmount.amount);
      }
      return acc;
    }, 0);
  }, [discountAllocations]);

  const progress = useMemo(() => {
    if (!showMeter) return {percent: 0, message: ''};

    // total = subtotal - discountAmount (discount code applied to cart level)
    const total = cost?.subtotalAmount?.amount
      ? Number(cost.subtotalAmount.amount) - discountAmount
      : 0;
    const fraction = total / minCartSpend;
    const remainder = minCartSpend - total;

    if (fraction >= 1) {
      return {
        percent: 100,
        message: qualifiedMessage,
      };
    }
    return {
      percent: fraction * 100,
      message: progressMessage?.replace(
        '{{amount}}',
        `$${remainder.toFixed(2).replace('.00', '')}`,
      ),
    };
  }, [
    cost?.subtotalAmount,
    discountAmount,
    minCartSpend,
    progressMessage,
    qualifiedMessage,
    showMeter,
  ]);

  return showMeter ? (
    <div className="border-b border-b-border p-4">
      <p className="mb-2 text-center text-xs">{progress.message}</p>

      <div className="h-1.5 w-full overflow-hidden rounded bg-lightGray">
        <div
          className="size-full origin-left transition"
          style={{
            transform: `scaleX(${progress.percent}%)`,
            backgroundColor: progressBarColor,
          }}
        />
      </div>
    </div>
  ) : null;
}

FreeShippingMeter.displayName = 'FreeShippingMeter';
