import {useEffect} from 'react';
import {useFetcher} from '@remix-run/react';
import type {Customer} from '@shopify/hydrogen/storefront-api-types';

import {getCustomerAccessTokenFromLocalStorage} from '~/lib/customer';
import {useGlobal, useLocale} from '~/hooks';

/*
 * When in customizer, customer is managed through local storage and
 * global state, instead of session cookies
 */

export function usePreviewModeCustomerInit() {
  const {isPreviewModeEnabled, previewModeCustomer, setPreviewModeCustomer} =
    useGlobal();
  const {pathPrefix} = useLocale();
  const fetcher = useFetcher<{customer: Customer | null | undefined}>();

  useEffect(() => {
    if (!isPreviewModeEnabled) return;
    const customerAccessToken = getCustomerAccessTokenFromLocalStorage();
    /* if customer access token is in local storage, fetch customer data */
    if (customerAccessToken && !previewModeCustomer) {
      const searchParams = new URLSearchParams({
        customerAccessToken: JSON.stringify(customerAccessToken),
      });
      fetcher.load(`${pathPrefix}/api/customer?${searchParams}`);
    } else {
      setPreviewModeCustomer(null);
    }
  }, []);

  useEffect(() => {
    if (fetcher.data?.customer) {
      setPreviewModeCustomer(fetcher.data.customer);
    }
  }, [fetcher.data?.customer?.id]);
}
