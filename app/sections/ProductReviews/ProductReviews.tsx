import {useMemo} from 'react';
import {useLoaderData} from '@remix-run/react';
import {useInView} from 'react-intersection-observer';
import type {Product} from '@shopify/hydrogen/storefront-api-types';

import {Container} from '~/components/Container';
import {useLoadScript, useRootLoaderData} from '~/hooks';
import {PRODUCT_REVIEWS_KEY} from '~/sections/ProductReviews';
import type {ContainerSettings} from '~/settings/container';

import {Schema} from './ProductReviews.schema';

export function ProductReviews({cms}: {cms: {container: ContainerSettings}}) {
  const {product} = useLoaderData<{product: Product}>();
  const {ENV, modalProduct} = useRootLoaderData();
  const {ref: inViewRef, inView} = useInView({
    rootMargin: '600px',
    triggerOnce: true,
  });

  const productId = useMemo(() => {
    return modalProduct?.id?.split('/').pop() || product?.id?.split('/').pop();
  }, [modalProduct?.id, product?.id]);

  /* Example script loading, if applicable */
  // useLoadScript(
  //   {
  //     id: 'product-reviews-script',
  //     src: 'https://reviews.platform.com/reviews.js',
  //   },
  //   'body',
  //   inView,
  // );

  return (
    <Container container={cms.container}>
      <div data-comp={PRODUCT_REVIEWS_KEY} ref={inViewRef}>
        {/* Placeholder */}
        <div className="flex h-[32rem] w-full items-center justify-center bg-neutralLightest p-5 text-center">
          <h2>Product reviews widget here</h2>
        </div>

        {/*
         * Required html elements from platform for product reviews
         */}
      </div>
    </Container>
  );
}

ProductReviews.displayName = 'ProductReviews';
ProductReviews.Schema = Schema;
