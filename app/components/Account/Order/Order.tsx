import {useMemo} from 'react';

import {Link, Svg} from '~/components';
import {useCustomerOrder} from '~/lib/customer';

import {OrderAddressAndStatus} from './OrderAddressAndStatus';
import {OrderItems} from './OrderItems';
import {OrderTotals} from './OrderTotals';

export function Order() {
  const {order} = useCustomerOrder();

  const orderDate = useMemo(() => {
    if (!order?.processedAt) return null;
    const date = new Date(order.processedAt);
    return date.toLocaleString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }, [order?.processedAt]);

  return (
    <div className="flex flex-col gap-10">
      <div className="flex items-start justify-between gap-4">
        <Link
          aria-label="Go back to order history page"
          className="mt-1 w-5 md:mt-1 lg:mt-1.5"
          to="/account/orders"
        >
          <Svg
            src="/svgs/arrow-left.svg#arrow-left"
            title="Arrow Left"
            viewBox="0 0 24 24"
          />
        </Link>

        <div className="flex flex-1 flex-col items-start gap-x-4 gap-y-1 md:flex-row md:items-center md:justify-between">
          <h1 className="text-h4 md:text-h5 lg:text-h4">Order {order?.name}</h1>

          <p className="text-sm md:text-right">{orderDate}</p>
        </div>
      </div>

      {!order && (
        <div
          className="relative flex min-h-48 items-center justify-center"
          role="status"
        >
          Order not found.
        </div>
      )}

      {order && (
        <div>
          <OrderItems order={order} />

          <OrderTotals order={order} />

          <OrderAddressAndStatus order={order} />
        </div>
      )}
    </div>
  );
}

Order.displayName = 'OrderDetails';
