import type {useLoaderData} from '@remix-run/react';
import {useMatches} from '@remix-run/react';

import type {loader} from '~/root';

export type RootLoaderData = ReturnType<
  typeof useLoaderData<typeof loader>
>['data'];

export function useRootLoaderData(): RootLoaderData {
  const [root, layout, child] = useMatches();
  const rootData = root?.data as RootLoaderData;
  const layoutData = layout?.data as {url?: string};
  const childData = child?.data as {url?: string};
  return {
    ...(rootData || null),
    url: childData?.url || layoutData?.url || rootData?.url,
  } as RootLoaderData;
}
