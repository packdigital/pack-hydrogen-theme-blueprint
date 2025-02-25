import {useMemo} from 'react';
import {Swiper, SwiperSlide} from 'swiper/react';
import {A11y} from 'swiper/modules';

import {ProductItem} from '~/components/ProductItem';
import {useColorSwatches, useProductsByIds} from '~/hooks';
import type {Settings} from '~/lib/types';

import type {UseMobileMenuReturn} from '../useMobileMenu';

type MobileMenuProps = Pick<UseMobileMenuReturn, 'handleCloseMobileMenu'> & {
  productsSlider: Settings['header']['menu']['productsSlider'];
};

export function MobileMenuProductsSlider({
  handleCloseMobileMenu,
  productsSlider,
}: MobileMenuProps) {
  const swatchesMap = useColorSwatches();

  const {products, heading: productsHeading} = {
    ...productsSlider,
  };

  const productIds = useMemo(() => {
    return (
      products?.reduce((acc: string[], {product}) => {
        if (!product?.id) return acc;
        return [...acc, product.id];
      }, []) || []
    );
  }, [products]);

  const fullProducts = useProductsByIds(productIds);

  return (
    <div className="mb-8">
      <h3 className="text-h5 mb-2 px-4">{productsHeading}</h3>

      <Swiper
        modules={[A11y]}
        slidesPerView={1.3}
        spaceBetween={16}
        slidesOffsetBefore={16}
        slidesOffsetAfter={16}
        grabCursor
        className="mb-5"
      >
        {fullProducts.map((product, index) => {
          return (
            <SwiperSlide key={index}>
              <ProductItem
                index={index}
                onClick={handleCloseMobileMenu}
                product={product}
                swatchesMap={swatchesMap}
              />
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}

MobileMenuProductsSlider.displayName = 'MobileMenuProductsSlider';
