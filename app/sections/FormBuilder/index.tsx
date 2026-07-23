import {lazy, Suspense} from 'react';

import {Schema} from './FormBuilder.schema';
import type {FormBuilderCms} from './FormBuilder.types';

const FormBuilderBody = lazy(() =>
  import('./FormBuilder').then((module) => ({default: module.FormBuilder})),
);

export function FormBuilder({cms}: {cms: FormBuilderCms}) {
  return (
    <Suspense fallback={null}>
      <FormBuilderBody cms={cms} />
    </Suspense>
  );
}

FormBuilder.displayName = 'FormBuilder';
FormBuilder.Schema = Schema;
