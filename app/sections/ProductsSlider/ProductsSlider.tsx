import {useMemo} from 'react';
import {useInView} from 'react-intersection-observer';

import {
  Container,
  ProductsSlider as ProductsSliderComponent,
} from '~/components';
import type {ProductsSliderCms} from '~/components';
import type {ContainerSettings} from '~/settings/container';
import {useProductsByIds} from '~/hooks';

import {Schema} from './ProductsSlider.schema';

export function ProductsSlider({
  cms,
}: {
  cms: ProductsSliderCms & {container: ContainerSettings};
}) {
  const {ref, inView} = useInView({
    rootMargin: '200px',
    triggerOnce: true,
  });

  const productIds = useMemo(() => {
    return (
      cms.products?.reduce((acc: string[], {product}) => {
        if (!product?.id) return acc;
        return [...acc, product.id];
      }, []) || []
    );
  }, [cms.products]);

  const products = useProductsByIds(productIds, inView);

  return (
    <Container container={cms.container}>
      <div ref={ref}>
        <ProductsSliderComponent cms={cms} products={products} />
      </div>
    </Container>
  );
}

ProductsSlider.displayName = 'ProductsSlider';
ProductsSlider.Schema = Schema;
