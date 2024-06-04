import {useEffect} from 'react';
import {useFetcher} from '@remix-run/react';
import type {Customer} from '@shopify/hydrogen/storefront-api-types';

import {getCustomerAccessTokenFromLocalStorage} from '~/lib/customer';
import {useGlobal, useLocale} from '~/hooks';

/*
 * When in customizer, customer is managed through local storage and
 * global state, instead of session cookies
 */

export function usePreviewModeCustomerFetch(fetchDependency: any) {
  const {isPreviewModeEnabled, setPreviewModeCustomer} = useGlobal();
  const {pathPrefix} = useLocale();
  const fetcher = useFetcher<{customer: Customer | null | undefined}>();

  useEffect(() => {
    if (isPreviewModeEnabled && fetchDependency) {
      const customerAccessToken = getCustomerAccessTokenFromLocalStorage();
      fetcher.submit(
        {customerAccessToken: JSON.stringify(customerAccessToken)},
        {method: 'POST', action: `${pathPrefix}/account`},
      );
    }
  }, [JSON.stringify(fetchDependency)]);

  useEffect(() => {
    if (isPreviewModeEnabled && fetcher.data?.customer) {
      setPreviewModeCustomer(fetcher.data.customer);
    }
  }, [fetcher.data?.customer]);
}
