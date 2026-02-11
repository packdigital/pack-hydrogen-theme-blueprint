import {useMatches} from 'react-router';

import type {loader} from '~/root';

export type RootLoaderData = Exclude<
  Awaited<ReturnType<typeof loader>>,
  Response
>;

export function useRootLoaderData(): RootLoaderData {
  const [root, layout, child] = useMatches();
  const rootData = root?.loaderData as RootLoaderData;
  const layoutData = layout?.loaderData as {url?: string};
  const childData = child?.loaderData as {url?: string};
  return {
    ...(rootData || null),
    url: childData?.url || layoutData?.url || rootData?.url,
  } as RootLoaderData;
}
