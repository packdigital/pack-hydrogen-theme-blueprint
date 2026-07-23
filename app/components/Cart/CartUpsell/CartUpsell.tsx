import {Fragment, memo, useEffect, useMemo, useState} from 'react';
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Transition,
} from '@headlessui/react';
import type {CartLine} from '@shopify/hydrogen/storefront-api-types';

import {Carousel} from '~/components/Carousel';
import {Svg} from '~/components/Svg';
import {useCart, useProductsByIds, useProductRecommendations} from '~/hooks';

import type {CartUpsellProps} from '../Cart.types';

import {CartUpsellItem} from './CartUpsellItem';

export const CartUpsell = memo(({closeCart, settings}: CartUpsellProps) => {
  const {lines, status, updatedAt} = useCart();
  const cartLines = lines as CartLine[];

  const {
    message = '',
    products,
    recsLimit = 10,
    type = 'manual',
  } = {...settings?.upsell};
  const isRecs = type === 'recommendations';

  const [productsNotInCart, setProductsNotInCart] = useState([]);

  const productIds = useMemo(() => {
    if (isRecs) return [];
    return (
      products?.reduce((acc: string[], {product}) => {
        if (!product?.id) return acc;
        return [...acc, product.id];
      }, []) || []
    );
  }, [isRecs, products]);

  const manualProducts = useProductsByIds(productIds, !isRecs);
  const recommendedProducts = useProductRecommendations(
    cartLines?.[0]?.merchandise?.product?.id || '',
    'RELATED',
    isRecs,
  );

  const fullProducts =
    (isRecs ? recommendedProducts?.slice(0, recsLimit) : manualProducts) || [];

  const fullProductsDep = fullProducts
    .map((product) => product.handle)
    .join('');

  useEffect(() => {
    if (status === 'idle') {
      const remaining = [...fullProducts].filter((product) => {
        return !cartLines.some((line) => {
          return line.merchandise.product.handle === product.handle;
        });
      }) as [];
      setProductsNotInCart(remaining);
    }
  }, [fullProductsDep, status, updatedAt]);

  const showUpsell = cartLines?.length > 0 && productsNotInCart?.length > 0;

  return showUpsell ? (
    <Disclosure
      as="div"
      className="flex flex-col border-t border-t-border"
      defaultOpen
    >
      {({open}) => (
        <>
          <DisclosureButton
            aria-label={`${open ? 'Collapse' : 'Expand'} upsells`}
            type="button"
            className="relative px-4 py-3"
          >
            <h3 className="px-5 text-center text-xs font-normal">{message}</h3>

            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-neutralMedium">
              {open ? (
                <Svg
                  className="w-4 text-current"
                  src="/svgs/minus.svg#minus"
                  title="Minus"
                  viewBox="0 0 24 24"
                />
              ) : (
                <Svg
                  className="w-4 text-current"
                  src="/svgs/plus.svg#plus"
                  title="Plus"
                  viewBox="0 0 24 24"
                />
              )}
            </div>
          </DisclosureButton>

          <Transition
            as="div"
            show={open}
            enter="transition duration-100 ease-out"
            enterFrom="transform scale-97 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-97 opacity-0"
          >
            <DisclosurePanel as={Fragment}>
              <Carousel
                ariaLabel={message || 'Cart upsell products'}
                arrows
                className="mb-4 w-full px-2"
                slides={productsNotInCart.map((product, index) => (
                  <CartUpsellItem
                    closeCart={closeCart}
                    isOnlyUpsell={products?.length === 1}
                    key={index}
                    product={product}
                  />
                ))}
              />
            </DisclosurePanel>
          </Transition>
        </>
      )}
    </Disclosure>
  ) : null;
});

CartUpsell.displayName = 'CartUpsell';
