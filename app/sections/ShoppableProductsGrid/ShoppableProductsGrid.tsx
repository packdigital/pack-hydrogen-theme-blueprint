import {useMemo} from 'react';
import {useInView} from 'react-intersection-observer';
import clsx from 'clsx';
import type {Product} from '@shopify/hydrogen/storefront-api-types';

import type {ContainerSettings} from '~/settings/container';
import {useProductsByIds, useColorSwatches} from '~/hooks';
import {Container} from '~/components/Container';
import {ProductItem} from '~/components/ProductItem';

import {Schema} from './ShoppableProductsGrid.schema';
import type {ShoppableProductsGridCms} from './ShoppableProductsGrid.types';

export function ShoppableProductsGrid({
  cms,
}: {
  cms: ShoppableProductsGridCms & {container: ContainerSettings};
}) {
  const {ref, inView} = useInView({
    rootMargin: '200px',
    triggerOnce: true,
  });
  const swatchesMap = useColorSwatches();

  const {
    heading,
    headingTextAlign = 'text-center',
    products,
    grid,
    productItem,
  } = cms;
  const {
    columnsDesktop = 'lg:grid-cols-4',
    columnsTablet = 'md:grid-cols-3',
    columnsMobile = 'grid-cols-2',
  } = {...grid};

  const productIds = useMemo(() => {
    return (
      products?.reduce((acc: string[], {product}) => {
        if (!product?.id) return acc;
        return [...acc, product.id];
      }, []) || []
    );
  }, [products]);

  const placeholderProducts = useMemo(() => {
    return Array.from({length: productIds.length}).map((_, index) => {
      return {
        id: `${index}`,
        handle: '',
      } as Product;
    });
  }, [productIds]);

  const fullProducts = useProductsByIds(productIds, inView);

  return (
    <Container container={cms.container}>
      <div className="px-contained py-contained">
        <div className="mx-auto w-full max-w-[var(--content-max-width)]">
          {heading && (
            <h2 className={clsx('mb-5 md:mb-8', headingTextAlign)}>
              {heading}
            </h2>
          )}

          <ul
            className={clsx(
              'grid w-full gap-x-4 gap-y-8 xs:gap-x-5 md:px-0',
              columnsMobile,
              columnsTablet,
              columnsDesktop,
            )}
            ref={ref}
          >
            {(fullProducts.length ? fullProducts : placeholderProducts).map(
              (product, index) => {
                return (
                  <li key={index}>
                    <ProductItem
                      enabledStarRating={productItem?.enabledStarRating}
                      handle={product.handle}
                      index={index}
                      isShoppableProductItem
                      product={product}
                      swatchesMap={swatchesMap}
                    />
                  </li>
                );
              },
            )}
          </ul>
        </div>
      </div>
    </Container>
  );
}

ShoppableProductsGrid.displayName = 'ShoppableProductsGrid';
ShoppableProductsGrid.Schema = Schema;
