import {useCallback, useEffect} from 'react';
import {useFetcher} from '@remix-run/react';

import {
  getCustomerAccessTokenFromLocalStorage,
  usePreviewModeCustomerFetch,
} from '~/lib/customer';
import {useGlobal} from '~/hooks';

import {useFetcherStatus} from './useFetcherStatus';

interface FetcherData {
  deletedCustomerAddressId: string;
  deleteErrors: string[];
}

export function useCustomerDeleteAddress() {
  const {isPreviewModeEnabled} = useGlobal();
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
      /* if in customizer, pass customer access token from storage */
      if (isPreviewModeEnabled) {
        const customerAccessToken = getCustomerAccessTokenFromLocalStorage();
        formData.append(
          'previewModeCustomerAccessToken',
          JSON.stringify(customerAccessToken),
        );
      }
      fetcher.submit(formData, {method: 'POST'});
    },
    [status.started],
  );

  /* if in customizer, refetch customer after address deletion */
  usePreviewModeCustomerFetch(deletedCustomerAddressId);

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
