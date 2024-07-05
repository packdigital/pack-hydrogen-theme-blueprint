import {useCallback, useEffect} from 'react';
import {useFetcher, useNavigate, useRevalidator} from '@remix-run/react';
import {useCart} from '@shopify/hydrogen-react';
import type {
  Customer,
  CustomerAccessToken,
} from '@shopify/hydrogen/storefront-api-types';

import {LOGGED_IN_REDIRECT_TO} from '~/lib/constants';
import {setCustomerAccessTokenInLocalStorage} from '~/lib/customer';
import {useDataLayerClickEvents, useGlobal, useLocale} from '~/hooks';

import {useFetcherStatus} from './useFetcherStatus';

interface FetcherData {
  customerAccessToken: CustomerAccessToken;
  customer: Customer;
  errors: string[];
  loginFormErrors: string[];
}

export function useCustomerLogIn() {
  const revalidator = useRevalidator();
  const {isPreviewModeEnabled, setPreviewModeCustomer} = useGlobal();
  const fetcher = useFetcher();
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
  const {pathPrefix} = useLocale();
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
      revalidator.revalidate();
      /* when in customizer, customer is managed through local storage and
       * global state, instead of session cookies */
      if (isPreviewModeEnabled) {
        setPreviewModeCustomer(customer);
        setCustomerAccessTokenInLocalStorage(customerAccessToken);
      }
      /* Redirect to checkout if there is a checkout_url query param */
      const params = new URLSearchParams(window.location.search);
      const redirect = params.get('checkout_url');
      if (redirect) {
        try {
          const url = new URL(decodeURIComponent(redirect));
          window.location.href = url.href;
        } catch (error) {}
      } else {
        navigate(`${pathPrefix}${LOGGED_IN_REDIRECT_TO}`);
      }
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
