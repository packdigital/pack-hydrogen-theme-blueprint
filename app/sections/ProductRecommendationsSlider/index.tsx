import {lazy, Suspense} from 'react';

import type {ProductsSliderCms} from '~/components/ProductsSlider/ProductsSlider.types';
import type {ContainerSettings} from '~/settings/container';

import {Schema} from './ProductRecommendationsSlider.schema';

type ProductRecommendationsSliderCms = ProductsSliderCms & {
  intent: 'RELATED' | 'COMPLEMENTARY';
  container: ContainerSettings;
};

const ProductRecommendationsSliderBody = lazy(() =>
  import('./ProductRecommendationsSlider').then((module) => ({
    default: module.ProductRecommendationsSlider,
  })),
);

export function ProductRecommendationsSlider({
  cms,
}: {
  cms: ProductRecommendationsSliderCms;
}) {
  return (
    <Suspense fallback={null}>
      <ProductRecommendationsSliderBody cms={cms} />
    </Suspense>
  );
}

ProductRecommendationsSlider.displayName = 'ProductRecommendationsSlider';
ProductRecommendationsSlider.Schema = Schema;
