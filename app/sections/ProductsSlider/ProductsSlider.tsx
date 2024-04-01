import {useMemo} from 'react';

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
  const productHandles = useMemo(() => {
    return (
      cms.products?.reduce((acc: string[], {product}) => {
        if (!product?.handle) return acc;
        return [...acc, product.handle];
      }, []) || []
    );
  }, [cms.products]);

  const products = useProductsFromHandles(productHandles);

  return (
    <Container container={cms.container}>
      <ProductsSliderComponent cms={cms} products={products} />
    </Container>
  );
}

ProductsSlider.displayName = 'ProductsSlider';
ProductsSlider.Schema = Schema;
