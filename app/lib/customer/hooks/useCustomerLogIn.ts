import {useCallback, useEffect} from 'react';
import {useFetcher, useNavigate} from '@remix-run/react';
import {useCart} from '@shopify/hydrogen-react';
import type {
  Customer,
  CustomerAccessToken,
} from '@shopify/hydrogen/storefront-api-types';

import {useDataLayerClickEvents, useLocale} from '~/hooks';

import {useFetcherStatus} from './useFetcherStatus';

interface FetcherData {
  customerAccessToken: CustomerAccessToken;
  customer: Customer;
  errors: string[];
  loginFormErrors: string[];
}

export function useCustomerLogIn() {
  const fetcher = useFetcher({key: 'login'});
  const {
    customerAccessToken,
    customer,
    errors: apiErrors,
    loginFormErrors,
  } = {
    ...(fetcher.data as FetcherData),
  };
  const {errors, setErrors, status} = useFetcherStatus({
    fetcherErrors: loginFormErrors,
    state: fetcher.state,
  });
  const {buyerIdentityUpdate} = useCart();
  const navigate = useNavigate();
  const locale = useLocale();
  const {sendLogInEvent} = useDataLayerClickEvents();

  const customerLogIn = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (status.started) return;
      setErrors([]);
      const formData = new FormData(e.currentTarget);
      formData.set('action', 'login');
      fetcher.submit(formData, {method: 'POST'});
    },
    [status.started],
  );

  useEffect(() => {
    if (customer) {
      sendLogInEvent();
      buyerIdentityUpdate({
        customerAccessToken: customerAccessToken.accessToken,
      });
      navigate(`${locale.pathPrefix}/account/orders`);
    }
  }, [buyerIdentityUpdate, !!customer]);

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;
    if (!apiErrors?.length) return;
    apiErrors.forEach((error) => {
      return console.error('customerLogIn:error', error);
    });
  }, [apiErrors]);

  return {customerLogIn, errors, status};
}
