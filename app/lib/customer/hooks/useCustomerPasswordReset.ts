import {useCallback, useEffect, useMemo} from 'react';
import {useFetcher, useLocation} from '@remix-run/react';

import {useRootLoaderData} from '~/hooks';

import {useFetcherStatus} from './useFetcherStatus';

interface FetcherData {
  errors: string[] | null;
  formErrors: string[] | null;
}

export function useCustomerPasswordReset() {
  const fetcher = useFetcher({key: 'password-reset'});
  const {ENV, url} = useRootLoaderData();
  const location = useLocation();

  const {errors: apiErrors, formErrors} = {...(fetcher.data as FetcherData)};
  const {errors, setErrors, status} = useFetcherStatus({
    fetcherErrors: formErrors,
    state: fetcher.state,
  });

  const resetUrl = useMemo(() => {
    const baseUrl = `https://${ENV?.PUBLIC_STORE_DOMAIN}`;
    try {
      const newUrl = new URL(url);
      return `${baseUrl}${newUrl.pathname}`;
    } catch (error) {
      return `${baseUrl}${location.pathname}${location.search}`;
    }
  }, [ENV, url]);

  const resetPassword = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (status.started) return;
      setErrors([]);
      const {password, passwordConfirm} = e.currentTarget;
      if (password.value !== passwordConfirm.value) {
        setErrors(['Passwords do not match. Please try again.']);
        return;
      }
      const formData = new FormData(e.currentTarget);
      formData.append('url', resetUrl);
      formData.append('action', 'password-reset');
      fetcher.submit(formData, {method: 'POST'});
    },
    [resetUrl, status.started],
  );

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;
    if (!apiErrors?.length) return;
    apiErrors.forEach((error) => {
      return console.error('customerPasswordReset:error', error);
    });
  }, [apiErrors]);

  return {
    errors,
    resetPassword,
    status,
  };
}
