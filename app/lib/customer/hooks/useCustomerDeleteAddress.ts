import {useCallback, useEffect} from 'react';
import {useFetcher} from '@remix-run/react';

import {useFetcherStatus} from './useFetcherStatus';

interface FetcherData {
  deletedCustomerAddressId: string;
  deleteErrors: string[];
}

export function useCustomerDeleteAddress() {
  const fetcher = useFetcher({key: 'delete-address'});
  const {deletedCustomerAddressId, deleteErrors} = {
    ...(fetcher.data as FetcherData),
  };

  const {errors, setErrors, status} = useFetcherStatus({
    fetcherErrors: [],
    state: fetcher.state,
  });

  const deleteAddress = useCallback(
    ({id}: {id: string}) => {
      if (status.started) return;
      setErrors([]);
      const formData = new FormData();
      formData.append('id', id);
      formData.append('action', 'delete-address');
      fetcher.submit(formData, {method: 'POST'});
    },
    [status.started],
  );

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;
    if (!deleteErrors?.length) return;
    deleteErrors.forEach((error) => {
      return console.error('customerDeleteAddress:error', error);
    });
  }, [deleteErrors]);

  return {
    deleteAddress,
    deletedCustomerAddressId,
    errors,
    status,
  };
}
