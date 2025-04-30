import {useMemo} from 'react';
import {useInView} from 'react-intersection-observer';

import {Schema} from './CategorySlider.schema';
import {CategorySliderCms} from './CategorySlider.types';

import {Container} from '~/components/Container';
import {ContainerSettings} from '~/settings/container';

export function CategorySlider({
  cms,
}: {
  cms: CategorySliderCms & {container: ContainerSettings};
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

  const margin = useMemo(
    () => (cms?.section?.margin ? `m-${cms.section.margin}` : `m-3`),
    [cms?.section?.margin],
  );

  console.log('CMS', cms);

  return (
    <Container container={cms.container}>
      <div ref={ref}>
        <div className={`${maxWidthClass} justify-center ${margin}`}>
          <p>Hello Wolrd</p>
        </div>
      </div>
    </Container>
  );
}

CategorySlider.displayName = 'CategorySlider';
CategorySlider.Schema = Schema;
