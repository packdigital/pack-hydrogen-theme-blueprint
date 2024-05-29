import {useCallback, useEffect} from 'react';
import {useFetcher} from '@remix-run/react';
import type {MailingAddress} from '@shopify/hydrogen/storefront-api-types';

import {
  getCustomerAccessTokenFromLocalStorage,
  usePreviewModeCustomerFetch,
} from '~/lib/customer';
import {useGlobal} from '~/hooks';

import {useFetcherStatus} from './useFetcherStatus';

interface FetcherData {
  address: MailingAddress;
  defaultAddress: MailingAddress;
  createErrors: string[];
  formErrors: string[];
}

export function useCustomerCreateAddress() {
  const {isPreviewModeEnabled} = useGlobal();
  const fetcher = useFetcher({key: 'create-address'});

  const {address, defaultAddress, createErrors, formErrors} = {
    ...(fetcher.data as FetcherData),
  };

  const {errors, setErrors, status} = useFetcherStatus({
    fetcherErrors: formErrors,
    state: fetcher.state,
  });

  const createAddress = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (status.started) return;
      setErrors([]);

      if (!e.currentTarget.country.value) {
        setErrors(['Missing country']);
        return;
      }
      if (!e.currentTarget.province.value) {
        setErrors(['Missing state/province']);
        return;
      }

      const formData = new FormData(e.currentTarget);
      formData.append('action', 'create-address');
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

  /* if in customizer, refetch customer after address creation */
  usePreviewModeCustomerFetch(address);

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;
    if (!createErrors?.length) return;
    createErrors.forEach((error) => {
      return console.error('customerCreateAddress:error', error);
    });
  }, [createErrors]);

  return {
    address,
    createAddress,
    defaultAddress,
    errors,
    status,
  };
}
