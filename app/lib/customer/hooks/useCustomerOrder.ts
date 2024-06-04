import {useEffect} from 'react';
import {useFetcher, useLoaderData} from '@remix-run/react';
import type {Order} from '@shopify/hydrogen-react/storefront-api-types';

import {getCustomerAccessTokenFromLocalStorage} from '~/lib/customer';
import {useGlobal} from '~/hooks';
import type {loader} from '~/routes/($locale).account.orders.$id';

export function useCustomerOrder() {
  const {isPreviewModeEnabled} = useGlobal();
  const {order, errors} = useLoaderData<typeof loader>();
  const fetcher = useFetcher<{order: Order}>({key: 'orders'});

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;
    if (errors?.length) {
      errors.forEach((error) => {
        console.error('customerOrder:error', error);
      });
    }
  }, [errors]);

  /* while in customizer, order must be fetched client side using customer
   * acesss token from local storage */
  useEffect(() => {
    if (!isPreviewModeEnabled) return;
    const customerAccessToken = getCustomerAccessTokenFromLocalStorage();
    if (!customerAccessToken) return;
    const formData = new FormData();
    formData.append(
      'previewModeCustomerAccessToken',
      JSON.stringify(customerAccessToken),
    );
    fetcher.submit(formData, {method: 'POST'});
  }, []);

  return {order: isPreviewModeEnabled ? fetcher.data?.order : order};
}
