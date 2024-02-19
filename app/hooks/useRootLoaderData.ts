import type {SerializeFrom} from '@shopify/remix-oxygen';
import {useMatches} from '@remix-run/react';

import type {loader} from '~/root';

export type RootLoaderData = SerializeFrom<typeof loader>;

export function useRootLoaderData(): RootLoaderData {
  const [root] = useMatches();
  return {...(root?.data || null)} as RootLoaderData;
}
