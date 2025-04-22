import {memo} from 'react';
import {useCart} from '@shopify/hydrogen-react';
import clsx from 'clsx';

import {Svg} from '~/components/Svg';
import {useMenu} from '~/hooks';

export const NavigationCart = memo(
  ({className = '', color}: {className?: string; color?: string}) => {
    const {totalQuantity = 0} = useCart();
    const {openCart} = useMenu();

    return (
      <div className="relative flex items-center">
        <button
          aria-label="Open cart"
          className={clsx('w-5 text-text', className)}
          onClick={openCart}
          style={{color}}
          type="button"
        >
          <Svg
            className="w-full text-current"
            src="/svgs/cart.svg#cart"
            title="Cart"
            viewBox="0 0 24 24"
          />
        </button>

        <p
          className="text-label-sm w-4 whitespace-nowrap pl-px font-bold text-current"
          style={{color}}
        >
          ({totalQuantity || 0})
        </p>
      </div>
    );
  },
);

NavigationCart.displayName = 'NavigationCart';
