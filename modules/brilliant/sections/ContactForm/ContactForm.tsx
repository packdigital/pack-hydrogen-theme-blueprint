'use client';

import {useMemo} from 'react';
import {useInView} from 'react-intersection-observer';

import {Schema} from './ContactForm.schema';
import {ContactFormCms} from './ContactForm.types';
import {ContactFormWrapper} from './ContactFormWrapper';

import {Container} from '~/components/Container';
import {ContainerSettings} from '~/settings/container';

export function ContactForm({
  cms,
}: {
  cms: ContactFormCms & {container: ContainerSettings};
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
          <ContactFormWrapper />
        </div>
      </div>
    </Container>
  );
}

ContactForm.displayName = 'ContactForm';
ContactForm.Schema = Schema;
