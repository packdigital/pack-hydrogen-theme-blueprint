import {useMemo} from 'react';
import {Money} from '@shopify/hydrogen-react';
import type {Order} from '@shopify/hydrogen/storefront-api-types';

export function OrderTotals({order}: {order: Order}) {
  const currencyCode = order.currencyCode;
  const totals = useMemo(() => {
    let subtotalAmount = order.subtotalPrice?.amount;
    let discountAmount;

    if (
      order.discountApplications?.edges?.[0]?.node?.targetType === 'LINE_ITEM'
    ) {
      let subtotal = 0;
      let discountTotal = 0;
      order.lineItems.edges?.forEach(({node: item}) => {
        subtotal += Number(
          item.discountedTotalPrice?.amount ||
            item.originalTotalPrice?.amount ||
            '0',
        );
        discountTotal += Number(
          item.discountAllocations?.[0]?.allocatedAmount.amount || '0',
        );
      });
      subtotalAmount = subtotal.toFixed(2);
      discountAmount = discountTotal;
    }

    return [
      {
        label: 'Subtotal',
        amount: subtotalAmount,
      },
      ...(discountAmount
        ? [
            {
              label: 'Discount',
              amount: `-${discountAmount}`,
            },
          ]
        : []),
      {
        label: 'Shipping',
        amount: order.totalShippingPrice.amount,
      },
      {label: 'Tax', amount: order.totalTax?.amount || '0'},
      {label: 'Total', amount: order.totalPrice.amount},
      ...(Number(order.totalRefunded?.amount) > 0
        ? [
            {
              label: 'Refunded',
              amount: `-${order.totalRefunded.amount}`,
            },
          ]
        : []),
    ];
  }, [order]);

  return (
    <div>
      {totals.map(({label, amount}) => {
        return (
          <div
            key={label}
            className="grid grid-cols-[10fr_auto] items-center gap-3 border-b border-b-border py-5 last:border-none md:grid-cols-[10fr_1fr] md:gap-12"
          >
            <p className="text-label">{label}</p>

            <Money
              as="p"
              className={`${
                label === 'Total' ? 'text-lg font-bold' : 'text-sm'
              }`}
              data={{amount, currencyCode}}
            />
          </div>
        );
      })}
    </div>
  );
}

OrderTotals.displayName = 'OrderTotals';
