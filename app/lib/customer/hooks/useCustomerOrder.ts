import {useEffect} from 'react';
import {useLoaderData} from '@remix-run/react';

import type {loader} from '~/routes/($locale).account.orders.$id';

export function useCustomerOrder() {
  const {order, errors} = useLoaderData<typeof loader>();

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;
    if (errors?.length) {
      errors.forEach((error) => {
        console.error('customerOrder:error', error);
      });
    }
  }, [errors]);

  return {order};
}
