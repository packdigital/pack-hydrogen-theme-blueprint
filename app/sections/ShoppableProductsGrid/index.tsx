import {lazy, Suspense} from 'react';

import type {ContainerSettings} from '~/settings/container';

import {Schema} from './ShoppableProductsGrid.schema';
import type {ShoppableProductsGridCms} from './ShoppableProductsGrid.types';

const ShoppableProductsGridBody = lazy(() =>
  import('./ShoppableProductsGrid').then((module) => ({
    default: module.ShoppableProductsGrid,
  })),
);

export function ShoppableProductsGrid({
  cms,
}: {
  cms: ShoppableProductsGridCms & {container: ContainerSettings};
}) {
  return (
    <Suspense fallback={null}>
      <ShoppableProductsGridBody cms={cms} />
    </Suspense>
  );
}

ShoppableProductsGrid.displayName = 'ShoppableProductsGrid';
ShoppableProductsGrid.Schema = Schema;
