import {Fragment, useMemo} from 'react';
import {useCart} from '@shopify/hydrogen-react';
import {Navigation} from 'swiper/modules';
import {Swiper, SwiperSlide} from 'swiper/react';
import {Disclosure} from '@headlessui/react';
import type {CartLine} from '@shopify/hydrogen/storefront-api-types';

import {Svg} from '~/components';

import type {CartUpsellProps} from '../Cart.types';

import {CartUpsellItem} from './CartUpsellItem';

export function CartUpsell({closeCart, settings}: CartUpsellProps) {
  const {lines = []} = useCart();
  const cartLines = lines as CartLine[];

  const {message = '', products = []} = {...settings?.upsell};

  const productsNotInCart = useMemo(() => {
    if (!cartLines?.length || !products?.length) return [];
    return products.filter(({product}) => {
      return !cartLines.some((line) => {
        return line.merchandise.product.handle === product.handle;
      });
    });
  }, [cartLines, products]);

  const showUpsell = lines?.length > 0 && productsNotInCart?.length > 0;

  return showUpsell ? (
    <Disclosure
      as="div"
      className="flex flex-col border-t border-t-border"
      defaultOpen
    >
      {({open}) => (
        <>
          <Disclosure.Button
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
          </Disclosure.Button>

          <Disclosure.Panel as={Fragment}>
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
              {productsNotInCart.map(({product}, index) => {
                return (
                  <SwiperSlide key={index}>
                    <CartUpsellItem
                      closeCart={closeCart}
                      handle={product.handle}
                      isOnlyUpsell={products.length === 1}
                    />
                  </SwiperSlide>
                );
              })}

              {/* Navigation */}
              <div>
                <div className="swiper-button-prev left-0 after:hidden">
                  <Svg
                    className="max-w-[1rem] text-text"
                    src="/svgs/chevron-left.svg#chevron-left"
                    title="Arrow Left"
                    viewBox="0 0 24 24"
                  />
                </div>

                <div className="swiper-button-next right-0 after:hidden">
                  <Svg
                    className="max-w-[1rem] text-text"
                    src="/svgs/chevron-right.svg#chevron-right"
                    title="Arrow Right"
                    viewBox="0 0 24 24"
                  />
                </div>
              </div>
            </Swiper>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  ) : null;
}

CartUpsell.displayName = 'CartUpsell';
