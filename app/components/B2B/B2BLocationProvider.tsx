import {useEffect, useMemo} from 'react';
import {useFetcher, useLocation} from '@remix-run/react';
import {useCart} from '@shopify/hydrogen-react';

import {B2BLocationSelectorModal} from '~/components/B2B';
import {useMenu, useLocale, useRootLoaderData} from '~/hooks';
import type {B2BLocationContextValue} from '~/lib/types';

import {
  B2BLocationContext,
  defaultB2BLocationContextValue,
} from './useB2BLocationContext';

export function B2BLocationProvider({children}: {children: React.ReactNode}) {
  const fetcher = useFetcher<B2BLocationContextValue>();
  const {openModal} = useMenu();
  const {pathPrefix} = useLocale();
  const {pathname} = useLocation();
  const {buyer} = useRootLoaderData();
  const {buyerIdentityUpdate, id: cartId} = useCart();

  const value = useMemo<B2BLocationContextValue>(() => {
    return {
      ...defaultB2BLocationContextValue,
      ...fetcher.data,
    };
  }, [fetcher]);

  useEffect(() => {
    if (fetcher.data || fetcher.state === 'loading') return;
    fetcher.load(`${pathPrefix}/api/b2blocations`);
  }, [fetcher]);

  useEffect(() => {
    if (!fetcher.data) return;
    if (!!fetcher.data?.company && !fetcher.data?.companyLocationId) {
      openModal(<B2BLocationSelectorModal />, undefined, true);
    }
  }, [fetcher, pathname]);

  useEffect(() => {
    if (!buyer || !cartId) return;
    buyerIdentityUpdate({
      companyLocationId: buyer.companyLocationId,
      customerAccessToken: buyer.customerAccessToken,
    });
  }, [buyer, cartId]);

  return (
    <B2BLocationContext.Provider value={value}>
      {children}
    </B2BLocationContext.Provider>
  );
}
