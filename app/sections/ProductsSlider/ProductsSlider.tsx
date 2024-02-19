import {
  Container,
  ProductsSlider as ProductsSliderComponent,
} from '~/components';
import type {ProductsSliderCms} from '~/components';
import type {ContainerSettings} from '~/settings/container';

import {Schema} from './ProductsSlider.schema';

export function ProductsSlider({
  cms,
}: {
  cms: ProductsSliderCms & {container: ContainerSettings};
}) {
  return (
    <Container container={cms.container}>
      <ProductsSliderComponent cms={cms} />
    </Container>
  );
}

ProductsSlider.displayName = 'ProductsSlider';
ProductsSlider.Schema = Schema;
