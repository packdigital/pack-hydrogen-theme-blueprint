import {useMemo} from 'react';
import {ProductProvider} from '@shopify/hydrogen-react';
import {useLoaderData} from '@remix-run/react';

import {Container} from '~/components/Container';
import {Product as ProductComponent} from '~/components/Product';
import {useProductByHandle} from '~/hooks';
import type {loader} from '~/routes/($locale).pages.$handle';

import type {ProductCms} from './Product.types';
import {Schema} from './Product.schema';

export function Product({cms}: {cms: ProductCms}) {
  const {productsMap} = useLoaderData<typeof loader>();
  const cmsProductHandle = cms.product?.handle;
  const loaderProduct = productsMap[cmsProductHandle];
  const fetchedProduct = useProductByHandle(
    !loaderProduct ? cmsProductHandle : null,
  );

  const product = useMemo(() => {
    return fetchedProduct || loaderProduct;
  }, [fetchedProduct, loaderProduct?.id]);

  return (
    <Container container={cms.container}>
      {product && (
        <ProductProvider data={product}>
          <div className="md:px-contained py-contained">
            <ProductComponent isSectionProduct product={product} />
          </div>
        </ProductProvider>
      )}
    </Container>
  );
}

Product.displayName = 'Product';
Product.Schema = Schema;
