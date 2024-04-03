import {useMemo} from 'react';
import {useProduct} from '@shopify/hydrogen-react';

import {
  Container,
  ProductsSlider as ProductsSliderComponent,
} from '~/components';
import type {ContainerSettings} from '~/settings/container';
import type {ProductsSliderCms} from '~/components/ProductsSlider/ProductsSlider.types';
import {useProductRecommendations} from '~/hooks';

import {Schema} from './ProductRecommendationsSlider.schema';

export function ProductRecommendationsSlider({
  cms,
}: {
  cms: ProductsSliderCms & {container: ContainerSettings};
}) {
  const limit = (cms?.limit || 0) > 10 ? 10 : cms?.limit || 10;

  const {product} = useProduct();
  const productRecommendations = useProductRecommendations(
    product?.id || '',
    'RELATED',
  );

  const products = productRecommendations
    ? productRecommendations.slice(0, limit)
    : [];

  return (
    <Container container={cms.container}>
      <ProductsSliderComponent cms={cms} products={products} />
    </Container>
  );
}

ProductRecommendationsSlider.displayName = 'ProductRecommendationsSlider';
ProductRecommendationsSlider.Schema = Schema;
