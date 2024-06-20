import type {SerializeFrom} from '@shopify/remix-oxygen';
import {useMatches} from '@remix-run/react';

import type {loader} from '~/root';

export type RootLoaderData = SerializeFrom<typeof loader>;

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
