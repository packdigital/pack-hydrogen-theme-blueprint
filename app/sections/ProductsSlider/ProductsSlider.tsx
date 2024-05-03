import {useMemo} from 'react';
import {useInView} from 'react-intersection-observer';

import {
  Container,
  ProductsSlider as ProductsSliderComponent,
} from '~/components';
import type {ProductsSliderCms} from '~/components';
import type {ContainerSettings} from '~/settings/container';
import {useProductsFromHandles} from '~/hooks';

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

  const productHandles = useMemo(() => {
    return (
      cms.products?.reduce((acc: string[], {product}) => {
        if (!product?.handle) return acc;
        return [...acc, product.handle];
      }, []) || []
    );
  }, [cms.products]);

  const products = useProductsFromHandles(productHandles, inView);

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
