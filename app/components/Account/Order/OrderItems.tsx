import {flattenConnection} from '@shopify/hydrogen-react';
import type {Order} from '@shopify/hydrogen/storefront-api-types';

import {OrderItem} from './OrderItem';

export function OrderItems({order}: {order: Order}) {
  const mobileHeaders = ['Product', 'Total'];
  const headers = ['Product', 'Title', 'Price', 'Qty', 'Total'];
  const lineItems = flattenConnection(order.lineItems);

  return (
    <div>
      <div className="grid grid-cols-[10fr_auto] gap-3 md:hidden">
        {mobileHeaders.map((header) => {
          return (
            <h6 key={header} className="text-label">
              {header}
            </h6>
          );
        })}
      </div>

      <div className="hidden grid-cols-[6fr_2fr_1fr_1fr_1fr] gap-3 md:grid">
        {headers.map((header) => {
          return (
            <h6 key={header} className="text-label">
              {header}
            </h6>
          );
        })}
      </div>

      <ul>
        {lineItems.map((lineItem, index) => {
          return (
            <li key={index}>
              <OrderItem item={lineItem} />
            </li>
          );
        })}
      </ul>
    </div>
  );
}

OrderItems.displayName = 'OrderItems';
