import {lazy, Suspense} from 'react';

import type {ContainerSettings} from '~/settings/container';

import {Schema} from './ProductReviews.schema';

export {PRODUCT_REVIEWS_KEY} from './ProductReviews.schema';

const ProductReviewsBody = lazy(() =>
  import('./ProductReviews').then((module) => ({
    default: module.ProductReviews,
  })),
);

export function ProductReviews({cms}: {cms: {container: ContainerSettings}}) {
  return (
    <Suspense fallback={null}>
      <ProductReviewsBody cms={cms} />
    </Suspense>
  );
}

ProductReviews.displayName = 'ProductReviews';
ProductReviews.Schema = Schema;
