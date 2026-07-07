import {memo} from 'react';
import startCase from 'lodash/startCase';
import {Money} from '@shopify/hydrogen-react';
import type {Order} from '@shopify/hydrogen/customer-account-api-types';

import {Link} from '~/components/Link';

// Rendered in a list (Orders.tsx maps over orders); memo skips re-rendering
// unchanged rows when the list's parent re-renders (e.g. pagination state).
export const OrdersItem = memo(({order}: {order: Order}) => {
  const newDate = new Date(order.processedAt);
  const orderDate = newDate.toLocaleDateString('default', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const products = order.lineItems.edges.map(({node}) => node.title).join(', ');

  const [legacyOrderId, key] = order!.id!.split('/').pop()!.split('?');
  const orderUrl = `/account/orders/${legacyOrderId}?${key}`;

  const financialStatus = startCase(order.financialStatus?.toLowerCase());
  const fulfillmentStatus = startCase(order.fulfillmentStatus?.toLowerCase());
  const total = `$${parseFloat(order.totalPrice.amount).toFixed(2)}`;

  return (
    <>
      {/* mobile */}
      <div className="flex flex-col gap-3 rounded border border-border p-6 md:hidden">
        <div className="flex justify-between">
          <Link
            aria-label={`Go to order page for order ${order.name}`}
            to={orderUrl}
          >
            <p className="text-main-underline text-nav bg-[linear-gradient(var(--primary),var(--primary))] text-right font-normal">
              Order {order.name}
            </p>
          </Link>

          <p className="text-sm">{orderDate}</p>
        </div>

        <p className="text-h4">{total}</p>

        <p className="text-xs">{products}</p>

        <p className="text-xs">
          Payment: <span className="font-medium">{financialStatus}</span> /
          Fufillment: <span className="font-medium">{fulfillmentStatus}</span>
        </p>
      </div>

      {/* tablet/desktop */}
      <div className="hidden grid-cols-[2fr_2fr_2fr_2fr_1fr] gap-3 text-sm md:grid">
        <div>
          <Link
            aria-label={`Go to order page for order ${order.name}`}
            to={orderUrl}
          >
            <p className="text-main-underline text-nav bg-[linear-gradient(var(--primary),var(--primary))] font-normal">
              {order.name}
            </p>
          </Link>
        </div>

        <p>{orderDate}</p>

        <p>{financialStatus}</p>

        <p>{fulfillmentStatus}</p>

        <Money as="p" data={order.totalPrice} />
      </div>
    </>
  );
});

OrdersItem.displayName = 'OrdersItem';
