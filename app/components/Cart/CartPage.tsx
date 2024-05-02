import {useCart} from '@shopify/hydrogen-react';
import type {CartLine as CartLineType} from '@shopify/hydrogen/storefront-api-types';

import {useSettings} from '~/hooks';

import {CartEmpty} from './CartEmpty';
import {CartLine} from './CartLine';
import {CartTotals} from './CartTotals';
import {CartUpsell} from './CartUpsell/CartUpsell';
import {FreeShippingMeter} from './FreeShippingMeter';

export function CartPage() {
  const {cart: cartSettings} = useSettings();
  const {lines = [], totalQuantity = 0} = useCart();
  const cartLines = lines as CartLineType[];
  const heading = cartSettings?.heading ?? 'My Cart';
  const hasCartLines = totalQuantity > 0;

  return (
    <section
      className="md:px-contained py-contained"
      data-comp={CartPage.displayName}
    >
      <div className="mx-auto max-w-screen-xl">
        <h1 className="text-h2 mb-4 px-4">{heading || 'My Cart'}</h1>

        <div
          className={`grid gap-x-4 md:grid-flow-col-dense md:grid-rows-[auto_1fr] md:gap-y-4 ${
            hasCartLines
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-[3fr_2fr]'
              : 'grid-cols-1'
          }`}
        >
          <div className="md:row-span-2">
            <ul
              className={`relative border-y border-border ${
                hasCartLines ? '' : 'min-h-80 py-12 md:min-h-[30rem]'
              }`}
            >
              {hasCartLines ? (
                cartLines.map((line) => {
                  return (
                    <li
                      key={line.id}
                      className="border-b border-b-border last:border-none"
                    >
                      <CartLine line={line} />
                    </li>
                  );
                })
              ) : (
                <CartEmpty settings={cartSettings} />
              )}
            </ul>
          </div>

          {hasCartLines && (
            <div className="flex flex-col overflow-hidden md:gap-4">
              <div className="[&>div]:max-md:border-t-0 [&>div]:md:rounded [&>div]:md:border [&>div]:md:border-border">
                <CartTotals settings={cartSettings} />
              </div>

              <div className="[&>div]:border-b-0 [&>div]:border-t [&>div]:border-border [&>div]:md:rounded [&>div]:md:border">
                <FreeShippingMeter settings={cartSettings} />
              </div>

              <div className="[&>div]:border-border [&>div]:md:rounded [&>div]:md:border">
                <CartUpsell settings={cartSettings} />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

CartPage.displayName = 'CartPage';
