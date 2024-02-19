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
  errors: string[] | null;
  formErrors: string[] | null;
  registerFormErrors: string[] | null;
}

export function useCustomerRegister() {
  const fetcher = useFetcher({key: 'register'});
  const {
    customerAccessToken,
    customer,
    errors: apiErrors,
    registerFormErrors,
  } = {
    ...(fetcher.data as FetcherData),
  };
  const {errors, setErrors, status} = useFetcherStatus({
    fetcherErrors: registerFormErrors,
    state: fetcher.state,
  });
  const {buyerIdentityUpdate} = useCart();
  const navigate = useNavigate();
  const locale = useLocale();
  const {sendRegisterEvent} = useDataLayerClickEvents();

  const customerRegister = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (status.started) return;
      setErrors([]);
      const {password, passwordConfirm} = e.currentTarget;
      if (password.value !== passwordConfirm.value) {
        setErrors(['Passwords do not match. Please try again.']);
        return;
      }
      const formData = new FormData(e.currentTarget);
      formData.set('action', 'register');
      fetcher.submit(formData, {method: 'POST'});
    },
    [status.started],
  );

  useEffect(() => {
    if (customer) {
      sendRegisterEvent();
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
      return console.error('customerRegister:error', error);
    });
  }, [apiErrors]);

  return {customerRegister, errors, status};
}
