import {useEffect} from 'react';
import {useFetcher, useLoaderData} from '@remix-run/react';
import type {Order} from '@shopify/hydrogen-react/storefront-api-types';

import {getCustomerAccessTokenFromLocalStorage} from '~/lib/customer';
import {useGlobal} from '~/hooks';
import type {loader} from '~/routes/($locale).account.orders._index';

export function useCustomerOrders() {
  const {isPreviewModeEnabled} = useGlobal();
  const {orders, errors} = useLoaderData<typeof loader>();
  const fetcher = useFetcher<{orders: Order[]}>({key: 'orders'});

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;
    if (errors?.length) {
      errors.forEach((error) => {
        console.error('customerOrders:error', error);
      });
    }
  }, [errors]);

  /* while in customizer, orders must be fetched client side using customer
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

  return {orders: isPreviewModeEnabled ? fetcher.data?.orders : orders};
}
