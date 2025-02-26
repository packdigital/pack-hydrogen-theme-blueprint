import {memo} from 'react';
import {useCart} from '@shopify/hydrogen-react';
import {Analytics} from '@shopify/hydrogen';
import type {CartLine as CartLineType} from '@shopify/hydrogen/storefront-api-types';

import {Drawer} from '~/components/Drawer';
import {Svg} from '~/components/Svg';
import {useMenu, useSettings} from '~/hooks';

import {CartDiscounts} from './CartDiscounts';
import {CartEmpty} from './CartEmpty';
import {CartLine} from './CartLine';
import {CartTotals} from './CartTotals';
import {CartUpsell} from './CartUpsell/CartUpsell';
import {FreeShippingMeter} from './FreeShippingMeter';

export const Cart = memo(() => {
  const {cart: cartSettings} = useSettings();
  const cart = useCart();
  const {lines = [], totalQuantity = 0} = cart;
  const {cartOpen, closeCart} = useMenu();

  const cartLines = lines as CartLineType[];
  const hasCartLines = totalQuantity > 0;
  const enabledUpsell = cartSettings?.upsell?.enabled;
  const enabledDiscounts = cartSettings?.discounts?.enabled ?? true;

  return (
    <Drawer
      ariaName="cart drawer"
      heading={cartSettings?.heading || 'My Cart'}
      onClose={closeCart}
      open={cartOpen}
      openFrom="right"
      secondHeaderElement={
        <>
          <Svg
            className="w-5 text-text"
            src="/svgs/cart.svg#cart"
            title="Cart"
            viewBox="0 0 24 24"
          />
          <p className="text-label-sm w-4 whitespace-nowrap pl-px font-bold">
            ({totalQuantity || 0})
          </p>
        </>
      }
    >
      <FreeShippingMeter settings={cartSettings} />

      <ul className="scrollbar-hide relative flex-1 overflow-y-auto">
        {cartLines?.length ? (
          cartLines.map((line) => {
            return (
              <li
                key={line.id}
                className="border-b border-b-border last:border-none"
              >
                <CartLine line={line} closeCart={closeCart} />
              </li>
            );
          })
        ) : (
          <CartEmpty closeCart={closeCart} settings={cartSettings} />
        )}
      </ul>

      {hasCartLines && (
        <>
          {enabledUpsell && (
            <CartUpsell closeCart={closeCart} settings={cartSettings} />
          )}

          {enabledDiscounts && <CartDiscounts />}

          <CartTotals settings={cartSettings} />
        </>
      )}

      <Analytics.CartView customData={{cart}} />
    </Drawer>
  );
});

Cart.displayName = 'Cart';
