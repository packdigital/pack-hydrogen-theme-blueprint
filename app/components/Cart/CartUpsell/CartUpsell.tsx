import {Fragment, useEffect, useMemo, useState} from 'react';
import {useCart} from '@shopify/hydrogen-react';
import {Navigation} from 'swiper/modules';
import {Swiper, SwiperSlide} from 'swiper/react';
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Transition,
} from '@headlessui/react';
import type {CartLine} from '@shopify/hydrogen/storefront-api-types';

import {Svg} from '~/components';
import {useProductsFromHandles, useProductRecommendations} from '~/hooks';

import type {CartUpsellProps} from '../Cart.types';

import {CartUpsellItem} from './CartUpsellItem';

export function CartUpsell({closeCart, settings}: CartUpsellProps) {
  const {lines = [], status} = useCart();
  const cartLines = lines as CartLine[];

  const {
    message = '',
    products,
    recsLimit = 10,
    type = 'manual',
  } = {...settings?.upsell};
  const isRecs = type === 'recommendations';

  const [productsNotInCart, setProductsNotInCart] = useState([]);

  const productHandles = useMemo(() => {
    if (isRecs) return [];
    return (
      products?.reduce((acc: string[], {product}) => {
        if (!product?.handle) return acc;
        return [...acc, product.handle];
      }, []) || []
    );
  }, [isRecs, products]);

  const manualProducts = useProductsFromHandles(productHandles, !isRecs);
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
  }, [cartLines, fullProductsDep, status]);

  const showUpsell = lines?.length > 0 && productsNotInCart?.length > 0;

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

            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-mediumDarkGray">
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
              <Swiper
                className="mb-4 w-full px-2"
                grabCursor
                modules={[Navigation]}
                navigation={{
                  nextEl: '.swiper-button-next',
                  prevEl: '.swiper-button-prev',
                }}
                slidesPerView={1}
                spaceBetween={0}
              >
                {productsNotInCart.map((product, index) => {
                  return (
                    <SwiperSlide key={index}>
                      <CartUpsellItem
                        closeCart={closeCart}
                        isOnlyUpsell={products?.length === 1}
                        product={product}
                      />
                    </SwiperSlide>
                  );
                })}

                {/* Navigation */}
                <div>
                  <div
                    // eslint-disable-next-line tailwindcss/no-custom-classname
                    className="swiper-button-prev left-0 after:hidden"
                  >
                    <Svg
                      className="max-w-4 text-text"
                      src="/svgs/chevron-left.svg#chevron-left"
                      title="Arrow Left"
                      viewBox="0 0 24 24"
                    />
                  </div>

                  <div
                    // eslint-disable-next-line tailwindcss/no-custom-classname
                    className="swiper-button-next right-0 after:hidden"
                  >
                    <Svg
                      className="max-w-4 text-text"
                      src="/svgs/chevron-right.svg#chevron-right"
                      title="Arrow Right"
                      viewBox="0 0 24 24"
                    />
                  </div>
                </div>
              </Swiper>
            </DisclosurePanel>
          </Transition>
        </>
      )}
    </Disclosure>
  ) : null;
}

CartUpsell.displayName = 'CartUpsell';
