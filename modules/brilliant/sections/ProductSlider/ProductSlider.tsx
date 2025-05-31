import {useMemo} from 'react';
import {useInView} from 'react-intersection-observer';

import {Schema} from './ProductSlider.schema';
import {ProductSliderCms} from './ProductSlider.types';

import {Container} from '~/components/Container';
import {ContainerSettings} from '~/settings/container';

export function ProductSlider({
  cms,
}: {
  cms: ProductSliderCms & {container: ContainerSettings};
}) {
  const {ref, inView} = useInView({
    rootMargin: '200px',
    triggerOnce: true,
  });

  const maxWidthClass = useMemo(
    () =>
      cms?.section?.fullWidth
        ? 'max-w-none'
        : 'max-w-[var(--content-max-width)] mx-auto',
    [cms?.section?.fullWidth],
  );

  return (
    <Container container={cms.container}>
      <div ref={ref}>
        <div className={`${maxWidthClass} justify-center`}>
          <p>Some Content is going to go in here</p>
        </div>
      </div>
    </Container>
  );
}

ProductSlider.displayName = 'ProductSlider';
ProductSlider.Schema = Schema;
