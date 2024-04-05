import {useLoaderData} from '@remix-run/react';
import type {Product} from '@shopify/hydrogen/storefront-api-types';

import {Container} from '~/components';
import type {ContainerSettings} from '~/settings/container';
import {useLoadScript, useRootLoaderData} from '~/hooks';

import {Schema} from './ProductReviews.schema';

export function ProductReviews({cms}: {cms: {container: ContainerSettings}}) {
  const {product} = useLoaderData<{product: Product}>();
  const {ENV} = useRootLoaderData();

  const productId = product?.id?.split('/').pop();

  /* Example script loading, if applicable */
  // useLoadScript({
  //   id: 'product-reviews-script',
  //   src: 'https://reviews.platform.com/reviews.js',
  // });

  return (
    <Container container={cms.container}>
      <>
        {/* Placeholder */}
        <div className="flex h-[32rem] w-full items-center justify-center bg-offWhite p-5 text-center">
          <h2>Product reivews widget here</h2>
        </div>

        {/*
         * Required html elements from platform for product reviews
         */}
      </>
    </Container>
  );
}

ProductReviews.displayName = 'ProductReviews';
ProductReviews.Schema = Schema;
