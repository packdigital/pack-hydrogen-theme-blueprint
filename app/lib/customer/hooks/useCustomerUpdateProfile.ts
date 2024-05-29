import {useCallback, useEffect} from 'react';
import {useFetcher} from '@remix-run/react';
import type {Customer} from '@shopify/hydrogen/storefront-api-types';

import {
  getCustomerAccessTokenFromLocalStorage,
  usePreviewModeCustomerFetch,
} from '~/lib/customer';
import {useGlobal} from '~/hooks';

import {useFetcherStatus} from './useFetcherStatus';

interface FetcherData {
  customer: Customer;
  errors: string[] | null;
  formErrors: string[] | null;
}

export function useCustomerUpdateProfile() {
  const {isPreviewModeEnabled} = useGlobal();
  const fetcher = useFetcher({key: 'update-profile'});

  const {
    customer,
    errors: apiErrors,
    formErrors,
  } = {...(fetcher.data as FetcherData)};

  const {errors, setErrors, status} = useFetcherStatus({
    fetcherErrors: formErrors,
    state: fetcher.state,
  });

  const updateCustomerDetails = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (status.started) return;
      setErrors([]);
      const formData = new FormData(e.currentTarget);
      formData.append('action', 'update-profile');
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

  /* if in customizer, refetch customer after profile update */
  usePreviewModeCustomerFetch(customer);

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;
    if (!apiErrors?.length) return;
    apiErrors.forEach((error) => {
      return console.error('customerUpdateProfile:error', error);
    });
  }, [apiErrors]);

  return {
    customer,
    updateCustomerDetails,
    errors,
    status,
  };
}
