import {useCallback, useEffect} from 'react';
import {useFetcher, useNavigate, useRevalidator} from '@remix-run/react';
import {useCart} from '@shopify/hydrogen-react';
import {useAnalytics} from '@shopify/hydrogen';
import type {
  Customer,
  CustomerAccessToken,
} from '@shopify/hydrogen/storefront-api-types';

import {AnalyticsEvent} from '~/components/Analytics/constants';
import {LOGGED_IN_REDIRECT_TO} from '~/lib/constants';
import {setCustomerAccessTokenInLocalStorage} from '~/lib/customer';
import {useLocale, usePreviewMode} from '~/hooks';

import {useFetcherStatus} from './useFetcherStatus';

interface FetcherData {
  customerAccessToken: CustomerAccessToken;
  customer: Customer;
  errors: string[];
  loginFormErrors: string[];
}

export function useCustomerLogIn() {
  const revalidator = useRevalidator();
  const {isPreviewModeEnabled, setPreviewModeCustomer} = usePreviewMode();
  const {publish} = useAnalytics();
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
      publish(AnalyticsEvent.CUSTOMER_LOGGED_IN, {customer});
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
  }, [!!customer]);

  useEffect(() => {
    if (customerAccessToken?.accessToken) {
      buyerIdentityUpdate({
        customerAccessToken: customerAccessToken.accessToken,
      });
    }
  }, [buyerIdentityUpdate, customerAccessToken?.accessToken]);

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;
    if (!apiErrors?.length) return;
    apiErrors.forEach((error) => {
      return console.error('customerLogIn:error', error);
    });
  }, [apiErrors]);

  return {customerLogIn, errors, status};
}
