import {useEffect} from 'react';
import {useLoaderData} from '@remix-run/react';

import type {loader} from '~/routes/($locale).account.orders._index';

export function useCustomerOrders() {
  const {orders, errors} = useLoaderData<typeof loader>();

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;
    if (errors?.length) {
      errors.forEach((error) => {
        console.error('customerOrders:error', error);
      });
    }
  }, [errors]);

  return {orders};
}
