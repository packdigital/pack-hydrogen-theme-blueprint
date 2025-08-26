import type {Order} from '@shopify/hydrogen/customer-account-api-types';

import {Link} from '~/components/Link';

export function OrderAddressAndStatus({order}: {order: Order}) {
  const {financialStatus, fulfillmentStatus, shippingAddress, statusPageUrl} =
    order;
  const {formatted, phoneNumber} = {...shippingAddress};
  const shippingUrl =
    order?.fulfillments?.nodes?.[0]?.trackingInformation?.[0]?.url;

  return (
    <div className="mt-5 flex flex-wrap gap-x-20 gap-y-8 md:mt-10 lg:gap-36">
      <div>
        <h6 className="text-label mb-3">Shipping Address</h6>

        <div className="flex flex-col gap-1.5 text-sm">
          {formatted?.map((line) => <p key={line}>{line}</p>)}
          {phoneNumber && <p>{phoneNumber}</p>}
          {shippingUrl && (
            <Link
              aria-label="Go to shipping tracking page"
              to={shippingUrl}
              newTab
            >
              <p className="text-label text-main-underline bg-[linear-gradient(var(--primary),var(--primary))]">
                Track Shipping
              </p>
            </Link>
          )}
        </div>
      </div>

      <div>
        <h6 className="text-label mb-3">Status</h6>

        <div className="flex flex-col gap-1.5 text-sm">
          <p>
            Payment: <span className="font-bold">{financialStatus}</span>
          </p>

          <p>
            Fulfillment: <span className="font-bold">{fulfillmentStatus}</span>
          </p>

          <Link
            aria-label="Go to order tracking page"
            to={statusPageUrl}
            newTab
          >
            <p className="text-label text-main-underline bg-[linear-gradient(var(--primary),var(--primary))]">
              Track Order
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}

OrderAddressAndStatus.displayName = 'OrderAddressAndStatus';
