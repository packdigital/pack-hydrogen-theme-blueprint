import {lazy, Suspense} from 'react';

import type {ProductsSliderCms} from '~/components/ProductsSlider';
import type {ContainerSettings} from '~/settings/container';

import {Schema} from './ProductsSlider.schema';

const ProductsSliderBody = lazy(() =>
  import('./ProductsSlider').then((module) => ({
    default: module.ProductsSlider,
  })),
);

export function ProductsSlider({
  cms,
}: {
  cms: ProductsSliderCms & {container: ContainerSettings};
}) {
  return (
    <Suspense fallback={null}>
      <ProductsSliderBody cms={cms} />
    </Suspense>
  );
}

ProductsSlider.displayName = 'ProductsSlider';
ProductsSlider.Schema = Schema;
