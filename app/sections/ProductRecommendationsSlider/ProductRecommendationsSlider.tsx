import {useProduct} from '@shopify/hydrogen-react';
import {useInView} from 'react-intersection-observer';

import {
  Container,
  ProductsSlider as ProductsSliderComponent,
} from '~/components';
import type {ContainerSettings} from '~/settings/container';
import type {ProductsSliderCms} from '~/components/ProductsSlider/ProductsSlider.types';
import {useProductRecommendations} from '~/hooks';

import {Schema} from './ProductRecommendationsSlider.schema';

type ProductRecommendationsSliderCms = ProductsSliderCms & {
  intent: 'RELATED' | 'COMPLEMENTARY';
  container: ContainerSettings;
};

export function ProductRecommendationsSlider({
  cms,
}: {
  cms: ProductRecommendationsSliderCms;
}) {
  const {ref, inView} = useInView({
    rootMargin: '200px',
    triggerOnce: true,
  });

  const limit = (cms.limit || 0) > 10 ? 10 : cms.limit || 10;

  const {product} = useProduct();
  const productRecommendations = useProductRecommendations(
    product?.id || '',
    cms.intent || 'RELATED',
    inView,
  );

  const products = productRecommendations
    ? productRecommendations.slice(0, limit)
    : [];

  return (
    <Container container={cms.container}>
      <div ref={ref}>
        <ProductsSliderComponent cms={cms} products={products} />
      </div>
    </Container>
  );
}

ProductRecommendationsSlider.displayName = 'ProductRecommendationsSlider';
ProductRecommendationsSlider.Schema = Schema;
